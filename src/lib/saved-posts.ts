import { getAuthUserId } from "@/lib/auth";

const SAVED_POST_IDS_KEY_PREFIX = "saved_post_ids";

function canUseDOM(): boolean {
  return typeof window !== "undefined";
}

function getStorageKey(): string | null {
  if (!canUseDOM()) return null;

  const authUserId = getAuthUserId();
  if (!authUserId) return null;

  return `${SAVED_POST_IDS_KEY_PREFIX}:${authUserId}`;
}

function readSavedPostIds(): Set<string> {
  const key = getStorageKey();
  if (!key) return new Set();

  const raw = localStorage.getItem(key);
  if (!raw) return new Set();

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();

    return new Set(parsed.map((value) => String(value)));
  } catch {
    return new Set();
  }
}

function writeSavedPostIds(postIds: Set<string>): void {
  const key = getStorageKey();
  if (!key) return;

  localStorage.setItem(key, JSON.stringify([...postIds]));
}

export function getSavedPostIdsSnapshot(): Set<string> {
  return readSavedPostIds();
}

export function persistSavedPostState(postId: string, savedByMe: boolean): void {
  const postIds = readSavedPostIds();
  const normalizedPostId = String(postId);

  if (savedByMe) {
    postIds.add(normalizedPostId);
  } else {
    postIds.delete(normalizedPostId);
  }

  writeSavedPostIds(postIds);
}
