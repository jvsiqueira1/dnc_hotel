export const templateHTML = (userName: string, token: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - DNC Hotel</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; line-height: 1.6;">

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 45px 30px; text-align: center; position: relative; overflow: hidden;">
                            <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);"></div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); position: relative; z-index: 1;">DNC Hotel</h1>
                            <p style="margin: 15px 0 0 0; color: #ffffff; font-size: 17px; opacity: 0.95; font-weight: 300; position: relative; z-index: 1;">Password Reset Request</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: 600;">Hello ${userName},</h2>
                            
                            <p style="margin: 0 0 20px 0; color: #555555; font-size: 16px;">
                                You are receiving this email because you (or someone else) have requested a password reset for your DNC Hotel account.
                            </p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                                    <strong>Copie este token para redefinir sua senha:</strong>
                                </p>
                                <div style="display: inline-block; background-color: #f8f9fa; padding: 15px 25px; border-radius: 8px; border: 1px solid #dee2e6; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                                    <code style="font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Courier New', monospace; color: #495057; font-size: 15px; letter-spacing: 0.5px; user-select: all;">${token}</code>
                                </div>
                                <p style="color: #999999; font-size: 12px; margin-top: 15px; margin-bottom: 0;">
                                    This token expires in 30 minutes.
                                </p>
                            </div>
                            
                            <p style="margin: 30px 0 20px 0; color: #555555; font-size: 16px;">
                                If you did not request a password reset, please ignore this email and your password will remain unchanged.
                            </p>
                            
                            <div style="margin: 35px 0; padding: 25px; background: linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%); border-left: 4px solid #ef4444; border-radius: 8px; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);">
                                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                    <div style="width: 24px; height: 24px; background-color: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                        <span style="color: #ffffff; font-size: 14px; font-weight: bold;">!</span>
                                    </div>
                                    <p style="margin: 0; color: #dc2626; font-size: 15px; font-weight: 600;">Security Warning</p>
                                </div>
                                <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.5;">
                                    <strong>Never share this token with anyone!</strong> DNC Hotel will never ask for your password via email. Keep this token secure and confidential.
                                </p>
                            </div>
                            
                            <p style="margin: 0 0 10px 0; color: #555555; font-size: 16px;">Thank you,</p>
                            <p style="margin: 0 0 20px 0; color: #555555; font-size: 16px; font-weight: 600;">The DNC Hotel Team</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                                If you have any questions, please contact our support team.
                            </p>
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                &copy; ${new Date().getFullYear()} DNC Hotel. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
