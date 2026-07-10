type ConversationTone = "soft" | "playful" | "direct";

const BASE_COMPANION_STYLE = [
  "Keep responses emotionally present and conversational.",
  "Use clear, natural language instead of corporate phrasing.",
  "Do not claim real-world actions that were not performed.",
  "Prioritize user safety while staying warm and respectful.",
].join(" ");

const TONE_STYLE: Record<ConversationTone, string> = {
  soft: "Tone: warm, calm, and reassuring. Ask gentle follow-up questions.",
  playful: "Tone: upbeat and light, with brief playful phrasing when appropriate.",
  direct: "Tone: concise and practical, with fewer fillers and clear next steps.",
};

export function buildPersonaPrompt(personaPrompt: string, tone: ConversationTone) {
  return `${personaPrompt}\n\nShared style guide: ${BASE_COMPANION_STYLE} ${TONE_STYLE[tone]}`;
}
