/*
 * Every word a component says by itself, in each language. This is the shared vocabulary: a product that uses the
 * components says "Not yet" and "Proficient" the same way as every other product. GLOSSARY.md says what each term means.
 * To add a string: add its key to Messages, then fill it in for every language below.
 */

/** The skill ladder, lowest first. `not_started` means no evidence yet. */
export const LEVELS = ['not_started', 'attempted', 'familiar', 'proficient', 'mastered'] as const
export type Level = (typeof LEVELS)[number]

export type Locale = 'en' | 'es'

export type Messages = {
  loading: string
  close: string
  dismiss: string
  back: string
  search: string
  send: string
  /** Stops a reply that Gauth AI is still writing. */
  stop: string
  copy: string
  /** What the copy button says for a moment after a click. */
  copied: string
  /** Takes one thing off: a file, a picked skill, a quote. */
  remove: string
  /** The accessible name of a breadcrumb trail. */
  breadcrumb: string
  /** The accessible name of the region where toasts appear. */
  notifications: string
  /** One step of a Stepper, for a screen reader. */
  step: (n: number, state: 'done' | 'current' | 'upcoming') => string
  /** Progress through a set: "2 of 6". */
  stepOf: (n: number, total: number) => string
  levels: Record<Level, string>
  /** One part of a level bar: "Proficient: 7". */
  levelCount: (level: string, count: number) => string
  /** Said after the rung of a level ladder where a student was before, for a screen reader. */
  levelBefore: string
  /** What a wrong answer is called. Never "Wrong" or "Incorrect". */
  notYet: string
  correct: string
  yourAnswer: string
  correctAnswer: string
  hint: string
  why: string
  tryAgain: string
  /** The line under every Gauth AI composer. */
  aiNote: string
  /** Who wrote a message, for a screen reader. */
  you: string
  gauthAi: string
  /** The two votes under a reply. */
  goodReply: string
  badReply: string
  /** The accessible name of the questions to tap under a reply. */
  followUps: string
  /** What a DatePicker says before a day is picked. */
  pickDate: string
  /** The two arrows of a calendar. */
  previousMonth: string
  nextMonth: string
  /** What a DateRangePicker says before two days are picked. */
  pickDates: string
  /** The two buttons of a NumberInput. */
  decrease: string
  increase: string
  /** What a FileDropzone says when the product gives no title. */
  dropFiles: string
  /** What a Combobox says when nothing matches the text. */
  noResults: string
  /** The accessible name of a Pagination, and its buttons. */
  pagination: string
  previousPage: string
  nextPage: string
  page: (n: number) => string
}

export const en: Messages = {
  loading: 'Loading',
  close: 'Close',
  dismiss: 'Dismiss',
  back: 'Back',
  search: 'Search',
  send: 'Send',
  stop: 'Stop',
  copy: 'Copy',
  copied: 'Copied',
  remove: 'Remove',
  breadcrumb: 'Breadcrumb',
  notifications: 'Notifications',
  step: (n, state) => (state === 'done' ? `Step ${n}, done` : state === 'current' ? `Step ${n}, current` : `Step ${n}`),
  stepOf: (n, total) => `${n} of ${total}`,
  levels: { not_started: 'Not started', attempted: 'Attempted', familiar: 'Familiar', proficient: 'Proficient', mastered: 'Mastered' },
  levelCount: (level, count) => `${level}: ${count}`,
  levelBefore: 'before',
  notYet: 'Not yet',
  correct: 'Correct',
  yourAnswer: 'Your answer',
  correctAnswer: 'Correct answer',
  hint: 'Hint',
  why: 'Why',
  tryAgain: 'Try again',
  aiNote: 'Review AI output for accuracy. Follow school policies.',
  you: 'You',
  gauthAi: 'Gauth AI',
  goodReply: 'Good reply',
  badReply: 'Bad reply',
  followUps: 'Follow-up questions',
  pickDate: 'Pick a date',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  pickDates: 'Pick dates',
  decrease: 'Decrease',
  increase: 'Increase',
  dropFiles: 'Drop files here, or click to choose',
  noResults: 'No matches',
  pagination: 'Pages',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  page: (n) => `Page ${n}`,
}

export const es: Messages = {
  loading: 'Cargando',
  close: 'Cerrar',
  dismiss: 'Descartar',
  back: 'Volver',
  search: 'Buscar',
  send: 'Enviar',
  stop: 'Detener',
  copy: 'Copiar',
  copied: 'Copiado',
  remove: 'Quitar',
  breadcrumb: 'Ruta de navegación',
  notifications: 'Notificaciones',
  step: (n, state) => (state === 'done' ? `Paso ${n}, completado` : state === 'current' ? `Paso ${n}, actual` : `Paso ${n}`),
  stepOf: (n, total) => `${n} de ${total}`,
  levels: { not_started: 'Sin empezar', attempted: 'Intentado', familiar: 'Familiarizado', proficient: 'Competente', mastered: 'Dominado' },
  levelCount: (level, count) => `${level}: ${count}`,
  levelBefore: 'antes',
  notYet: 'Todavía no',
  correct: 'Correcto',
  yourAnswer: 'Tu respuesta',
  correctAnswer: 'Respuesta correcta',
  hint: 'Pista',
  why: 'Por qué',
  tryAgain: 'Inténtalo de nuevo',
  aiNote: 'Revisa que las respuestas de la IA sean correctas. Sigue las normas de tu escuela.',
  you: 'Tú',
  gauthAi: 'Gauth AI',
  goodReply: 'Buena respuesta',
  badReply: 'Mala respuesta',
  followUps: 'Preguntas de seguimiento',
  pickDate: 'Elige una fecha',
  previousMonth: 'Mes anterior',
  nextMonth: 'Mes siguiente',
  pickDates: 'Elige las fechas',
  decrease: 'Disminuir',
  increase: 'Aumentar',
  dropFiles: 'Suelta los archivos aquí o haz clic para elegirlos',
  noResults: 'Sin resultados',
  pagination: 'Páginas',
  previousPage: 'Página anterior',
  nextPage: 'Página siguiente',
  page: (n) => `Página ${n}`,
}

export const MESSAGES: Record<Locale, Messages> = { en, es }
