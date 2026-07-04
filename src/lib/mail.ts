import nodemailer from "nodemailer";

// SMTP Transporter configuration
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("[SMTP] Warning: SMTP credentials are not configured in your .env file. Email notifications will fall back to logging in the dev console.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port || "587", 10),
    secure: port === "465", // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

export async function sendPaymentSuccessEmail(toEmail: string, userName: string, planName: string, amount: number) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || "2all.ai <no-reply@2all.ai>";
  
  const subject = `Payment Confirmed - Your 2all.ai ${planName} Subscription is Active!`;
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px border #e2e8f0; border-radius: 16px; color: #1e293b;">
      <h2 style="color: #004bff; margin-bottom: 8px;">2all.ai</h2>
      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 20px;" />
      <p style="font-size: 16px; font-weight: bold; margin-top: 0;">Hi ${userName || "Subscriber"},</p>
      <p style="font-size: 14px; line-height: 1.5; color: #475569;">
        We are thrilled to confirm that your payment was successfully processed. Your 2all.ai <strong>${planName.toUpperCase()}</strong> plan is now active!
      </p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 24px 0; font-size: 13px; line-height: 1.6;">
        <h4 style="margin: 0 0 10px 0; color: #0f172a; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">Transaction Details</h4>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #64748b;">Plan Selected:</span>
          <strong style="color: #0f172a;">${planName.toUpperCase()}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="color: #64748b;">Amount Paid:</span>
          <strong style="color: #0f172a;">$${amount} (USD)</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #64748b;">Status:</span>
          <strong style="color: #10b981;">SUCCESSFUL</strong>
        </div>
      </div>

      <p style="font-size: 14px; line-height: 1.5; color: #475569;">
        You can now access full WCAG compliance crawling and expert remediation options directly from your user dashboard.
      </p>
      
      <div style="margin: 28px 0; text-align: center;">
        <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard" 
           style="background-color: #004bff; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">
          Go to Dashboard
        </a>
      </div>

      <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-top: 30px; margin-bottom: 16px;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
        &copy; ${new Date().getFullYear()} 2all.ai. All rights reserved.
      </p>
    </div>
  `;

  if (!transporter) {
    console.log(`[SMTP SIMULATOR] Email would be sent to: ${toEmail}\nSubject: ${subject}\nBody: ${htmlContent}`);
    return;
  }

  try {
    await transporter.sendMail({
      from,
      to: toEmail,
      subject,
      html: htmlContent,
    });
    console.log(`[SMTP] Payment success receipt sent to ${toEmail}`);
  } catch (err) {
    console.error("[SMTP] Failed to send payment confirmation email:", err);
  }
}

export async function sendDemoNotificationEmail(
  adminEmail: string,
  leadName: string,
  leadEmail: string,
  leadPhone: string,
  leadWebsite: string
) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || "2all.ai <no-reply@2all.ai>";
  const subject = `[New Lead] Demo Scheduled - ${leadName}`;
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; color: #1e293b;">
      <h3 style="color: #004bff; margin-top: 0;">2all.ai Lead Alert</h3>
      <p style="font-size: 14px; line-height: 1.5; color: #475569;">
        A new accessibility demo has been scheduled by a prospective client.
      </p>
      
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px; line-height: 1.8;">
        <h4 style="margin: 0 0 10px 0; color: #0f172a; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em;">Client Details</h4>
        <div><strong>Name:</strong> ${leadName}</div>
        <div><strong>Email:</strong> ${leadEmail}</div>
        <div><strong>Phone:</strong> ${leadPhone}</div>
        <div><strong>Website:</strong> <a href="${leadWebsite}" target="_blank" style="color: #004bff;">${leadWebsite}</a></div>
      </div>
      
      <p style="font-size: 12px; color: #94a3b8;">
        This lead is also saved and visible in the Form Builder tab of the Admin Console.
      </p>
    </div>
  `;

  if (!transporter) {
    console.log(`[SMTP SIMULATOR] Admin Lead notification would be sent to: ${adminEmail || "admin@gmail.com"}\nSubject: ${subject}\nBody: ${htmlContent}`);
    return;
  }

  try {
    await transporter.sendMail({
      from,
      to: adminEmail || "aiadmin@gmail.com",
      subject,
      html: htmlContent,
    });
    console.log(`[SMTP] Demo lead alert sent to admin`);
  } catch (err) {
    console.error("[SMTP] Failed to send demo lead alert email:", err);
  }
}
