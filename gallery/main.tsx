/* Every example of every component on one page, in both languages. `pnpm gallery` serves it. Not part of the package. */
import { Fragment, StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/math/math.css'
import './gallery.css'
import { Segmented } from '../src/components/Segmented'
import { Toaster } from '../src/components/Toast'
import { LocaleProvider } from '../src/core/locale'
import type { Locale } from '../src/core/messages'
import { examplesOf, GROUPS } from './examples'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
] as const

function Gallery() {
  const [locale, setLocale] = useState<Locale>('en')
  return (
    <LocaleProvider locale={locale}>
      <main className="g-page" lang={locale}>
        <div className="g-top">
          <h1>gauth-ui</h1>
          <Segmented label="Language" value={locale} options={LANGUAGES} onChange={setLocale} />
        </div>
        {GROUPS.map((group) => (
          <Fragment key={group.slug}>
            <h2 className="g-group">{group.title}</h2>
            {group.names.map((name) => (
              <section key={name} className="g-section" id={name}>
                <h2>{name}</h2>
                {examplesOf(name).map((example) => (
                  <div key={example.name} className="g-example">
                    <example.Show />
                  </div>
                ))}
              </section>
            ))}
          </Fragment>
        ))}
      </main>
      <Toaster />
    </LocaleProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Gallery />
  </StrictMode>,
)
