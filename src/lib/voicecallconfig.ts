import type { VoiceProfile } from "./personas";

/** Zero-key path stays default. Providers activate only when env keys exist. */
export const VOICE_PROVIDER_VALUES = [
  "browser-native",
  "openai-realtime",
  "elevenlabs",
  "deepgram",
] as const;

export type VoiceProvider = (typeof VOICE_PROVIDER_VALUES)[number];

export interface VoiceCallConfig {
  locale: string;
  stt: {
    providerPriority: VoiceProvider[];
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
  };
  capture: {
    echoCancellation: boolean;
    noiseSuppression: boolean;
    autoGainControl: boolean;
    channelCount: number;
    sampleRate: number;
  };
  tts: {
    providerPriority: VoiceProvider[];
    volume: number;
    defaultVoiceProfile: VoiceProfile;
  };
  providers: Record<VoiceProvider, { enabled: boolean; configured: boolean; envKey?: string }>;
}

const providerSet = new Set<string>(VOICE_PROVIDER_VALUES);

function hasEnv(key: string) {
  const value = import.meta.env[key as keyof ImportMetaEnv];
  return typeof value === "string" && value.trim().length > 0;
}

function parseProviderList(raw: string | undefined, fallback: VoiceProvider[]): VoiceProvider[] {
  if (!raw?.trim()) {
    return fallback;
  }

  const parsed = raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item): item is VoiceProvider => providerSet.has(item));

  if (!parsed.length) {
    return fallback;
  }

  return Array.from(new Set(parsed));
}

const sttFallback: VoiceProvider[] = ["browser-native", "deepgram", "openai-realtime"];
const ttsFallback: VoiceProvider[] = ["browser-native", "elevenlabs", "openai-realtime"];

const defaultVoiceProfile: VoiceProfile = {
  rate: 0.96,
  pitch: 1.03,
  preferredVoicePatterns: ["female", "samantha", "victoria", "karen", "fiona"],
};

export const voiceCallConfig: VoiceCallConfig = {
  locale: import.meta.env.VITE_VOICE_LOCALE || "en-US",
  stt: {
    providerPriority: parseProviderList(import.meta.env.VITE_VOICE_STT_PROVIDERS, sttFallback),
    continuous: false,
    interimResults: false,
    maxAlternatives: 1,
  },
  capture: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    channelCount: 1,
    sampleRate: 48000,
  },
  tts: {
    providerPriority: parseProviderList(import.meta.env.VITE_VOICE_TTS_PROVIDERS, ttsFallback),
    volume: 1,
    defaultVoiceProfile,
  },
  providers: {
    "browser-native": { enabled: true, configured: true },
    "openai-realtime": {
      enabled: hasEnv("VITE_OPENAI_API_KEY") || hasEnv("OPENAI_API_KEY"),
      configured: hasEnv("VITE_OPENAI_API_KEY") || hasEnv("OPENAI_API_KEY"),
      envKey: "VITE_OPENAI_API_KEY",
    },
    elevenlabs: {
      enabled: hasEnv("VITE_ELEVENLABS_API_KEY") || hasEnv("ELEVENLABS_API_KEY"),
      configured: hasEnv("VITE_ELEVENLABS_API_KEY") || hasEnv("ELEVENLABS_API_KEY"),
      envKey: "VITE_ELEVENLABS_API_KEY",
    },
    deepgram: {
      enabled: hasEnv("VITE_DEEPGRAM_API_KEY") || hasEnv("DEEPGRAM_API_KEY"),
      configured: hasEnv("VITE_DEEPGRAM_API_KEY") || hasEnv("DEEPGRAM_API_KEY"),
      envKey: "VITE_DEEPGRAM_API_KEY",
    },
  },
};

export function resolveVoiceProfile(profile?: VoiceProfile): VoiceProfile {
  if (!profile) {
    return voiceCallConfig.tts.defaultVoiceProfile;
  }

  return {
    rate: profile.rate,
    pitch: profile.pitch,
    preferredVoicePatterns:
      profile.preferredVoicePatterns.length > 0
        ? profile.preferredVoicePatterns
        : voiceCallConfig.tts.defaultVoiceProfile.preferredVoicePatterns,
  };
}
