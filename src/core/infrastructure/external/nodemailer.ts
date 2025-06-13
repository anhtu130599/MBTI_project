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
