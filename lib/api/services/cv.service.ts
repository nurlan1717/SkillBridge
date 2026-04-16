const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:8080";

function normalizeBaseUrl(url: string): string {
  return (url || "http://localhost:8080").trim().replace(/\/+$/, "");
}

const API_BASE_URL = normalizeBaseUrl(RAW_API_URL);

export async function analyzeCv(file: File, token?: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/cv/analyze`, {
    method: "POST",
    body: formData,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `CV analyze request failed with status ${response.status}`);
  }

  return response.text();
}
