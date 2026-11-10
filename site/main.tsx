/* The docs site: the design rules, the tokens and every component, read from this repository. Built to site/dist. */
import { StrictMode, useEffect, useState, useSyncExternalStore, type MouseEvent } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/styles.css'
import '../src/math/math.css'
import '../gallery/gallery.css'
import './site.css'
import { SectionNote } from '../gallery/section'
import pkg from '../package.json'
import { Chip } from '../src/components/Chip'
import { Segmented } from '../src/components/Segmented'
import { Select } from '../src/components/Select'
import { LocaleProvider } from '../src/core/locale'
import type { Locale } from '../src/core/messages'
import { GROUPS, GUIDELINES, PAGES, type Page } from './content'
import { Markdown } from './markdown'
import { TokensPage } from './tokens'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
] as const
const NAV = ['Start', 'Design', 'Components'].map((group) => ({ group, pages: PAGES.filter((p) => p.group === group) }))

/* The address is the state: a link changes it without a page load, and Back works. */
const listen = (onChange: () => void) => {
  window.addEventListener('popstate', onChange)
  return () => window.removeEventListener('popstate', onChange)
}
const go = (to: string) => {
  window.history.pushState(null, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
const usePath = () => useSyncExternalStore(listen, () => window.location.pathname.replace(/\/$/, '') || '/')

/** A click on a link to one of the site's own pages changes the address in place. */
function onLinkClick(event: MouseEvent) {
  const link = (event.target as Element).closest('a')
  const href = link?.getAttribute('href')
  if (!href?.startsWith('/') || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
  event.preventDefault()
  go(href)
}

function Components({ slug }: { slug: string }) {
  const group = GROUPS.find((g) => g.slug === slug)!
  return (
    <>
      <nav aria-label={group.title} className="s-names">
        {group.names.map((name) => (
          <a key={name} href={`#${name}`}>
            <Chip>{name}</Chip>
          </a>
        ))}
      </nav>
      <SectionNote.Provider
        value={(names) =>
          names
            .filter((name) => GUIDELINES[name])
            .map((name) => (
              /* The block itself carries the id of the first component it shows. */
              <div key={name} id={name === names[0] ? undefined : name} className="s-guideline">
                {names.length > 1 ? <h3>{name}</h3> : null}
                <Markdown text={GUIDELINES[name]!} />
              </div>
            ))
        }
      >
        <group.Examples />
      </SectionNote.Provider>
    </>
  )
}

function Body({ page }: { page: Page }) {
  if (page.kind === 'tokens') return <TokensPage />
  if (page.kind === 'components') return <Components slug={page.slug} />
  return <Markdown text={page.body} />
}

function Site() {
  const path = usePath()
  const [locale, setLocale] = useState<Locale>('en')
  const page = PAGES.find((p) => p.path === path) ?? PAGES[0]!

  /* A new page starts at its top, or at the component the address names. */
  useEffect(() => {
    document.title = page.path === '/' ? 'Gauth design system' : `${page.title} · Gauth design system`
    const target = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [page])

  return (
    <LocaleProvider locale={locale}>
      <div className="s-shell" onClick={onLinkClick}>
        <header className="s-top">
          <a href="/" className="s-brand">
            Gauth design system
          </a>
          <Chip>v{pkg.version}</Chip>
          <span className="s-top__end">
            <Segmented label="Language of the examples" value={locale} options={LANGUAGES} onChange={setLocale} />
          </span>
        </header>
        <nav aria-label="Pages" className="s-nav">
          {NAV.map(({ group, pages }) => (
            <div key={group} className="s-nav__group">
              {pages.length > 1 ? <span className="s-nav__title">{group}</span> : null}
              {pages.map((p) => (
                <a key={p.path} href={p.path} aria-current={p === page ? 'page' : undefined} className="s-nav__link">
                  {p.title}
                </a>
              ))}
            </div>
          ))}
        </nav>
        <div className="s-jump">
          <Select label="Page" size="xl" value={page.path} onChange={go} options={PAGES.map((p) => ({ value: p.path, label: p.group === p.title ? p.title : `${p.group} · ${p.title}` }))} />
        </div>
        <main className="s-main" lang={page.kind === 'components' ? locale : 'en'}>
          <h1 className="s-title">{page.path === '/' ? 'Gauth design system' : page.title}</h1>
          <Body page={page} />
        </main>
      </div>
    </LocaleProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Site />
  </StrictMode>,
)
