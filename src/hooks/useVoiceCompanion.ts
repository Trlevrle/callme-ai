import { useRef, useState } from "react";
import { appLogger } from "@/lib/logger";
import type { VoiceProfile } from "@/lib/personas";
import { resolveVoiceProfile, voiceCallConfig } from "@/lib/voicecallconfig";
import { toast } from "sonner";

interface SpeechRecognitionEvent {
  readonly results: {
    readonly length: number;
    [index: number]: { readonly length: number; [index: number]: { readonly transcript: string } };
  };
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((_event: SpeechRecognitionEvent) => void) | null;
  onerror: ((_event: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

type VoiceRuntimeState =
  "idle" | "requesting-permission" | "listening" | "recognizing" | "speaking" | "error";

const MAX_NO_SPEECH_RETRIES = 2;

interface UseVoiceCompanionOptions {
  muted: boolean;
  preferredVoiceName?: string;
  voiceProfile?: VoiceProfile;
  voiceRate?: number;
  voicePitch?: number;
  onTranscript: (_text: string) => void;
  onDropped?: () => void;
}

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;

  const speechWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };

  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

function pickPreferredVoice(voices: SpeechSynthesisVoice[], patterns: string[]) {
  const matcher = new RegExp(patterns.join("|"), "i");

  return (
    voices.find((voice) => matcher.test(voice.name)) ??
    voices.find((voice) => voice.lang.startsWith("en")) ??
    voices[0]
  );
}

function unsupportedVoiceMessage() {
  if (typeof navigator === "undefined") {
    return "Voice input is not available in this browser. You can continue with text chat.";
  }

  const ua = navigator.userAgent;
  if (/firefox/i.test(ua)) {
    return "Voice input is limited in Firefox. You can continue with text chat, or try Chrome/Edge for microphone dictation.";
  }

  if (/safari/i.test(ua) && !/chrome|chromium|edg/i.test(ua)) {
    return "Voice input support is limited in Safari. You can continue with text chat, or use Chrome/Edge for microphone dictation.";
  }

  return "Voice input is not available in this browser. You can continue with text chat.";
}

export function useVoiceCompanion(options: UseVoiceCompanionOptions) {
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceRuntimeState>("idle");
  const [noSpeechRetries, setNoSpeechRetries] = useState(0);
  const [availableVoices, setAvailableVoices] = useState<string[]>([]);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const hadResultRef = useRef(false);
  const noSpeechRetriesRef = useRef(0);
  const lastNoSpeechToastAtRef = useRef(0);

  const voiceSupported = Boolean(getSpeechRecognitionCtor());
  const canRetry = noSpeechRetriesRef.current <= MAX_NO_SPEECH_RETRIES;

  function refreshVoices() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setAvailableVoices([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices().map((voice) => voice.name);
    setAvailableVoices(Array.from(new Set(voices)).sort());
  }

  function stopRecognition() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setVoiceActive(false);
    if (!speaking) {
      setVoiceState("idle");
    }
  }

  function stopSpeaking() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    setSpeaking(false);
    if (!voiceActive) {
      setVoiceState("idle");
    }
  }

  async function startRecognition() {
    if (voiceActive) {
      stopRecognition();
      setVoiceError(null);
      return;
    }

    const SpeechRecognitionImpl = getSpeechRecognitionCtor();
    if (!SpeechRecognitionImpl) {
      setVoiceError(unsupportedVoiceMessage());
      setVoiceState("error");
      return;
    }

    try {
      stopSpeaking();
      setVoiceState("requesting-permission");

      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: voiceCallConfig.capture.echoCancellation,
            noiseSuppression: voiceCallConfig.capture.noiseSuppression,
            autoGainControl: voiceCallConfig.capture.autoGainControl,
            channelCount: voiceCallConfig.capture.channelCount,
            sampleRate: voiceCallConfig.capture.sampleRate,
          },
        });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch {
      setVoiceError("Microphone access was denied. You can continue by typing your message.");
      setVoiceState("error");
      appLogger.warn({
        scope: "voice",
        event: "mic-permission-denied",
      });
      return;
    }

    try {
      const recognition = new SpeechRecognitionImpl();
      hadResultRef.current = false;
      recognition.continuous = voiceCallConfig.stt.continuous;
      recognition.interimResults = voiceCallConfig.stt.interimResults;
      recognition.lang = voiceCallConfig.locale;
      recognition.maxAlternatives = voiceCallConfig.stt.maxAlternatives;

      recognition.onstart = () => {
        setVoiceActive(true);
        setVoiceError(null);
        setVoiceState("listening");
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from({ length: event.results.length }, (_, i) => event.results[i])
          .map((result) => result[0]?.transcript ?? "")
          .join(" ")
          .trim();

        hadResultRef.current = Boolean(transcript);
        if (!transcript) {
          return;
        }

        noSpeechRetriesRef.current = 0;
        setNoSpeechRetries(0);
        setVoiceError(null);
        setVoiceState("recognizing");
        options.onTranscript(transcript);
      };

      recognition.onerror = (event: { error: string }) => {
        const fallback = "Voice input stopped unexpectedly. You can continue with text chat.";
        let message = fallback;

        if (event.error === "not-allowed") {
          message = "Microphone access was denied. You can continue by typing your message.";
        }

        if (event.error === "no-speech") {
          const nextRetryCount = noSpeechRetriesRef.current + 1;
          noSpeechRetriesRef.current = nextRetryCount;
          setNoSpeechRetries(nextRetryCount);

          const retryBudgetRemaining = nextRetryCount <= MAX_NO_SPEECH_RETRIES;
          message = retryBudgetRemaining
            ? "I didn't catch that. Tap the mic again and try once more."
            : "I still could not hear you. Please type your message or check your microphone.";

          const now = Date.now();
          if (now - lastNoSpeechToastAtRef.current > 1200) {
            toast("No speech detected", {
              description: retryBudgetRemaining
                ? "Tap the mic to retry, or continue with text."
                : "Retry limit reached. Continue in text mode.",
            });
            lastNoSpeechToastAtRef.current = now;
          }
        }

        setVoiceError(message);
        setVoiceActive(false);
        setVoiceState("error");
        appLogger.warn({
          scope: "voice",
          event: "recognition-error",
          details: { reason: event.error },
        });
      };

      recognition.onend = () => {
        const wasDropped = !hadResultRef.current && voiceActive;
        recognitionRef.current = null;
        setVoiceActive(false);
        if (!speaking) {
          setVoiceState("idle");
        }
        if (wasDropped) {
          options.onDropped?.();
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (error) {
      setVoiceError(
        error instanceof Error
          ? error.message
          : "Voice input failed. You can continue with text chat.",
      );
      setVoiceActive(false);
      setVoiceState("error");
      appLogger.error({
        scope: "voice",
        event: "recognition-start-failed",
        details: { message: error instanceof Error ? error.message : "unknown" },
      });
    }
  }

  function speakText(text: string) {
    if (options.muted || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    stopRecognition();
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    const resolvedProfile = resolveVoiceProfile(options.voiceProfile);

    utterance.lang = voiceCallConfig.locale;
    utterance.rate = options.voiceRate ?? resolvedProfile.rate;
    utterance.pitch = options.voicePitch ?? resolvedProfile.pitch;
    utterance.volume = voiceCallConfig.tts.volume;

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((voice) => voice.name === options.preferredVoiceName) ??
      pickPreferredVoice(voices, resolvedProfile.preferredVoicePatterns);
    if (preferred) {
      utterance.voice = preferred;
    }

    utterance.onstart = () => {
      setSpeaking(true);
      setVoiceState("speaking");
    };
    utterance.onend = () => {
      setSpeaking(false);
      if (!voiceActive) {
        setVoiceState("idle");
      }
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setVoiceState("error");
    };

    window.speechSynthesis.speak(utterance);
  }

  return {
    voiceActive,
    voiceError,
    speaking,
    voiceState,
    noSpeechRetries,
    canRetry,
    startRecognition,
    stopRecognition,
    stopSpeaking,
    speakText,
    availableVoices,
    refreshVoices,
    voiceSupported,
  };
}
