import { useRef, useState } from "react";
import { appLogger } from "@/lib/logger";

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

interface UseVoiceCompanionOptions {
  muted: boolean;
  preferredVoiceName?: string;
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

function pickPreferredVoice(voices: SpeechSynthesisVoice[]) {
  return (
    voices.find((voice) => /female|samantha|victoria|karen|fiona/i.test(voice.name)) ??
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
  const [availableVoices, setAvailableVoices] = useState<string[]>([]);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const hadResultRef = useRef(false);

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
  }

  function stopSpeaking() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    setSpeaking(false);
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
      return;
    }

    try {
      stopSpeaking();

      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch {
      setVoiceError("Microphone access was denied. You can continue by typing your message.");
      appLogger.warn({
        scope: "voice",
        event: "mic-permission-denied",
      });
      return;
    }

    try {
      const recognition = new SpeechRecognitionImpl();
      hadResultRef.current = false;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setVoiceActive(true);
        setVoiceError(null);
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

        setVoiceError(null);
        options.onTranscript(transcript);
      };

      recognition.onerror = (event: { error: string }) => {
        const fallback = "Voice input stopped unexpectedly. You can continue with text chat.";
        const message =
          event.error === "not-allowed"
            ? "Microphone access was denied. You can continue by typing your message."
            : event.error === "no-speech"
              ? "I didn’t catch that. Try speaking again or type your message."
              : fallback;

        setVoiceError(message);
        setVoiceActive(false);
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
    utterance.lang = "en-US";
    utterance.rate = options.voiceRate ?? 0.96;
    utterance.pitch = options.voicePitch ?? 1.03;

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((voice) => voice.name === options.preferredVoiceName) ??
      pickPreferredVoice(voices);
    if (preferred) {
      utterance.voice = preferred;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  return {
    voiceActive,
    voiceError,
    speaking,
    startRecognition,
    stopRecognition,
    stopSpeaking,
    speakText,
    availableVoices,
    refreshVoices,
    voiceSupported: Boolean(getSpeechRecognitionCtor()),
  };
}
