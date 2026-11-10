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
}

export const en: Messages = {
  loading: 'Loading',
  close: 'Close',
  dismiss: 'Dismiss',
  back: 'Back',
  search: 'Search',
  send: 'Send',
  breadcrumb: 'Breadcrumb',
  notifications: 'Notifications',
  step: (n, state) => (state === 'done' ? `Step ${n}, done` : state === 'current' ? `Step ${n}, current` : `Step ${n}`),
  stepOf: (n, total) => `${n} of ${total}`,
  levels: { not_started: 'Not started', attempted: 'Attempted', familiar: 'Familiar', proficient: 'Proficient', mastered: 'Mastered' },
  levelCount: (level, count) => `${level}: ${count}`,
  notYet: 'Not yet',
  correct: 'Correct',
  yourAnswer: 'Your answer',
  correctAnswer: 'Correct answer',
  hint: 'Hint',
  why: 'Why',
  tryAgain: 'Try again',
  aiNote: 'Review AI output for accuracy. Follow school policies.',
}

export const es: Messages = {
  loading: 'Cargando',
  close: 'Cerrar',
  dismiss: 'Descartar',
  back: 'Volver',
  search: 'Buscar',
  send: 'Enviar',
  breadcrumb: 'Ruta de navegación',
  notifications: 'Notificaciones',
  step: (n, state) => (state === 'done' ? `Paso ${n}, completado` : state === 'current' ? `Paso ${n}, actual` : `Paso ${n}`),
  stepOf: (n, total) => `${n} de ${total}`,
  levels: { not_started: 'Sin empezar', attempted: 'Intentado', familiar: 'Familiarizado', proficient: 'Competente', mastered: 'Dominado' },
  levelCount: (level, count) => `${level}: ${count}`,
  notYet: 'Todavía no',
  correct: 'Correcto',
  yourAnswer: 'Tu respuesta',
  correctAnswer: 'Respuesta correcta',
  hint: 'Pista',
  why: 'Por qué',
  tryAgain: 'Inténtalo de nuevo',
  aiNote: 'Revisa que las respuestas de la IA sean correctas. Sigue las normas de tu escuela.',
}

export const MESSAGES: Record<Locale, Messages> = { en, es }
