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
  put: (path, body) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(body ?? {}),
    }),
  upload: async (path, files) => {
    const fileList = Array.isArray(files) ? files : [files].filter(Boolean);
    if (!fileList.length) {
      const error = new Error("No files to upload");
      error.response = { status: 400, data: { message: "파일을 선택하세요." } };
      throw error;
    }
    const formData = new FormData();
    fileList.forEach((file) => formData.append("files", file));
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error("Upload failed");
      error.response = { status: response.status, data };
      throw error;
    }
    return { data };
  },
};

export default apiClient;
