/** Make Admin API requests fail loudly instead of letting UI state drift. */
export async function adminRequest<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const body = payload as { error?: unknown; message?: unknown } | null;
    const message = typeof body?.error === "string"
      ? body.error
      : typeof body?.message === "string"
        ? body.message
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  if (payload === null) {
    throw new Error("The server returned an unreadable response.");
  }

  return payload as T;
}
