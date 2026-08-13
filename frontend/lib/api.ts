// Central API base URL.
// In production, set NEXT_PUBLIC_API_URL in your Vercel environment variables.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default API_BASE;
