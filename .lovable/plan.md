## Cilj

Umjesto landinga — gradim **design system stranicu** koja definira i prikazuje sve tokene, komponente i states za budući AI voice chat app. Estetika: crna baza (shadcn-chatbot-kit) + Lovable aurora akcenti (blue → violet → pink → coral) + Fraunces/Inter tipografija.

Sve na jednoj ruti (`/`) kao interaktivni "style guide" — svaki dio jasno labeliran i vizualno prikazan.

## Struktura stranice

### 1. Color tokens
Prikaz svih semantic tokena kao swatch grid s hex/oklch vrijednostima:
- `background` / `foreground`
- `muted` / `muted-foreground`
- `card` / `card-foreground`
- `primary` / `primary-foreground` (hot pink akcent)
- `secondary` / `secondary-foreground`
- `accent` / `accent-foreground` (violet)
- `border`, `ring`, `destructive`
- Aurora gradient stops (blue/violet/pink/coral) — samo za dekoraciju

Svi tokeni definirani u `src/styles.css` (`:root` + `@theme inline`).

### 2. Typography
- **Font family**: Fraunces (display/serif) + Inter (sans/UI) preko `<link>` u `__root.tsx`
- Skala: xs / sm / base / lg / xl / 2xl / 3xl / 4xl / 5xl / 6xl s primjerima
- Weights: 400 / 500 / 600 / 700
- Line heights: tight / normal / relaxed
- Show: display heading (Fraunces italic), UI text (Inter), caption

### 3. Spacing & Radius
- Spacing scale: 1/2/3/4/6/8/12/16/24 (Tailwind) — vizualne bar-line demonstracije
- Border radius: sm (6px) / md (10px) / lg (14px) / xl (20px) / full — swatch kartice

### 4. Komponente (sa states)
Svaka komponenta prikazana u vlastitoj kartici s labeliranim stanjima:
- **Button**: variants (primary / secondary / ghost / outline / destructive) × states (default / hover / active / disabled / loading)
- **Input**: default / focus / filled / error / disabled
- **Card**: base + elevated
- **Message bubble**: user (pink gradient, desno) + assistant (zinc-900, lijevo) + typing indicator
- **Sidebar item**: default / hover / active / collapsed
- **Avatar**: sizes (sm/md/lg) + fallback + s indikatorom
- **Modal / Dialog**: static mock
- **Dropdown / Menu**: otvoreno stanje s items
- **Tooltip**: hover primjer
- **Toast**: success / error / info varijante

### 5. Layout
- Grid struktura (12-col demo)
- Sidebar width: 280px expanded / 64px collapsed
- Container max-width: 1280px
- Breakpoints tabela: sm 640 / md 768 / lg 1024 / xl 1280

### 6. Interakcije
Live-demo blok:
- Hover states (button, card, link)
- Focus rings (ring-2 ring-accent na inputu/buttonu)
- Active/pressed states
- Transition timing: fast 150ms / base 200ms / slow 300ms, ease-out
- Aurora drift + voice pulse animation demo

### 7. Ikone & Assets
- Icon set: **lucide-react** — mini grid s 8-10 primjera (Mic, MessageCircle, Settings, User, Send itd.)
- Logo: gradient orb mark + "vocalis" wordmark u Fraunces italic — small/medium/large varijante
- Ilustracije: napomena "custom persona portraits generated per persona" + 1-2 placeholder generirana atmosferska slike

### 8. Sekcije & Flow (mockovi)
Statični wireframe/mockup pregled — po jedna mala kartica za svaki:
- **Redoslijed ekrana**: Onboarding (3 koraka) → Persona select → Chat → Settings
- **Navigacija**: bottom nav (mobile) / sidebar (desktop) mock
- **Empty state**: "No conversations yet" ilustracija + CTA
- **Loading state**: skeleton + shimmer + typing dots
- **Error state**: friendly error card s retry akcijom

## Tehnički detalji

- **Ruta**: samo `src/routes/index.tsx` (zamjenjuje placeholder). Bez novih ruta i backenda.
- **Tokeni**: definirani u `src/styles.css` (`:root` s oklch vrijednostima + `@theme inline` mapping). Bez `bg-white`/`bg-[#...]` u komponentama.
- **Fontovi**: Fraunces + Inter preko `<link>` u `src/routes/__root.tsx` `head()` (nikad `@import` URL-a u CSS).
- **Head metadata**: pravi title/description/og ("Vocalis Design System" umjesto placeholdera).
- **Shadcn komponente**: koristim postojeće (Button, Input, Card, Dialog, DropdownMenu, Tooltip, Sonner toast, Avatar) i prikazujem njihove variants + states. Instaliram što fali preko shadcn CLI.
- **Ikone**: `lucide-react`.
- **Slike**: 1-2 atmosferska placeholder portreta preko `imagegen` u `src/assets/` za persona sekciju.
- **Animacije**: čisti CSS keyframes (aurora drift, voice pulse, typing dots, shimmer) — bez motion libraryja.

## Van scopea

- Nema funkcionalnog chata, voice API-a, auth, DB, routinga između ekrana.
- Screen mockovi u sekciji 8 su statični placeholder karticе, ne stvarne rute.
- Sidebar/bottom nav su prikazani kao vizualni primjerak, ne globalna app navigacija.
