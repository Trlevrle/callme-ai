# Enhanced Vite React TypeScript Template

This template includes built-in detection for missing CSS variables between your Tailwind config and CSS files.

## Features

- **CSS Variable Detection**: Automatically detects if CSS variables referenced in `tailwind.config.cjs` are defined in `src/index.css`
- **Enhanced Linting**: Includes ESLint, Stylelint, and custom CSS variable validation
- **Shadcn/ui**: Pre-configured with all Shadcn components
- **Modern Stack**: Vite + React + TypeScript + Tailwind CSS

## Available Scripts

```bash
# Run all linting (includes CSS variable check)
npm run lint

# Check only CSS variables
npm run check:css-vars

# Individual linting
npm run lint:js    # ESLint
npm run lint:css   # Stylelint
```

## CSS Variable Detection

The template includes a custom script that:

1. **Parses `tailwind.config.cjs`** to find all `var(--variable)` references
2. **Parses `src/index.css`** to find all defined CSS variables (`--variable:`)
3. **Cross-references** them to find missing definitions
4. **Reports undefined variables** with clear error messages

### Example Output

When CSS variables are missing:
```
❌ Undefined CSS variables found in tailwind.config.cjs:
   --sidebar-background
   --sidebar-foreground
   --sidebar-primary

Add these variables to src/index.css
```

When all variables are defined:
```
✅ All CSS variables in tailwind.config.cjs are defined
```

## How It Works

The detection happens during the `npm run lint` command, which will:
- Exit with error code 1 if undefined variables are found
- Show exactly which variables need to be added to your CSS file
- Integrate seamlessly with your development workflow

This prevents runtime CSS issues where Tailwind classes reference undefined CSS variables.

## Environment Variables

Copy [.env.example](.env.example) to `.env` (or `.env.local`) and fill in your keys.

```bash
cp .env.example .env
```

The template is split into two blocks:

- **Quick start (minimum):** only what you need to run
- **Advanced (optional):** model routing, provider tuning, and server alias vars

### Quick start (minimum)

- `VITE_OPENROUTER_API_KEY`
- `VITE_FAL_API_KEY`

### Required for image generation via FAL

Keep `VITE_FAL_API_KEY` set if you want FAL image generation.

### Optional but recommended

- `VITE_OPENROUTER_NSFW_API_KEY`
- `VITE_OPENROUTER_SFW_MODEL`
- `VITE_OPENROUTER_NSFW_MODEL`
- `VITE_OPENROUTER_FALLBACK_MODEL`
- `VITE_OPENROUTER_BASE_URL`
- `VITE_FAL_NSFW_API_KEY`
- `VITE_FAL_MODEL`
- `VITE_FAL_NSFW_MODEL`
- `VITE_FAL_BASE_URL`
- `VITE_IMAGE_PROVIDER` (`fal` or `openrouter`)
- `PUBLIC_URL` or `VITE_PUBLIC_URL` (used for provider referer headers)

### Multi-fallback routing (optional)

To add more fallback hops beyond primary keys/models:

- `VITE_OPENROUTER_SFW_MODEL_FALLBACK`
- `VITE_OPENROUTER_NSFW_MODEL_FALLBACK`
- `VITE_OPENROUTER_API_KEY_FALLBACK`
- `VITE_OPENROUTER_NSFW_API_KEY_FALLBACK`
- `VITE_FAL_MODEL_FALLBACK`
- `VITE_FAL_NSFW_MODEL_FALLBACK`
- `VITE_FAL_API_KEY_FALLBACK`
- `VITE_FAL_NSFW_API_KEY_FALLBACK`

Server aliases without `VITE_` are also supported.

### Voice provider (optional)

The current voice UI uses browser speech APIs. If you integrate ElevenLabs endpoints, these vars are available in `.env.example`:

- `VITE_ELEVENLABS_API_KEY` / `ELEVENLABS_API_KEY`
- `VITE_ELEVENLABS_VOICE_ID` / `ELEVENLABS_VOICE_ID`

### Adult topics mode

- Users can toggle **Adult topics mode** from chat and settings.
- When **off**, routing stays on safe-provider paths.
- When **on**, the API can use adult-capable fallback providers.
- Illegal or harmful content remains blocked.

### Recommended routing matrix

Chat (safe mode):

1. `OPENROUTER_SFW_MODEL` + `OPENROUTER_API_KEY`
2. `OPENROUTER_SFW_MODEL_FALLBACK` + `OPENROUTER_API_KEY_FALLBACK`
3. (only when Adult topics mode is on) `OPENROUTER_NSFW_MODEL` + `OPENROUTER_NSFW_API_KEY`
4. (only when Adult topics mode is on) `OPENROUTER_NSFW_MODEL_FALLBACK` + `OPENROUTER_NSFW_API_KEY_FALLBACK`

Images (safe mode):

1. `FAL_MODEL` + `FAL_API_KEY`
2. `FAL_MODEL_FALLBACK` + `FAL_API_KEY_FALLBACK`
3. (only when Adult topics mode is on) `FAL_NSFW_MODEL` + `FAL_NSFW_API_KEY`
4. (only when Adult topics mode is on) `FAL_NSFW_MODEL_FALLBACK` + `FAL_NSFW_API_KEY_FALLBACK`

### Runtime aliases supported by the server

Server routes also accept non-`VITE_` aliases, for example:

- `OPENROUTER_API_KEY`
- `OPENROUTER_NSFW_API_KEY`
- `OPENAI_API_KEY`
- `FAL_API_KEY`
- `FAL_NSFW_API_KEY`

See [.env.example](.env.example) for the full list.

### Git safety

- `.env` and `.env.*` are ignored by git.
- `.env.example` is intentionally tracked.