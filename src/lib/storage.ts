import type { ChatMessage } from "@/lib/chat";

export interface AuthSession {
  id: string;
  name: string;
  displayName: string;
  email: string;
  createdAt: string;
  lastSeenAt: string;
}

export interface StoredConversation {
  personaId: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface AppPreferences {
  memoryEnabled: boolean;
  defaultTone: "soft" | "playful" | "direct";
  adultTopicsModeEnabled: boolean;
  adaptiveRoutingEnabled?: boolean;
  voiceName?: string;
  voiceRate: number;
  voicePitch: number;
}

const SESSION_KEY = "callme-ai-session";
const CONVERSATIONS_KEY = "callme-ai-conversations";
const PREFERENCES_KEY = "callme-ai-preferences";

function getStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readJson<T>(key: string, fallback: T): T {
  const storage = getStorage();
  if (!storage) return fallback;

  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage failures in private browsing mode
  }
}

export function loadSession(): AuthSession | null {
  return readJson<AuthSession | null>(SESSION_KEY, null);
}

export function saveSession(session: AuthSession) {
  writeJson(SESSION_KEY, session);
}

export function clearSession() {
  const storage = getStorage();
  storage?.removeItem(SESSION_KEY);
}

export function loadConversation(personaId: string): ChatMessage[] {
  const conversations = readJson<Record<string, StoredConversation>>(CONVERSATIONS_KEY, {});
  return conversations[personaId]?.messages ?? [];
}

export function saveConversation(personaId: string, messages: ChatMessage[]) {
  const storage = getStorage();
  if (!storage) return;

  const conversations = readJson<Record<string, StoredConversation>>(CONVERSATIONS_KEY, {});
  const nextMessages = messages.filter((message) => message.content?.trim());

  if (!nextMessages.length) {
    delete conversations[personaId];
    writeJson(CONVERSATIONS_KEY, conversations);
    return;
  }

  conversations[personaId] = {
    personaId,
    updatedAt: new Date().toISOString(),
    messages: nextMessages,
  };

  writeJson(CONVERSATIONS_KEY, conversations);
}

export function listConversations(): StoredConversation[] {
  const conversations = readJson<Record<string, StoredConversation>>(CONVERSATIONS_KEY, {});
  return Object.values(conversations).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function clearConversation(personaId: string) {
  const storage = getStorage();
  if (!storage) return;

  const conversations = readJson<Record<string, StoredConversation>>(CONVERSATIONS_KEY, {});
  delete conversations[personaId];
  writeJson(CONVERSATIONS_KEY, conversations);
}

export function clearAllConversations() {
  const storage = getStorage();
  storage?.removeItem(CONVERSATIONS_KEY);
}

export function loadPreferences(): AppPreferences {
  const stored = readJson<Partial<AppPreferences>>(PREFERENCES_KEY, {});

  return {
    memoryEnabled: true,
    defaultTone: "soft",
    adultTopicsModeEnabled: stored.adultTopicsModeEnabled ?? stored.adaptiveRoutingEnabled ?? true,
    voiceName: undefined,
    voiceRate: 0.96,
    voicePitch: 1.03,
    ...stored,
  };
}

export function savePreferences(preferences: AppPreferences) {
  writeJson(PREFERENCES_KEY, preferences);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("callme-ai-preferences-changed", { detail: preferences }));
  }
}
