import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import styles from './Topbar.module.css';

interface TopbarProps {
  title: string;
  sub?: string;
  /** Optional primary action — e.g. "+ إضافة سريعة". */
  actionLabel?: string;
  onAction?: () => void;
}

export function Topbar({ title, sub, actionLabel, onAction }: TopbarProps) {
  const { t } = useTranslation('common');

  return (
    <header className={`admin-topbar ${styles.topbar}`}>
      <div className={styles.titleBlock}>
        {/* Chrome heading — the real page <h1> lives in <PageHeader>. */}
        <div className={`page-title-bar ${styles.title}`}>{title}</div>
        {sub && <p className={styles.sub}>{sub}</p>}
      </div>
      <div className={styles.right}>
        <label className={styles.searchWrap}>
          <Icon name="search" size={14} className={styles.searchIcon} />
          <input
            type="search"
            className={`top-search ${styles.search}`}
            placeholder={t('admin.topbar_search')}
            aria-label={t('admin.topbar_search')}
          />
        </label>
        <button type="button" className={styles.bellBtn} aria-label="notifications">
          <Icon name="bell" size={16} />
          <span className={`notif-dot ${styles.bellDot}`} aria-hidden />
        </button>
        {actionLabel && (
          <button type="button" className={`btn-add ${styles.actionBtn}`} onClick={onAction}>
            <Icon name="plus" size={14} />
            {actionLabel}
          </button>
        )}
      </div>
    </header>
  );
}
