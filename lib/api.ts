const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {

  /**
   * Prefer admin token
   */

  const token =
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token");

  console.log("API_URL:", API_URL);
  console.log("ENDPOINT:", endpoint);
  console.log("FINAL URL:", `${API_URL}${endpoint}`);

  const res = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          token
            ? `Bearer ${token}`
            : "",

        ...options.headers,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {

    console.error(
      "API URL:",
      `${API_URL}${endpoint}`
    );

    console.error(
      "STATUS:",
      res.status
    );

    console.error(
      "DATA:",
      data
    );

    throw new Error(
      data.message || "API Error"
    );
  }

  return data;
}