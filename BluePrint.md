# Blog Card Interaction Grid — Project Plan

## 1. Concept recap
A row of blog cards (like the uploaded design). Each card has a link that turns
*that card only* into a small interactive widget, in place, with no page
reload and no effect on any other card:

- **Card 1 — Timer**: "Start timer" → stopwatch/countdown inside the card.
  Ctrl+P pause, Ctrl+X close, Ctrl+R restart — but only while *this* card is
  active.
- **Card 2 — Counter**: "Start counter" → increment/decrement UI in place.
- **Card 3 — Like/Dislike**: "React" → vote buttons + tally in place.
- **Card 4 — Expand & fetch**: "Read full post" → AJAX-fetches the full post
  body and renders it inline, collapsible.

Cards have no fixed click order and no relationship to each other. Clicking
card 2 must not touch card 1's state, DOM, or render.

## 2. Why this maps to your stack (not just stapled together)
| Piece | Real job in this project |
|---|---|
| **Next.js** | App shell, routing, and an API route that serves card data |
| **TypeScript** | Discriminated union type for the 4 card kinds — catches "counter card doesn't have a `votes` field" at compile time |
| **Redux Toolkit** | Normalized store (`cards: { [id]: CardState }`) — this is what actually *proves* isolation, via memoized per-card selectors |
| **Zod** | Validates the shape of card data returned from `/api/cards`, both server-side (API route) and client-side (defensive parse) |
| **AJAX (fetch)** | Card 4's "Read full post" does a real async fetch of the full content — no reload, loading state, error state |
| **HTML/CSS/Tailwind** | Grid layout (`grid` / `grid-cols-*`) and the card visual shell, styled to match your reference image, plus per-state utility classes (idle vs running vs focused) |

## 3. Architecture

### 3.1 State model (Redux, normalized)
```ts
// types/cards.ts
type CardBase = { id: string; title: string; excerpt: string; image: string };

type TimerCard = CardBase & {
  kind: "timer";
  status: "idle" | "running" | "paused";
  mode: "stopwatch" | "countdown";
  seconds: number;
};

type CounterCard = CardBase & {
  kind: "counter";
  active: boolean;
  count: number;
};

type VoteCard = CardBase & {
  kind: "vote";
  active: boolean;
  likes: number;
  dislikes: number;
  userVote: "like" | "dislike" | null;
};

type ExpandCard = CardBase & {
  kind: "expand";
  expanded: boolean;
  status: "idle" | "loading" | "loaded" | "error";
  fullContent: string | null;
};

export type CardState = TimerCard | CounterCard | VoteCard | ExpandCard;
```

Store shape:
```ts
{ cards: { byId: Record<string, CardState>; allIds: string[] } }
```

### 3.2 Isolation strategy (the actual answer to your requirement)
Each `<BlogCard id={id} />` does:
```ts
const card = useSelector((state: RootState) => selectCardById(state, id));
```
where `selectCardById` is built with `createSelector` (memoized). Updating
`cards.byId["card-2"]` only invalidates the memoized selector for id
`"card-2"` — components subscribed to other ids simply don't re-render.
This is the real mechanism, not a UI convention you have to remember to
follow.

Each card kind gets its own slice reducer (`timerSlice`, `counterSlice`, etc.)
combined into one `cardsSlice`, or one slice with a reducer that switches on
`action.payload.kind`. Either is fine — pick one, don't mix.

### 3.3 Keyboard shortcut scoping (Card 1)
Don't use a global `window.addEventListener('keydown', ...)` with an
"activeCardId" check — it's racy and couples cards together, which is the
opposite of what you want. Instead:
```tsx
const ref = useRef<HTMLDivElement>(null);
useEffect(() => { if (card.status !== "idle") ref.current?.focus(); }, [card.status]);

<div ref={ref} tabIndex={0} onKeyDown={handleKeyDown} className="outline-none">
  {/* timer UI */}
</div>
```
`handleKeyDown` checks `e.ctrlKey && e.key === 'p' | 'x' | 'r'`, calls
`e.preventDefault()` (browsers bind Ctrl+P to print), and dispatches the
matching action. Because the div only receives key events while it's
focused, no other card can ever intercept these keys — the DOM enforces the
isolation for free.

### 3.4 Data fetching (AJAX + Zod)
```ts
// lib/schema.ts
export const CardDTO = z.discriminatedUnion("kind", [
  z.object({ id: z.string(), kind: z.literal("timer"), title: z.string(), excerpt: z.string(), image: z.string() }),
  // ...counter, vote, expand variants
]);
export const CardListDTO = z.array(CardDTO);
```
`app/api/cards/route.ts` returns mock JSON; validate it with `CardDTO` server
-side before responding (protects you from a typo in the mock data). On the
client, fetch on mount with a `useEffect` + `fetch('/api/cards')`, re-parse
the response with `CardListDTO.safeParse`, and only then hydrate the Redux
store via `dispatch(cardsLoaded(parsed.data))`. Card 4's "Read full post"
reuses this same fetch+Zod pattern against `/api/cards/[id]/content`.

## 4. Folder structure
```
blog-card-grid/
  app/
    layout.tsx          # wraps app in <Provider store={store}>
    page.tsx             # renders <CardGrid />
    api/
      cards/route.ts
      cards/[id]/content/route.ts
  components/
    CardGrid.tsx
    BlogCard.tsx          # dispatches to the right widget by card.kind
    cards/
      TimerWidget.tsx
      CounterWidget.tsx
      VoteWidget.tsx
      ExpandWidget.tsx
  store/
    store.ts
    cardsSlice.ts
    selectors.ts
  lib/
    schema.ts             # Zod schemas
    mockData.ts
  styles/
    globals.css           # tailwind directives + your card styling
```

## 5. Initialization
```bash
npx create-next-app@latest blog-card-grid --typescript --app --eslint --tailwind
cd blog-card-grid
npm install @reduxjs/toolkit react-redux zod
```
`--tailwind` sets up Tailwind and `app/globals.css` for you automatically —
no separate install step needed. Wrap `children` in `app/layout.tsx` with a
client component `<ReduxProvider>` (Next.js App Router needs the
`<Provider>` inside a `"use client"` file since the store isn't
serializable across the server/client boundary).

## 6. Full file structure, roles, and who-imports-whom

```
blog-card-grid/
  app/
    layout.tsx
    page.tsx
    providers.tsx
    globals.css
  components/
    CardGrid.tsx
    BlogCard.tsx
    cards/
      TimerWidget.tsx
      CounterWidget.tsx
      VoteWidget.tsx
      ExpandWidget.tsx
  store/
    store.ts
    cardsSlice.ts
    selectors.ts
  types/
    cards.ts
  lib/
    mockData.ts
  public/
    (next.svg, etc. — generated by create-next-app)
  package.json
  package-lock.json
  tsconfig.json
  next.config.ts
  postcss.config.mjs      # generated by --tailwind flag
  eslint.config.mjs
```

### What each file does, and its place in the chain

**`types/cards.ts`** — no imports of its own. Defines the `CardState` union
(`TimerCard | CounterCard | VoteCard | ExpandCard`). Every other file that
touches card data imports its types from here. Change a card's shape once,
here, and TypeScript will flag every file that needs updating.

**`lib/mockData.ts`** — imports `CardState` from `types/cards.ts`. Exports
the hardcoded array of 4 starter cards. Only ever imported by
`store/cardsSlice.ts`, to seed the initial Redux state. Nothing else should
import this directly — components get data through Redux, not straight
from the mock file.

**`app/layout.tsx`** — imports `Providers` from `providers.tsx`. Root HTML
shell; everything in your app renders inside `<Providers>` here, which is
what makes `useSelector`/`useDispatch` work in every component below it.

**`app/page.tsx`** — imports `CardGrid` from `components/CardGrid.tsx`.
The actual route content for `/`. Deliberately thin — no card logic lives
here.

**`components/CardGrid.tsx`** — imports `selectAllCardIds` from
`store/selectors.ts` and `BlogCard` from `BlogCard.tsx`. Reads the list of
card ids and lays out one `<BlogCard>` per id in a responsive grid. Doesn't
know or care what *kind* of card each one is.

**`components/BlogCard.tsx`** — imports `makeSelectCardById` from
`store/selectors.ts`, and all 4 widgets from `components/cards/`. Looks up
its own card by id, renders the shared card shell (image, title, excerpt),
then picks exactly one widget to render based on `card.kind`. This is the
file where the discriminated union actually gets consumed.

**`components/cards/*Widget.tsx`** (4 files) — each imports only its own
matching type from `types/cards.ts` (e.g. `TimerWidget` imports
`TimerCard`, not the whole union). Each is self-contained: reads its slice
of state via the `card` prop it's given, dispatches its own actions
directly. No widget imports another widget, and none of them import
`BlogCard` or `CardGrid` — the data flow is strictly one-directional,
parent → child.

### Import direction, summarized
```
types/cards.ts
     ↑
lib/mockData.ts → store/cardsSlice.ts → store/store.ts → store/selectors.ts
                                              ↑                    ↑
                                       app/providers.tsx    CardGrid.tsx, BlogCard.tsx
                                              ↑                    ↑
                                       app/layout.tsx        components/cards/*Widget.tsx
                                              ↑
                                        app/page.tsx
```
Nothing ever imports "upward" against this chain — a widget never imports
the store directly, `cardsSlice` never imports a component, etc. That
one-way flow is what keeps each card's logic genuinely isolated instead of
just visually separated.

### Packages involved
| Package | Installed via | Used in |
|---|---|---|
| `next`, `react`, `react-dom` | `create-next-app` | everywhere (framework) |
| `typescript`, `@types/*` | `create-next-app --typescript` | all `.ts`/`.tsx` files |
| `tailwindcss` | `create-next-app --tailwind` | `globals.css`, all `className` props |
| `@reduxjs/toolkit` | `npm install` | `store/cardsSlice.ts`, `store/store.ts` |
| `react-redux` | `npm install` | `app/providers.tsx`, `CardGrid.tsx`, `BlogCard.tsx` |
| `zod` | `npm install` | (added later, in `lib/schema.ts` when you wire up the AJAX fetch for `ExpandWidget`) |

## 7. Stretch goals (only if time remains)
- Persist Redux state to `localStorage` so cards survive a refresh.
- Add a 5th card that combines two behaviors (e.g., countdown timer that
  auto-submits a vote when it hits zero) — a good test of whether your
  isolation actually holds under a cross-card trigger.
