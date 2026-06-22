import { Injectable } from '@nestjs/common';
import { createTransport, type Transporter } from 'nodemailer';
import type { IEmailNotificationService } from '../../application/use-cases/submit-contact-form.use-case.js';

@Injectable()
export class EmailNotificationService implements IEmailNotificationService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendContactNotification(
    toEmail: string,
    submission: {
      name: string;
      email: string;
      subject: string | null;
      message: string;
    },
  ): Promise<void> {
    const from = process.env.SMTP_FROM ?? 'noreply@m7cms.com';
    const subjectLine = submission.subject
      ? `Contact Form: ${submission.subject}`
      : 'New Contact Form Submission';

    await this.transporter.sendMail({
      from,
      to: toEmail,
      subject: subjectLine,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${submission.name}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        ${submission.subject ? `<p><strong>Subject:</strong> ${submission.subject}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${submission.message}</p>
      `,
    });
  }
}
