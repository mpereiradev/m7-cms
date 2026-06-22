import { Injectable } from '@nestjs/common';
import { createTransport, type Transporter } from 'nodemailer';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { IEmailService } from '../../application/use-cases/invite-user.use-case.js';

@Injectable()
export class EmailService implements IEmailService {
  private transporter: Transporter;
  private supabase: SupabaseClient;

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

    this.supabase = createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    );
  }

  async sendInvitation(email: string, tenantName: string): Promise<void> {
    // Use Supabase Admin API to send a magic link invitation
    const { error: supabaseError } =
      await this.supabase.auth.admin.inviteUserByEmail(email);

    if (supabaseError) {
      console.error(
        `Supabase invite error for ${email}:`,
        supabaseError.message,
      );
    }

    // Also send a custom notification via SMTP
    const from = process.env.SMTP_FROM ?? 'noreply@m7cms.com';

    await this.transporter.sendMail({
      from,
      to: email,
      subject: `You have been invited to join ${tenantName}`,
      html: `
        <h2>Welcome!</h2>
        <p>You have been invited to collaborate on <strong>${tenantName}</strong> in the M7 CMS platform.</p>
        <p>Please check your email for a login link from Supabase Auth, or sign in at the admin panel.</p>
        <br>
        <p>If you did not expect this invitation, you can safely ignore this email.</p>
      `,
    });
  }
}
