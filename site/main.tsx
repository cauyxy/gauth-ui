/* The docs site: every component live, then the design rules and the tokens, read from this repository. Built to site/dist. */
import { StrictMode, useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/math/math.css'
import '../gallery/gallery.css'
import './site.css'
import { examplesOf, GROUPS } from '../gallery/examples'
import pkg from '../package.json'
import { Button } from '../src/components/Button'
import { Chip } from '../src/components/Chip'
import { IconButton } from '../src/components/IconButton'
import { Segmented } from '../src/components/Segmented'
import { Select } from '../src/components/Select'
import { Toaster } from '../src/components/Toast'
import { Icon } from '../src/core/Icon'
import { LocaleProvider } from '../src/core/locale'
import type { Locale } from '../src/core/messages'
import { GUIDELINES, PAGES, pathOf, type Page } from './content'
import { Markdown } from './markdown'
import { TokensPage } from './tokens'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
] as const
const NAV = [...new Set(PAGES.map((p) => p.group))].map((group) => ({ group, pages: PAGES.filter((p) => p.group === group) }))

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

/** Every component, live: a card for each, with its first example, in the order of the list of pages. The title of a card opens the component's page, which has all its examples. */
function Home() {
  return GROUPS.map((group) => (
    <section key={group.slug}>
      <h2 className="s-group">{group.title}</h2>
      <div className="s-grid">
        {group.names.map((name) => {
          const First = examplesOf(name)[0]?.Show
          return (
            <section key={name} className="s-card">
              <h3>
                <a href={pathOf(name)}>{name}</a>
              </h3>
              {First ? (
                <div className="s-card__example">
                  <First />
                </div>
              ) : null}
            </section>
          )
        })}
      </div>
    </section>
  ))
}

/** The code of one example, closed until it is asked for, with a button that copies it. */
function Code({ code }: { code: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [copied])
  return (
    <>
      <div className="s-example__bar">
        <Button variant="ghost" size="sm" aria-expanded={open} onClick={() => setOpen(!open)}>
          Code
          <Icon name="chevron-down" size={16} />
        </Button>
      </div>
      {open ? (
        <div className="s-code" lang="en">
          <pre>
            <code>{code}</code>
          </pre>
          <IconButton
            size="sm"
            variant="outline"
            label={copied ? 'Copied' : 'Copy the code'}
            className="s-code__copy"
            onClick={() => void navigator.clipboard?.writeText(code).then(() => setCopied(true))}
          >
            <Icon name={copied ? 'check' : 'copy'} />
          </IconButton>
        </div>
      ) : null}
    </>
  )
}

/** One component: what it is, each example with its code, then its rules. */
function Component({ name }: { name: string }) {
  const { lead, rules } = GUIDELINES[name]!
  const examples = examplesOf(name)
  return (
    <>
      <div className="s-lead">
        <Markdown text={lead} />
      </div>
      {examples.map((example) => (
        <section key={example.name} className="s-example">
          {examples.length > 1 ? <h2>{example.title}</h2> : null}
          <div className="s-example__card">
            <div className="s-preview">
              <example.Show />
            </div>
            <Code code={example.code} />
          </div>
        </section>
      ))}
      <div className="s-rules">
        <Markdown text={rules} />
      </div>
    </>
  )
}

function Body({ page }: { page: Page }) {
  if (page.kind === 'home') return <Home />
  if (page.kind === 'tokens') return <TokensPage />
  if (page.kind === 'component') return <Component key={page.name} name={page.name} />
  return <Markdown text={page.body} />
}

function Site() {
  const path = usePath()
  const [locale, setLocale] = useState<Locale>('en')
  const page = PAGES.find((p) => p.path === path) ?? PAGES[0]!
  const localized = page.kind === 'home' || page.kind === 'component'
  const navRef = useRef<HTMLElement>(null)

  /* A new page starts at its top, or at the component the address names. The list of pages shows where the page is in it. */
  useEffect(() => {
    document.title = `${page.title} · gauth-ui`
    const target = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
    const nav = navRef.current
    const current = nav?.querySelector<HTMLElement>('[aria-current=page]')
    if (!nav || !current || nav.clientHeight === 0) return
    /* The part of the list in the window: its bottom can be under the window's edge. */
    const seen = Math.min(nav.clientHeight, window.innerHeight - nav.getBoundingClientRect().top)
    if (current.offsetTop < nav.scrollTop || current.offsetTop + current.offsetHeight > nav.scrollTop + seen)
      nav.scrollTop = current.offsetTop - (seen - current.offsetHeight) / 2
  }, [page])

  return (
    <LocaleProvider locale={locale}>
      {/* Catches clicks on the links inside it, which the keyboard reaches as links. */}
      {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div onClick={onLinkClick}>
        {/* The bar's ground and line reach both edges of the window; what is on it lines up with the column under it. */}
        <header className="s-top">
          <div className="s-top__in">
            <a href="/" className="s-brand">
              gauth-ui
            </a>
            <Chip>v{pkg.version}</Chip>
            {/* Only the examples speak a language; the rules, tokens and glossary are in English. */}
            {localized ? (
              <span className="s-top__end">
                <Segmented label="Language of the examples" value={locale} options={LANGUAGES} onChange={setLocale} />
              </span>
            ) : null}
          </div>
        </header>
        <div className="s-shell">
          <nav ref={navRef} aria-label="Pages" className="s-nav">
            {NAV.map(({ group, pages }) => (
              <div key={group} className="s-nav__group">
                {group ? <span className="s-nav__title">{group}</span> : null}
                {pages.map((p) => (
                  <a key={p.path} href={p.path} aria-current={p === page ? 'page' : undefined} className="s-nav__link">
                    {p.title}
                  </a>
                ))}
              </div>
            ))}
          </nav>
          <div className="s-jump">
            <Select
              label="Page"
              size="xl"
              value={page.path}
              onChange={go}
              options={PAGES.map((p) => ({ value: p.path, label: p.group ? `${p.group} · ${p.title}` : p.title }))}
            />
          </div>
          <main className={page.kind === 'home' ? 's-main s-main--wide' : 's-main'} lang={localized ? locale : 'en'}>
            <h1 className="s-title">{page.title}</h1>
            <Body page={page} />
          </main>
        </div>
      </div>
      <Toaster />
    </LocaleProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Site />
  </StrictMode>,
)
