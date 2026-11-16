import type { Ref, RefCallback } from 'react'

/** One ref for an element that both the component and the product need: each ref gets the element, and lets go of it when it leaves. */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === 'function') {
        const cleanup = ref(node)
        return typeof cleanup === 'function' ? cleanup : () => ref(null)
      }
      if (!ref) return undefined
      ref.current = node
      return () => {
        ref.current = null
      }
    })
    return () => {
      for (const cleanup of cleanups) cleanup?.()
    }
  }
}
