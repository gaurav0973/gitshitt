import { Webhook } from "standardwebhooks";

interface WebhookHeaders {
  webhookId: string;
  webhookSignature: string;
  webhookTimestamp: string;
}

export function verifyDodoWebhook(
  rawBody: string,
  headers: WebhookHeaders,
  secret: string,
): boolean {
  if (!secret || !headers.webhookId || !headers.webhookSignature) {
    return false;
  }

  try {
    const webhook = new Webhook(secret);
    webhook.verify(rawBody, {
      "webhook-id": headers.webhookId,
      "webhook-signature": headers.webhookSignature,
      "webhook-timestamp": headers.webhookTimestamp,
    });
    return true;
  } catch {
    return false;
  }
}
