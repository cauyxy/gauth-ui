/** Joins class names, leaving out the empty ones. */
export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')
