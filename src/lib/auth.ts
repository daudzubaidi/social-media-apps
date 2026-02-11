const TOKEN_KEY = "auth_token";
const AUTH_TOKEN_CHANGE_EVENT = "auth-token-change";

function canUseDOM(): boolean {
  return typeof window !== "undefined";
}

function setAuthCookie(token: string): void {
  if (!canUseDOM()) return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`;
}

function clearAuthCookie(): void {
  if (!canUseDOM()) return;
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

function emitAuthTokenChange(): void {
  if (!canUseDOM()) return;
  window.dispatchEvent(new Event(AUTH_TOKEN_CHANGE_EVENT));
}

export function getToken(): string | null {
  if (!canUseDOM()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (!canUseDOM()) return;
  localStorage.setItem(TOKEN_KEY, token);
  setAuthCookie(token);
  emitAuthTokenChange();
}

export function clearToken(): void {
  if (!canUseDOM()) return;
  localStorage.removeItem(TOKEN_KEY);
  clearAuthCookie();
  emitAuthTokenChange();
}

export function getAuthSnapshot(): boolean {
  return !!getToken();
}

export function subscribeToAuthChanges(callback: () => void): () => void {
  if (!canUseDOM()) return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === TOKEN_KEY) callback();
  };
  const handleTokenChange = () => callback();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(AUTH_TOKEN_CHANGE_EVENT, handleTokenChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(AUTH_TOKEN_CHANGE_EVENT, handleTokenChange);
  };
}
