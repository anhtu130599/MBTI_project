import nodemailer from 'nodemailer';

// Cấu hình transporter cho Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Hàm gửi email xác thực đăng ký
export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Xác nhận đăng ký tài khoản',
    html: `
      <h1>Xác nhận đăng ký tài khoản</h1>
      <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhấn vào link dưới đây để xác nhận email của bạn:</p>
      <a href="${verifyUrl}">Xác nhận email</a>
      <p>Link này sẽ hết hạn sau 24 giờ.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

// Hàm gửi email đặt lại mật khẩu
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Đặt lại mật khẩu',
    html: `
      <h1>Đặt lại mật khẩu</h1>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào link dưới đây để đặt lại mật khẩu:</p>
      <a href="${resetUrl}">Đặt lại mật khẩu</a>
      <p>Link này sẽ hết hạn sau 1 giờ.</p>
      <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

// Hàm gửi email thông báo đổi mật khẩu thành công
export async function sendPasswordChangeNotificationEmail(email: string, userName?: string) {
  const currentTime = new Date().toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '🔐 Thông báo: Mật khẩu đã được thay đổi',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2E7D32; margin-bottom: 10px;">🔐 Thông báo bảo mật</h1>
          <p style="color: #666; font-size: 16px;">Mật khẩu tài khoản của bạn đã được thay đổi</p>
        </div>
        
        <div style="background-color: #E8F5E8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2E7D32; margin-top: 0;">Xin chào ${userName || 'bạn'}!</h2>
          <p style="margin: 0; line-height: 1.6;">
            Chúng tôi gửi email này để thông báo rằng mật khẩu cho tài khoản của bạn đã được thay đổi thành công.
          </p>
        </div>
        
        <div style="background-color: #F5F5F5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <strong>📅 Thời gian thay đổi:</strong> ${currentTime}
          <br><strong>📧 Email tài khoản:</strong> ${email}
          <br><strong>🌐 Địa chỉ IP:</strong> [Được ẩn vì lý do bảo mật]
        </div>
        
        <div style="background-color: #FFF3CD; padding: 15px; border-radius: 5px; border-left: 4px solid #FFC107; margin-bottom: 20px;">
          <h3 style="color: #856404; margin-top: 0;">⚠️ Bảo mật quan trọng</h3>
          <p style="margin: 0; color: #856404; line-height: 1.6;">
            <strong>Nếu bạn KHÔNG thực hiện thay đổi này:</strong>
            <br>• Tài khoản của bạn có thể đã bị xâm nhập
            <br>• Hãy liên hệ với chúng tôi ngay lập tức
            <br>• Thay đổi mật khẩu và kích hoạt xác thực 2 yếu tố nếu có thể
          </p>
        </div>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/login" 
             style="background-color: #1976D2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            🔑 Đăng nhập ngay
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <div style="text-align: center; color: #666; font-size: 14px;">
          <p style="margin: 5px 0;">📧 Email này được gửi tự động từ hệ thống MBTI Career Test</p>
          <p style="margin: 5px 0;">🚫 Vui lòng không trả lời email này</p>
          <p style="margin: 5px 0;">
            💡 <strong>Mẹo bảo mật:</strong> Luôn sử dụng mật khẩu mạnh và không chia sẻ cho ai
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password change notification email:', error);
    return false;
  }
} 
