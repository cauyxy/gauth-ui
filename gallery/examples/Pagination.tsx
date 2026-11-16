import { useState } from 'react'
import { Pagination } from '../../src'

export function UnderATable() {
  const [page, setPage] = useState(1)
  return (
    <div className="grid gap-3">
      <span className="text-sm text-muted">
        Rows {(page - 1) * 25 + 1} to {Math.min(page * 25, 112)} of 112
      </span>
      <Pagination page={page} count={5} onChange={setPage} />
    </div>
  )
}

export function ManyPages() {
  const [page, setPage] = useState(10)
  return <Pagination page={page} count={24} onChange={setPage} />
}
