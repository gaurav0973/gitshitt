const PRODUCTION_APP_URL = "https://gitshitt.mauryai.in";

export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_APP_URL;
  }

  return "http://localhost:3000";
}

export function getDodoWebhookUrl(): string {
  return `${getAppUrl()}/api/webhooks/dodo`;
}
