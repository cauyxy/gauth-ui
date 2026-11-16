/*
 * What the Design System artifact's previews run: the package, the gallery's examples and a way to draw them.
 * `node artifact/build.ts` builds it as one script that sets `window.GauthUI`. Not part of the package.
 */
import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './entry.css'
import * as core from '../src'
import * as math from '../src/math'
import { examplesOf, GROUPS } from '../gallery/examples'
import { Motion, TypeScale, TypeSpacing } from '../gallery/foundations'

const { Icon, LocaleProvider, Toaster } = core

function draw(content: ReactNode) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <LocaleProvider locale="en">
        <main className="ds-card">{content}</main>
        <Toaster />
      </LocaleProvider>
    </StrictMode>,
  )
}

/** Every example of one component, laid out as the gallery lays them out. */
function show(component: string) {
  draw(
    examplesOf(component).map((example) => (
      <div key={example.name} className="g-example" data-example={example.name}>
        <example.Show />
      </div>
    )),
  )
}

/** Every icon by its name, in the groups of scripts/icons.ts. */
function showIcons(groups: { title: string; names: core.IconName[] }[]) {
  draw(
    groups.map((group) => (
      <section key={group.title} className="mb-6 last:mb-0">
        <h2 className="mb-3 text-xs font-control tracking-label text-muted uppercase">{group.title}</h2>
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-3">
          {group.names.map((name) => (
            <span key={name} className="flex items-center gap-2 text-xs text-muted">
              <Icon name={name} className="flex-none text-ink" />
              {name}
            </span>
          ))}
        </div>
      </section>
    )),
  )
}

/** What the system has besides components: the type scale with its spacings, and the movements. */
function showFoundation(name: 'Type' | 'Motion') {
  draw(
    name === 'Motion' ? (
      <Motion />
    ) : (
      <>
        <TypeScale />
        <div className="mt-6">
          <TypeSpacing />
        </div>
      </>
    ),
  )
}

const api = { ...core, ...math, GROUPS, examplesOf, show, showIcons, showFoundation }
;(window as unknown as { GauthUI: typeof api }).GauthUI = api
export default api
