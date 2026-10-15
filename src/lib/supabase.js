const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const headers = {
  apikey: import.meta.env.VITE_SUPABASE_APIKEY,
  "Content-Type": "application/json",
};

export async function fetchSupabase(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const responseBody = await response.text();
    const error = new Error(`Supabase request failed with status ${response.status}`);
    error.details = {
      status: response.status,
      statusText: response.statusText,
      responseBody,
    };
    throw error;
  }

  return response;
}