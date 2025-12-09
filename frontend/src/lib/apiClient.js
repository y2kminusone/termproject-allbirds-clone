const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error("Request failed");
    error.response = { status: response.status, data };
    throw error;
  }

  return { data };
};

const apiClient = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body ?? {}),
    }),
};

export default apiClient;
