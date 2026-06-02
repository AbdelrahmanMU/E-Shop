import { useMemo } from 'react';
import { Icon } from '@/components/Icon/Icon';
import { formatNumber } from '@/lib/money';
import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  showingCount: number;
  onPageChange: (page: number) => void;
}

/** Lightweight page-number truncation: first, last, and ±1 around current. */
function buildSequence(current: number, totalPages: number): Array<number | 'gap'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const out: Array<number | 'gap'> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  if (start > 2) out.push('gap');
  for (let i = start; i <= end; i += 1) out.push(i);
  if (end < totalPages - 1) out.push('gap');
  out.push(totalPages);
  return out;
}

export function Pagination({
  page,
  pageSize,
  totalCount,
  showingCount,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const seq = useMemo(() => buildSequence(page, totalPages), [page, totalPages]);

  return (
    <div className={styles.pager}>
      <span className={styles.info}>
        عرض <strong className="num">{formatNumber(showingCount)}</strong> من{' '}
        <strong className="num">{formatNumber(totalCount)}</strong>
      </span>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.btn}
          aria-label="previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <Icon name="arrowR" size={14} className="icon-dir" />
        </button>
        {seq.map((p, i) =>
          p === 'gap' ? (
            <span key={`gap-${i}`} className={styles.gap} aria-hidden>…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={`${styles.btn} ${p === page ? styles.btnActive : ''}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onPageChange(p)}
            >
              <span className="num">{p}</span>
            </button>
          ),
        )}
        <button
          type="button"
          className={styles.btn}
          aria-label="next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <Icon name="arrowL" size={14} className="icon-dir" />
        </button>
      </div>
    </div>
  );
}
