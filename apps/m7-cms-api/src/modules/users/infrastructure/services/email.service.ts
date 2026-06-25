import { Injectable } from '@nestjs/common';
import { createTransport, type Transporter } from 'nodemailer';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { IEmailService } from '../../application/use-cases/invite-user.use-case.js';

@Injectable()
export class EmailService implements IEmailService {
  private transporter: Transporter;
  private _supabase: SupabaseClient | null = null;

  constructor() {
    this.transporter = createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private get supabase(): SupabaseClient | null {
    if (!this._supabase) {
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SECRET_KEY;
      if (url && key && !key.startsWith('placeholder')) {
        this._supabase = createClient(url, key);
      }
    }
    return this._supabase;
  }

  async sendInvitation(email: string, tenantName: string): Promise<void> {
    if (this.supabase) {
      const { error: supabaseError } =
        await this.supabase.auth.admin.inviteUserByEmail(email);
      if (supabaseError) {
        console.error(
          `Supabase invite error for ${email}:`,
          supabaseError.message,
        );
      }
    }

    try {
      const from = process.env.SMTP_FROM ?? 'noreply@m7cms.com';
      await this.transporter.sendMail({
        from,
        to: email,
        subject: `You have been invited to join ${tenantName}`,
        html: `
          <h2>Welcome!</h2>
          <p>You have been invited to collaborate on <strong>${tenantName}</strong> in the M7 CMS platform.</p>
          <p>Please check your email for a login link, or sign in at the admin panel.</p>
        `,
      });
    } catch (err) {
      console.error(`SMTP send error for ${email}:`, (err as Error).message);
    }
  }
}
