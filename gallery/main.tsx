/* Every component on one page, in both languages. `pnpm gallery` serves it. Not part of the package. */
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/styles.css'
import '../src/math/math.css'
import './gallery.css'
import { Segmented } from '../src/components/Segmented'
import { LocaleProvider } from '../src/core/locale'
import type { Locale } from '../src/core/messages'
import Chat from './chat'
import Core from './core'
import Forms from './forms'
import Learning from './learning'
import Formulas from './math'
import Overlays from './overlays'
import Structure from './structure'

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
        <h2 className="g-group">Core</h2>
        <Core />
        <h2 className="g-group">Forms</h2>
        <Forms />
        <h2 className="g-group">Overlays and feedback</h2>
        <Overlays />
        <h2 className="g-group">Structure and Gauth AI</h2>
        <Structure />
        <h2 className="g-group">Conversation</h2>
        <Chat />
        <h2 className="g-group">Learning</h2>
        <Learning />
        <h2 className="g-group">Math</h2>
        <Formulas />
      </main>
    </LocaleProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Gallery />
  </StrictMode>,
)
