import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../core/cn'

export type ProseSize = 'sm' | 'md' | 'lg'

/*
 * Long text sets the elements it holds: headings, paragraphs, lists, a quote, a figure, a table, code.
 * Each rule starts at `:where(&)`, so it weighs less than one class: a class on an element inside wins. Only what stands
 * directly in the text is set, so a component put between two paragraphs (a Callout, WorkedSteps) keeps its own look.
 * Where two rules meet, the one that must win names one element more: the gap after a heading wins over the gap before one.
 */
const prose = cva(
  [
    'gx-prose max-w-read leading-body text-pretty text-ink',
    /* One gap between blocks; a wider one before a heading and a closer one after it, so a heading belongs to what follows. */
    '[:where(&>*+*)]:mt-4',
    '[:where(&)>*+h2]:mt-10 [:where(&)>*+h3]:mt-6 [:where(&)>*+h4]:mt-6 [:where(&)>*+hr]:mt-8',
    '[:where(&)>h2+:not(h2)]:mt-3 [:where(&)>:is(h3,h4)+:not(h2)]:mt-2 [:where(&)>hr+:not(h2)]:mt-8',
    '[:where(&)>h2]:leading-heading [:where(&)>h2]:font-title [:where(&)>h2]:tracking-title [:where(&)>h2]:text-balance',
    '[:where(&)>:is(h3,h4)]:leading-heading [:where(&)>:is(h3,h4)]:font-title [:where(&)>:is(h3,h4)]:text-balance',
    /* Lists. Tailwind's reset takes the marks off; the marks are faint because they are marks, not text. */
    '[:where(&)_ul]:list-disc [:where(&)_ol]:list-decimal [:where(&)_:is(ul,ol)]:ps-5',
    '[:where(&)_li+li]:mt-2 [:where(&)_li>:is(ul,ol)]:mt-2 [:where(&)_li]:marker:text-faint',
    /* A quote: a bar at its start, as `Quote` has, and no ground. */
    '[:where(&)>blockquote]:border-s-[3px] [:where(&)>blockquote]:border-rule [:where(&)>blockquote]:ps-4 [:where(&)>blockquote]:text-ink-soft',
    /* A picture and the line under it. */
    '[:where(&)>img]:rounded-xl [:where(&)>figure>img]:rounded-xl [:where(&)>figure>figcaption]:mt-2 [:where(&)>figure>figcaption]:text-muted',
    /* A term and what it means. */
    '[:where(&)>dl>dt]:font-title [:where(&)>dl>dd]:mt-0.5 [:where(&)>dl>dd]:text-ink-soft [:where(&)>dl>dd+dt]:mt-3',
    /* A small table of facts. Its head is quiet, as the head of a `Table` is; numbers line up. */
    '[:where(&)>table]:w-full [:where(&)>table]:border-collapse [:where(&)>table]:text-sm [:where(&)>table]:tabular-nums',
    '[:where(&)>table_:is(th,td)]:border-b [:where(&)>table_:is(th,td)]:border-line [:where(&)>table_:is(th,td)]:pe-4 [:where(&)>table_:is(th,td)]:text-start [:where(&)>table_:is(th,td)]:align-top',
    '[:where(&)>table_th]:py-2 [:where(&)>table_th]:text-2xs [:where(&)>table_th]:font-control [:where(&)>table_th]:tracking-label [:where(&)>table_th]:text-muted [:where(&)>table_th]:uppercase',
    '[:where(&)>table_td]:py-2.5',
    '[:where(&)>hr]:border-line',
    /* Code. A block of it wraps: a box that scrolls sideways cannot be reached from the keyboard. */
    '[:where(&)_:not(pre)>code]:rounded-sm [:where(&)_:not(pre)>code]:bg-surface [:where(&)_:not(pre)>code]:px-1 [:where(&)_:not(pre)>code]:py-0.5 [:where(&)_:not(pre)>code]:font-mono',
    '[:where(&)>pre]:rounded-xl [:where(&)>pre]:bg-surface [:where(&)>pre]:p-4 [:where(&)>pre]:font-mono [:where(&)>pre]:text-sm [:where(&)>pre]:wrap-anywhere [:where(&)>pre]:whitespace-pre-wrap',
    '[:where(&)_:is(strong,b)]:font-title',
    /* A link in the text: an `<a>` with no class of its own. A link that is a component (a button, a chip) has its classes and keeps its look. */
    '[:where(&)_a:not([class])]:rounded-sm [:where(&)_a:not([class])]:text-blue [:where(&)_a:not([class])]:underline [:where(&)_a:not([class])]:underline-offset-[3px]',
    '[:where(&)_a:not([class])]:outline-0 [:where(&)_a:not([class])]:focus-visible:focus-ring [:where(&)_a:not([class])]:focus-visible:outline-offset-1',
  ],
  {
    variants: {
      /* A heading of the text is two steps above it; the heading under that is the text's own size, in the title weight. */
      size: {
        sm: 'gx-prose--sm text-sm [:where(&)>h2]:text-lg [:where(&)_:not(pre)>code]:text-xs [:where(&)>figure>figcaption]:text-xs',
        md: 'gx-prose--md text-base [:where(&)>h2]:text-xl [:where(&)_:not(pre)>code]:text-sm [:where(&)>figure>figcaption]:text-sm',
        lg: 'gx-prose--lg text-lg [:where(&)>h2]:text-2xl [:where(&)_:not(pre)>code]:text-base [:where(&)>figure>figcaption]:text-sm',
      },
    },
  },
)

/**
 * Long text: a lesson, an explanation, a reading passage, a help page. It sets the plain elements a product puts in it
 * (`h2` to `h4`, `p`, lists, `blockquote`, `figure`, `dl`, `table`, `code`), so text that comes from Markdown or from a
 * person reads as one page. `size` is the size of the running text: `sm` on a staff page, `lg` where a student reads.
 */
export function Prose({ size = 'md', className, ...props }: ComponentProps<'div'> & { size?: ProseSize }) {
  return <div className={cn(prose({ size }), className)} {...props} />
}
