import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// A single shared transporter. Gmail with an App Password is the simplest
// SMTP setup and works without extra OAuth wiring.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

export async function sendOtpEmail(to: string, code: string): Promise<void> {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error(
      "Email is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.",
    );
  }

  await transporter.sendMail({
    from: `"Buy Me Coffee" <${GMAIL_USER}>`,
    to,
    subject: "Your password reset OTP code",
    text: `Your password reset code is ${code}. It expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 420px; margin: 0 auto;">
        <h2 style="margin-bottom: 8px;">Password reset</h2>
        <p style="color: #555; margin-top: 0;">
          Use the code below to reset your password. It expires in 10 minutes.
        </p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; text-align: center; padding: 16px 0;">
          ${code}
        </div>
        <p style="color: #999; font-size: 12px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
