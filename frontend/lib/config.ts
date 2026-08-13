// Central API base URL — reads from environment in production, falls back to localhost
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
