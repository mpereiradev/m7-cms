import { Injectable } from '@nestjs/common';
import type {
  IWebhookService,
  WebhookPayload,
} from '../../application/ports/i-webhook.port.js';

@Injectable()
export class WebhookService implements IWebhookService {
  async fire(webhookUrl: string, payload: WebhookPayload): Promise<void> {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(
        `Webhook ${webhookUrl} responded with status ${response.status}`,
      );
    }
  }
}
