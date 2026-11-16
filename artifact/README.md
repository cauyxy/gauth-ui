# The Design System artifact

The Gauth UI design system is also a Design System artifact on claude.ai, so that Claude designs with these tokens and components: <https://claude.ai/artifact/EXvzWXhPr9rHAtjTpybWW8>. Nothing in it is written by hand. `build.ts` makes every file from this repository, and `check.ts` proves that a preview shows what the gallery shows.

```bash
pnpm artifact                              # pnpm build, then node artifact/build.ts: writes artifact/out/
pnpm artifact:check                        # each preview is the gallery's picture, pixel for pixel
pnpm artifact:check --published <folder>   # also: the files of the artifact that are behind this repository
```

Both need Chrome: the installed one, or `CHROME=/path/to/chrome`.

## What is in it

| In the artifact | Made from |
| --- | --- |
| `project/tokens.json` | `src/styles/tokens.css`, with the note of each color from `design/README.md` |
| `project/README.md`, `project/glossary.md` | `design/README.md`, `GLOSSARY.md` |
| `project/components/<Name>/README.md` | `design/components/<Name>/README.md` |
| `project/components/<Name>/preview.html` | the examples of `gallery/examples/<Name>.tsx` |
| `project/components/Type`, `Motion` | `gallery/foundations.tsx`, with the Type and Motion rules |
| `project/components/bundle.js`, `bundle.css` | the package and its examples (`entry.tsx`): one script that sets `window.GauthUI` |
| `project/components/index.d.ts` | the types of `dist/` |
| `assets/Icons`, `assets/Learning-icons` | each icon of `src/core/icons.ts`, as `Icon` draws it |

What the artifact's page cannot hold is listed at the end of its README ("Not in the tokens"): the durations and easings, which the Motion card shows instead.

## Publishing

Claude publishes it with the Artifact tool, to the link above, after a change to a token, a component or a rule is on `main`:

1. `pnpm artifact`, then `pnpm artifact:check`. Both must pass.
2. Upload a new or changed icon of `artifact/out/assets/` as an asset of the artifact.
3. Publish the files of `artifact/out/project/` that changed. `index.d.ts` goes with the content type `text/plain`: `.ts` is not a type the artifact serves.
4. Last, `project/design-system.json`, the artifact's index. Read it from the artifact just before, keep what is there, add a new component to its group and a new icon to its asset group, and set `lastChange` to the commit.

To see what is behind, read the artifact's `project/` files into a folder and run `pnpm artifact:check --published <folder>`.
