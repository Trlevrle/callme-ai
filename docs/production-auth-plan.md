# Production Auth Plan (Minimal)

## Goal
Ship a production-safe authentication flow with minimal complexity and no over-engineering.

## Current State
- Auth is currently local-session based (browser storage).
- It is suitable for prototype UX only, not production security.

## Target State
- Server-validated user identity.
- Session/token cannot be forged by manually editing localStorage.
- Route access and billing entitlement checks rely on trusted server state.

## Scope (Minimal)
1. Keep current UI screens and route structure.
2. Replace local-only sign-in with backend auth exchange.
3. Store only a non-sensitive auth marker client-side; trust server for protected data.
4. Keep existing preferences/conversation local storage behavior unchanged for now.

## Implementation Steps
1. Add auth endpoint(s)
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`

2. Session strategy
- Use HTTP-only secure cookie for session id/token.
- Validate cookie server-side on protected requests.

3. Update client auth hook
- `useAuth` should fetch `/api/auth/session` on load.
- `signIn` should call `/api/auth/login`.
- `signOut` should call `/api/auth/logout` and clear client state.

4. Protect app routes
- Existing guarded routes stay, but authenticated state must come from session endpoint.

5. Billing compatibility
- Map session user id/email to payment customer id on backend.
- Never trust client-provided user identity for billing actions.

## Acceptance Criteria
- Manually editing localStorage cannot grant authenticated access.
- Refresh keeps user signed in only with valid server session.
- Sign-out invalidates server session and access immediately.
- Protected API calls fail without valid session.

## Out of Scope (for this minimal pass)
- OAuth provider expansion.
- Multi-factor auth.
- Fine-grained RBAC.
- Full account management portal.

## Rollout Notes
- Keep a short transition window where old local sessions are ignored and users are prompted to sign in once.
- Add a one-time migration notice in auth UI.
