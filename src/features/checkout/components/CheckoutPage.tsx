import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormError } from '@/components/FormError/FormError';
import { Icon } from '@/components/Icon/Icon';
import { MobileShell } from '@/components/MobileShell/MobileShell';
import { useCartItems } from '@/features/cart/hooks';
import { formatMoney } from '@/lib/money';
import type { Locale } from '@/lib/rtl';
import { useCheckoutCustomer, useCreateOrder } from '../hooks';
import { computeTotals } from '../pricing';
import { CheckoutFormSchema, type CheckoutFormValues } from '../schemas';
import { AddressCard } from './AddressCard';
import { PaymentSelector } from './PaymentSelector';
import { ScheduleSelector } from './ScheduleSelector';
import { StepIndicator } from './StepIndicator';
import styles from './CheckoutPage.module.css';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('common');
  const locale = i18n.language as Locale;

  const items = useCartItems();
  const { customer, address } = useCheckoutCustomer();
  const createOrder = useCreateOrder();

  // If the cart is empty (e.g. user typed /checkout directly) bounce to cart.
  useEffect(() => {
    if (items.length === 0 && !createOrder.isPending && !createOrder.isSuccess) {
      navigate('/cart', { replace: true });
    }
  }, [items.length, createOrder.isPending, createOrder.isSuccess, navigate]);

  const totals = useMemo(
    () => computeTotals(items, { premium: customer.tier === 'premium' }),
    [items, customer.tier],
  );

  const { control, handleSubmit, formState } = useForm<CheckoutFormValues>({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: { day: 'tomorrow', slot: 'afternoon', paymentMethod: 'wallet' },
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const order = await createOrder.mutateAsync(values);
      navigate(`/checkout/success/${order.id}`, { replace: true });
    } catch {
      // Error already captured on `createOrder.error`; FormError below renders it.
      // Swallow to keep the form mounted so the user can retry.
    }
  });

  return (
    <MobileShell tone="ivory-2">
      <header className={styles.header}>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label={t('actions.back')}
          onClick={() => navigate(-1)}
        >
          <Icon name="back" size={18} className="icon-dir" />
        </button>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{t('checkout.title')}</h1>
          <span className={`num ${styles.subtitle}`}>
            {t('checkout.step_of', { current: 2, total: 3 })}
          </span>
        </div>
        <span className={`num ${styles.totalChip}`}>{formatMoney(totals.total, locale)}</span>
      </header>

      <StepIndicator total={3} current={2} />

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <AddressCard address={address} />

        <Controller
          name="day"
          control={control}
          render={({ field: dayField }) => (
            <Controller
              name="slot"
              control={control}
              render={({ field: slotField }) => (
                <ScheduleSelector
                  day={dayField.value}
                  slot={slotField.value}
                  onDayChange={(d) => dayField.onChange(d)}
                  onSlotChange={(s) => slotField.onChange(s)}
                />
              )}
            />
          )}
        />

        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <PaymentSelector value={field.value} onChange={(m) => field.onChange(m)} />
          )}
        />

        {createOrder.isError && (
          <FormError error={createOrder.error} fallbackKey="errors.order_create_failed" />
        )}

        <div className={styles.bottomSpacer} />

        <div className={styles.stickyBar} data-sticky="bottom">
          <button
            type="submit"
            className={styles.confirmBtn}
            disabled={!formState.isValid || createOrder.isPending || items.length === 0}
          >
            {t('checkout.confirm_cta')} · <span className="num">{formatMoney(totals.total, locale)}</span>
          </button>
        </div>
      </form>
    </MobileShell>
  );
}
