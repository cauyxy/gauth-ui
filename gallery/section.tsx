import { createContext, useContext, type ReactNode } from 'react'

type Block = { title: string; of: string; children: ReactNode }

/** How the page that holds the examples draws one block. Without it, the block is a titled card: the gallery. */
export const SectionView = createContext<((block: Block) => ReactNode) | null>(null)

/** One block of examples. `title` is the component it shows; a block that combines components names its main one in `of`. */
export function Section({ title, of = title, children }: { title: string; of?: string; children: ReactNode }) {
  const view = useContext(SectionView)
  if (view) return view({ title, of, children })
  return (
    <section className="g-section" id={title}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}
