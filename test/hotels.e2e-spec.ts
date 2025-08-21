/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import Redis from 'ioredis';
import * as jwt from 'jsonwebtoken';
import { CreateHotelDTO } from 'src/modules/hotels/domain/dto/create-hotel.dto';
import { UpdateHotelDTO } from 'src/modules/hotels/domain/dto/update-hotel.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import request from 'supertest';
import { AppModule } from '../src/app.module';

jest.mock('ioredis', () => {
  const moduleRedis = jest.fn().mockImplementation(() => ({
    del: jest.fn().mockResolvedValue(1),
    get: jest.fn().mockResolvedValue(JSON.stringify([{ key: 'mock-value' }])),
    quit: jest.fn().mockResolvedValue(null),
  }));
  return { __esModule: true, default: moduleRedis, Redis: moduleRedis };
});

describe('HotelsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let userToken: string;
  let redisClient: Redis;
  let hotelId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    redisClient = new Redis();
    prisma = app.get(PrismaService);

    await app.init();

    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin',
        role: Role.ADMIN,
      },
    });

    const normalUser = await prisma.user.create({
      data: {
        name: 'User',
        email: 'user@example.com',
        password: 'user',
        role: Role.USER,
      },
    });

    adminToken = jwt.sign(
      { sub: adminUser.id, role: Role.ADMIN },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h', issuer: 'dnc_hotel', audience: 'users' },
    );

    userToken = jwt.sign(
      { sub: normalUser.id, role: Role.USER },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h', issuer: 'dnc_hotel', audience: 'users' },
    );
  });

  afterAll(async () => {
    await prisma.hotel.deleteMany({});
    await prisma.user.deleteMany({});
    await redisClient.quit();
    await app.close();
  });

  it('/hotels (POST)', async () => {
    const createHotelDto: CreateHotelDTO = {
      name: 'Test Hotel',
      description: 'Test Description',
      price: 100,
      address: 'Test Address',
      ownerId: 1,
    };

    const response = await request(app.getHttpServer())
      .post('/hotels')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(createHotelDto)
      .expect(201);

    hotelId = response.body.id;

    expect(response.body).toMatchObject({
      name: createHotelDto.name,
      description: createHotelDto.description,
      price: createHotelDto.price,
      address: createHotelDto.address,
    });
  });

  it('/hotels (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/hotels')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data).toHaveLength(1);
  });

  it('/hotels/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/hotels/${hotelId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: hotelId,
      name: 'Test Hotel',
    });
  });

  it('/hotels/:id (PATCH)', async () => {
    const updateHotelDto: UpdateHotelDTO = {
      name: 'Updated Hotel',
    };

    const response = await request(app.getHttpServer())
      .patch(`/hotels/${hotelId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updateHotelDto)
      .expect(200);

    expect(response.body).toMatchObject({
      name: updateHotelDto.name,
    });
  });

  it('/hotels/image/:hotelId (PATCH)', async () => {
    await request(app.getHttpServer())
      .patch(`/hotels/image/${hotelId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('image', Buffer.from('mock-file-content'), 'mock-file.jpg')
      .expect(200);
  });

  it('/hotels/:id (DELETE', async () => {
    await request(app.getHttpServer())
      .delete(`/hotels/${hotelId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
