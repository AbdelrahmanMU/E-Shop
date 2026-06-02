import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { Panel } from '@/features/admin/components/Panel';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { formatNumber } from '@/lib/money';
import type { RevenuePoint } from '../api';
import styles from './RevenueChart.module.css';

interface RevenueChartProps {
  points: RevenuePoint[];
  totalEgp: number;
  isLoading: boolean;
}

type Range = 'day' | 'week' | 'month' | 'year';
const RANGES: ReadonlyArray<{ id: Range; key: string }> = [
  { id: 'day',   key: 'admin.range_day' },
  { id: 'week',  key: 'admin.range_week' },
  { id: 'month', key: 'admin.range_month' },
  { id: 'year',  key: 'admin.range_year' },
];

function TooltipContent({ active, payload }: {
  active?: boolean;
  payload?: Array<{ value: number; payload: RevenuePoint }>;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0]!;
  return (
    <div className={styles.tooltip}>
      <span className="num">{(p.value / 1000).toFixed(1)}K</span>
      <span className={styles.tooltipDay}>{p.payload.day}</span>
    </div>
  );
}

export function RevenueChart({ points, totalEgp, isLoading }: RevenueChartProps) {
  const { t } = useTranslation('common');
  const [range, setRange] = useState<Range>('week');

  const subTotal = `${formatNumber(totalEgp)} ج.م`;

  return (
    <Panel
      title={t('admin.panel_weekly_sales')}
      sub={t('admin.panel_weekly_total', { total: subTotal })}
      rightSlot={
        <div className={styles.chips}>
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              className={[styles.chip, range === r.id ? styles.chipActive : ''].join(' ')}
              onClick={() => setRange(r.id)}
            >
              {t(r.key)}
            </button>
          ))}
        </div>
      }
    >
      <div className={styles.chartWrap}>
        {isLoading ? (
          <Skeleton width="100%" height={220} radius={10} />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={points} margin={{ top: 12, right: 8, left: -8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: 'var(--text-3)' }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis
                tickFormatter={(v: number) => `${v / 1000}K`}
                tick={{ fontSize: 10, fill: 'var(--text-3)' }}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <Tooltip
                cursor={{ fill: 'rgba(26, 22, 20, 0.05)' }}
                content={<TooltipContent />}
              />
              <Bar
                dataKey="value"
                fill="var(--charcoal)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
                activeBar={{ fill: 'var(--gold)' }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Panel>
  );
}
