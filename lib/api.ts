const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token
          ? `Bearer ${token}`
          : "",
        ...options.headers,
      },
    }
  );

  /**
   * SAFELY PARSE RESPONSE
   */

  let data;

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  /**
   * DEBUGGING
   */

  console.log("API URL:", `${API_URL}${endpoint}`);
  console.log("STATUS:", res.status);
  console.log("DATA:", data);

  if (!res.ok) {

    throw new Error(
      data.message ||
      `Request failed: ${res.status}`
    );
  }

  return data;
}