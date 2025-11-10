// services/resilientFetch.ts
export async function resilientFetch(
  url: string,
  options: RequestInit = {},
  retries = 3,
  timeout = 50000
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });

    if (!res.ok) throw new Error(`❌ HTTP Error: ${res.status}`);
    return res.json();
  } catch (error) {
    if (retries > 0) {
      console.warn(`⚠️ Retry (${3 - retries + 1}) for: ${url}`);
      await new Promise((resolve) => setTimeout(resolve, 500 * (4 - retries))); // backoff exponencial
      return resilientFetch(url, options, retries - 1, timeout);
    }

    throw error;
  } finally {
    clearTimeout(id);
  }
}
