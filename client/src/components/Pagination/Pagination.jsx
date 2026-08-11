import styles from './Pagination.module.css'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)
  for (let index = start; index <= end; index += 1) {
    pages.push(index)
  }

  return (
    <div className={styles.pagination}>
      <button type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>
      {start > 1 && (
        <>
          <button type="button" onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span>…</span>}
        </>
      )}
      {pages.map((current) => (
        <button
          key={current}
          type="button"
          className={current === page ? styles.active : ''}
          onClick={() => onPageChange(current)}
        >
          {current}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span>…</span>}
          <button type="button" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}
      <button type="button" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  )
}
