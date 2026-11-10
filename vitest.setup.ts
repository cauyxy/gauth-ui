import '@testing-library/jest-dom/vitest'

/* jsdom has no ResizeObserver; Radix's floating content needs one to mount. */
if (!('ResizeObserver' in globalThis)) {
  ;(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
