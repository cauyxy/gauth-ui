/** The pages to show: the first, the last, the current one and one on each side of it, with gaps (null) between. */
export function pagesOf(page: number, count: number): (number | null)[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  const near = [page - 1, page, page + 1].filter((n) => n > 1 && n < count)
  /* Near an end, show four pages there, so the list keeps its length as the current page moves. */
  const middle = page <= 3 ? [2, 3, 4] : page >= count - 2 ? [count - 3, count - 2, count - 1] : near
  const pages: (number | null)[] = [1]
  if (middle[0]! > 2) pages.push(null)
  pages.push(...middle)
  if (middle.at(-1)! < count - 1) pages.push(null)
  pages.push(count)
  return pages
}
