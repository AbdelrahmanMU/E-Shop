import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Locale } from '@/lib/rtl';
import type { DeliveryDay, DeliverySlot } from '../schemas';
import styles from './ScheduleSelector.module.css';

interface ScheduleSelectorProps {
  day: DeliveryDay;
  slot: DeliverySlot;
  onDayChange: (d: DeliveryDay) => void;
  onSlotChange: (s: DeliverySlot) => void;
  /** Override for tests; defaults to `new Date()`. */
  now?: Date;
}

const DAY_KEYS: Record<DeliveryDay, string> = {
  today:     'checkout.day_today',
  tomorrow:  'checkout.day_tomorrow',
  d_plus_2:  'checkout.day_after',
};
const DAY_OFFSETS: Record<DeliveryDay, number> = { today: 0, tomorrow: 1, d_plus_2: 2 };

const SLOT_DEFS: ReadonlyArray<{ id: DeliverySlot; rangeKey: string; labelKey: string }> = [
  { id: 'morning',   rangeKey: 'checkout.slot_morning_range',   labelKey: 'checkout.slot_morning' },
  { id: 'afternoon', rangeKey: 'checkout.slot_afternoon_range', labelKey: 'checkout.slot_afternoon' },
  { id: 'evening',   rangeKey: 'checkout.slot_evening_range',   labelKey: 'checkout.slot_evening' },
];

const DAYS: ReadonlyArray<DeliveryDay> = ['today', 'tomorrow', 'd_plus_2'];

export function ScheduleSelector({ day, slot, onDayChange, onSlotChange, now }: ScheduleSelectorProps) {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as Locale;

  const dateLabelFor = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', {
      day: 'numeric',
      month: 'short',
    });
    return (d: DeliveryDay) => {
      const base = now ?? new Date();
      const target = new Date(base);
      target.setDate(target.getDate() + DAY_OFFSETS[d]);
      return fmt.format(target);
    };
  }, [now, locale]);

  return (
    <div className={styles.card}>
      <span className={`eyebrow ${styles.eyebrow}`}>{t('checkout.schedule_eyebrow')}</span>

      <div className={styles.daysRow} role="radiogroup" aria-label={t('checkout.schedule_eyebrow')}>
        {DAYS.map((d) => {
          const active = day === d;
          return (
            <button
              key={d}
              type="button"
              role="radio"
              aria-checked={active}
              className={`${styles.dayBtn} ${active ? styles.dayBtnActive : ''}`}
              onClick={() => onDayChange(d)}
            >
              <span className={styles.dayName}>{t(DAY_KEYS[d])}</span>
              <span className={`num ${styles.dayDate}`}>{dateLabelFor(d)}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.slotsRow} role="radiogroup" aria-label={t('checkout.slot_morning')}>
        {SLOT_DEFS.map((s) => {
          const active = slot === s.id;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={active}
              className={`${styles.slotBtn} ${active ? styles.slotBtnActive : ''}`}
              onClick={() => onSlotChange(s.id)}
            >
              <span className={`num ${styles.slotRange}`}>{t(s.rangeKey)}</span>
              <span className={styles.slotLabel}>{t(s.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
