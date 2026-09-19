import { createHmac, timingSafeEqual } from "node:crypto";

interface WebhookHeaders {
  webhookId: string;
  webhookSignature: string;
  webhookTimestamp: string;
}

function parseSignatureHeader(header: string): string[] {
  return header
    .split(" ")
    .flatMap((part) => part.split(","))
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && !part.startsWith("v"));
}

export function verifyDodoWebhook(
  rawBody: string,
  headers: WebhookHeaders,
  secret: string,
): boolean {
  if (!secret || !headers.webhookId || !headers.webhookSignature) {
    return false;
  }

  const signedContent = [
    headers.webhookId,
    headers.webhookTimestamp,
    rawBody,
  ].join(".");

  const expected = createHmac("sha256", secret)
    .update(signedContent)
    .digest("base64");

  const candidates = parseSignatureHeader(headers.webhookSignature);
  if (candidates.length === 0) {
    candidates.push(headers.webhookSignature);
  }

  const expectedBuffer = Buffer.from(expected);
  for (const candidate of candidates) {
    try {
      const candidateBuffer = Buffer.from(candidate);
      if (
        candidateBuffer.length === expectedBuffer.length &&
        timingSafeEqual(candidateBuffer, expectedBuffer)
      ) {
        return true;
      }
    } catch {
      // try next candidate
    }
  }

  return false;
}
