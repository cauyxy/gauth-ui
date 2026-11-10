import { createContext, useContext, type ReactNode } from 'react'

/** What goes under a section's examples. The gallery shows nothing; the docs site shows each component's guideline. */
export const SectionNote = createContext<(names: string[]) => ReactNode>(() => null)

/** One block of the gallery: the components named in `title` (separated by ", ") and their examples. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  const note = useContext(SectionNote)
  const names = title.split(', ')
  return (
    <section className="g-section" id={names[0]}>
      <h2>{title}</h2>
      {children}
      {note(names)}
    </section>
  )
}
