# Switching gauthx to gauth-ui

What changes for gauthx when it replaces `@gauthx/ui` with this package. Check each switch with `pnpm compare`.

## Tokens that are gone

The Tailwind theme clears every color that is not a token, so a class with an old name gives no CSS and no error. Replace every use before the switch.

| Old class or variable                  | New                 | Why                                                                 | Change on screen                   |
| -------------------------------------- | ------------------- | ------------------------------------------------------------------- | ---------------------------------- |
| `text-subtle`, `--color-subtle`        | `muted`             | `subtle` is 4.2:1 on white, below the 4.5:1 that text needs         | `#757c88` → `#646a77`              |
| `bg-surface-3`, `--color-surface-3`    | `surface`           | Two greys two steps apart for one role: a soft ground under content | `#f7f7f8` → `#f5f5f7`              |
| `bg-line-2`, `--color-line-2`          | `track`             | It was never a line: every use is a bar's empty part or a ground    | `#eeeff3` → `#e9eaee`              |
| `--color-edge-2`, `--color-edge-3`     | `edge-strong`       | No uses                                                             | none                               |
| `--color-brand-soft`, `--color-blue-tint` | none             | No uses                                                             | none                               |

## Colors that changed

| Token            | gauthx    | gauth-ui  |
| ---------------- | --------- | --------- |
| `attempted`      | `#e8a8b5` | `#f59e62` |
| `attempted-ink`  | `#99556d` | `#974a12` |
| `attempted-soft` | `#f9eef2` | `#fef1e6` |

Rose is replaced by orange for the Attempted level, a wrong answer and a field error (picked Nov 10, 2026). gauthx keeps a second copy of these values in `MASTERY_COLOR`, `MASTERY_INK` and `MASTERY_SOFT` in `packages/task/src/index.ts`: change them in the same PR. Its docs and the `gauthx-ui` skill say "rose" in several places. Sign-in and sign-up show errors in `text-brand` (red): they take `attempted-ink` too.

The hairline had four strengths (8, 10, 12 and 20%). It now has two: `edge` (12%) and `edge-strong` (20%). `shadow-card` and `shadow-pop` take `edge`, so their 1px outline is a little firmer.

## Motion

gauthx spells each animation by hand (`animate-[fade-in_200ms_ease-out]`), at ten different durations. This package has four durations, two easings and ten named movements.

| gauthx                                                    | gauth-ui                    | Change                         |
| --------------------------------------------------------- | --------------------------- | ------------------------------ |
| `animate-[fade-in_200ms_ease-out]`                        | `animate-fade-in`           | easing only                    |
| `animate-[pop-in_…]` at 160, 220 and 260 ms               | `animate-pop-in` (150 ms)   | one speed                      |
| `animate-[reveal_240ms_ease-out]`, `slide-reveal` (300 ms) | `animate-rise-in` (260 ms)  | one speed                      |
| `animate-[drawer-in_260ms_…]`                             | `animate-slide-in`          | none                           |
| `animate-[answer-pop_320ms_ease-out]`                     | `animate-mark-right` (360 ms) | 40 ms longer                 |
| `animate-[answer-shake_360ms_ease-in-out]`, `slide-shake` | `animate-mark-retry`        | none                           |
| `animate-[build-slide_1.4s_ease-in-out_infinite]`         | `animate-sweep`             | none                           |
| `animate-spin`, `animate-pulse`                           | the same names              | they now stop for reduced motion |
| `duration-200`                                            | `duration-(--gx-dur-base)`  | none                           |

`motion-safe:` and `motion-reduce:` are no longer needed on these: `--gx-ms` handles reduced motion. Popover and Tooltip now also fade out when they close, and Tooltip fades in. The `motion` package is declared in all four apps and imported nowhere.

## Renamed in code

| gauthx                                         | gauth-ui                                        |
| ---------------------------------------------- | ----------------------------------------------- |
| `buttonVariants({ variant, size })`            | `buttonClass({ variant, size })`                |
| `Button size="pill"`, `size="icon"`            | removed: no uses                                |
| `segmentedTrack`, `segmentedOption(on)`        | `segmentedTrackClass()`, `segmentedOptionClass(on)` |
| `Switch on={…}` (apps/teach)                   | `Switch checked={…}`                            |
| `cn()`                                         | stays in gauthx for its own Tailwind classes    |

## Behavior

- `Button` is `type="button"` by default. The old one had no type, so inside a form it submitted. Give each submit button `type="submit"`.
- Import the styles in CSS as `@import 'gauth-ui/styles.css' layer(components);` so utilities on a component still win.

## Stays in gauthx

- The keyframes its pages use by name: `drawer-in`, `fade-in`, `build-slide`, `pop-in`.
- `overscroll-behavior-y: none` and `scrollbar-gutter: stable` on `html`.
- `StandardCode`, `DemoTag`, `AiDisclaimer`, `tableHeaderClass`, the mastery components, `Diagram`, the shells and sign-in.
- The student `PRIMARY` and `SECONDARY` class strings, until someone picks how they map to `Button`.
