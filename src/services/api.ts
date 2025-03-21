// src/services/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const fetchAnalytics = async (token: string) => {
  const response = await fetch(`${API_URL}/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
