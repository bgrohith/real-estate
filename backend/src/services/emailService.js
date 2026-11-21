import nodemailer from 'nodemailer';

/**
 * Send email using Nodemailer with fallback to console preview
 * @param {Object} options - { email, subject, message, html }
 */
export const sendEmail = async (options) => {
  const isSmtpConfigured = Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );

  if (isSmtpConfigured) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const message = {
        from: `"${process.env.FROM_NAME || 'BuyYourProperty Luxury Estates'}" <${process.env.FROM_EMAIL || 'support@buyyourproperty.in'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
      };

      const info = await transporter.sendMail(message);
      console.log(`[Email Sent] Message ID: ${info.messageId} to ${options.email}`);
      return info;
    } catch (error) {
      console.error('[Nodemailer Error]', error.message);
      console.log('[Email Fallback] Email content:\n', options.html || options.message);
      return null;
    }
  } else {
    console.log(
      '\n==================== [NODEMAILER LOCAL PREVIEW] ====================\n' +
      `To: ${options.email}\n` +
      `Subject: ${options.subject}\n` +
      `Message: ${options.message}\n` +
      '====================================================================\n'
    );
    return { preview: true };
  }
};
