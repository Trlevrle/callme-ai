# Copilot Project Context (Persistent Handoff)

Purpose
- Keep a stable context snapshot for new chat sessions.
- Reduce loss of decisions when a new thread is opened.

Current product direction
- App uses safe-by-default routing for chat and image generation.
- Adult topics mode must be explicit and always available in chat/settings.
- Browser-side provider client is intentionally disabled for security.
- Server API routes own provider calls, keys, fallback chains, and rate limiting.

Security posture
- Env secrets must stay in local .env files, never in tracked source.
- .env.example is template-only and safe for repo.
- Repo should remain private unless intentionally changed.

Operational defaults
- Before publish: run lint and verify diagnostics.
- For release/launch-freeze cleanup use: npm run launch:freeze:cleanup-docs
- Keep docs cleanup as a dedicated commit if executed.

Post-cleanup integrity baseline (2026-07-10)
- Project source files were audited after a system cleanup pass; no tracked app files were missing.
- npm runtime corruption was outside the repo (global Node/npm install) and was recovered.
- Current validation baseline: lint clean and TypeScript check clean.

Known architecture facts
- Frontend: React + TanStack Router/Start + Vite.
- Server endpoints: server/api/chat.post.ts and server/api/image.post.ts.
- Runtime env loader/aliasing: server/utils/env.ts.

New chat bootstrap checklist (for Copilot)
1. Read this file first.
2. Check git status and latest commit.
3. Run workspace diagnostics and lint if code edits are requested.
4. Continue from existing constraints without re-opening solved items.

Maintenance mode expectation
- User prefers minimal back-and-forth and wants end-to-end execution (lint, fixes, commit, push) when explicitly requested.
- If something cannot be automated in-session, clearly state the exact manual click/path needed.
