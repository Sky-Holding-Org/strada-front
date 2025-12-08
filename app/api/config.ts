const API_BASE_URL =
  "https://strada-backend-production-c184.up.railway.app/api";
const API_TOKEN = process.env.NEXT_PUBLIC_REST_API_KEY;

if (!API_TOKEN) {
  console.warn("Warning: KEY is not set");
}

export const apiConfig = {
  baseUrl: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
  },
};

