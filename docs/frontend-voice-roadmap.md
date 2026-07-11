# Call Me AI Frontend + Voice Roadmap

Last updated: 2026-07-11
Owner: product + frontend
Status: active (next improvement round)

## 1. Current Product Snapshot

- Stack: React + TypeScript + TanStack Start + Vite + Tailwind.
- Public pages and legal pages are live and aligned with privacy-first tone.
- Chat supports text + browser voice input/output.
- Adult Topics Mode is explicit and user-controlled.
- Billing/usage backend integrations are intentionally pending until key setup is finished.

## 2. Frontend Goals For Next Round

- Keep launch-ready UX stable while improving perceived quality.
- Improve conversion flow on marketing pages without changing legal intent.
- Improve voice experience quality and reliability with provider-ready config.
- Keep zero regression on safety boundaries and 18+ gating.

## 3. Voice Experience Goal (Top Tier)

Target outcome:
- Fast mic start.
- Clear recognition in noisy environments.
- Natural playback voice defaults.
- Predictable fallback to text when voice is unavailable.

Implemented in this round:
- Centralized voice runtime config in src/lib/voicecallconfig.ts.
- Enhanced microphone constraints for quality capture:
  - echoCancellation: true
  - noiseSuppression: true
  - autoGainControl: true
  - sampleRate: 48000
  - channelCount: 1
- Config-driven STT defaults (locale, alternatives, recognition mode).
- Config-driven TTS defaults (voice rate/pitch/volume, preferred voice patterns).
- Provider-priority config placeholders for STT/TTS (browser-native + external providers).
- Idle hint message in chat rendered in italic for better visual hierarchy.

## 4. Provider-Ready Configuration

Environment variables prepared:
- VITE_VOICE_LOCALE
- VITE_VOICE_STT_PROVIDERS
- VITE_VOICE_TTS_PROVIDERS

Example provider order values (comma-separated):
- VITE_VOICE_STT_PROVIDERS=browser-native,deepgram,openai-realtime
- VITE_VOICE_TTS_PROVIDERS=browser-native,elevenlabs,openai-realtime

Note:
- No API keys are required to keep browser-native voice path fully functional.
- External provider wiring can be enabled as soon as keys are finalized.

## 5. Frontend Execution Plan (Next Sprint)

Phase A - UX polish
- Improve chat input state transitions (listen/think/speak microfeedback).
- Add explicit retry affordance on recognition no-speech states.
- Add short visual indicator for active selected voice profile.

Phase B - Conversion + trust
- Refine pricing CTA microcopy with secure checkout cues.
- Keep legal links visible at all conversion touchpoints.
- Verify mobile readability across all legal and pricing sections.

Phase C - Voice provider bridge
- Add optional server endpoints for external STT/TTS provider fallback.
- Keep browser-native voice as zero-key fallback.
- Add telemetry events for voice-start latency and recognition failure reasons.

## 6. Acceptance Criteria

Frontend quality:
- No blocking runtime errors.
- No regression in existing legal/privacy pages.
- Voice disabled browsers still complete full text-chat flow.

Voice quality:
- Mic permission denied state is clear and recoverable.
- Unsupported browser state always includes text fallback path.
- Playback and recognition use configured locale and defaults.

## 7. Out Of Scope Until Keys Are Ready

- Production external STT/TTS API activation.
- Billing-coupled voice quotas by plan.
- Provider cost optimization by dynamic routing.

## 8. Files Updated In This Round

- src/components/VoiceIndicator.tsx
- src/routes/chat.$personaId.tsx
- src/hooks/useVoiceCompanion.ts
- src/lib/voicecallconfig.ts
- src/lib/voice-call-config.ts
- src/routes/index.tsx
- src/routes/pricing.tsx
- .env.example

## 9. Competitor Gap Analysis (NOW / NEXT / LATER)

| Capability | NOW | NEXT | LATER |
| --- | --- | --- | --- |
| Persona discovery grid | Live in app home with tier + gradient cards | Add richer filtering (mood, tempo, tier) | Personalized ranking by usage patterns |
| Persona gallery/media | Basic persona visuals + avatar fallback | Add generated persona gallery previews | Add user-curated gallery collections |
| Streaks and retention loops | Not yet implemented | Add simple daily conversation streaks | Add adaptive streak coaching + milestone scenes |
| Voice latency meter | Phase rail + thinking pulse only | Add explicit latency meter component in call view | Add provider-level latency comparison routing |
| Voice telemetry | Basic logger events for voice errors | Capture start latency and failure reasons | Plan-aware quality routing optimization |
| Voice/text fallback states | Browser-native fallback + text fallback live | Add richer retry CTAs per failure reason | Add predictive fallback before failure |
