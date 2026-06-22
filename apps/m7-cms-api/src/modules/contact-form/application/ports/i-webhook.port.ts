export const WEBHOOK_SERVICE = Symbol('WEBHOOK_SERVICE');

export interface WebhookPayload {
  event: string;
  tenantId: string;
  data: Record<string, unknown>;
}

export interface IWebhookService {
  fire(webhookUrl: string, payload: WebhookPayload): Promise<void>;
}
