import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { FormError } from '@/components/FormError/FormError';
import { Drawer } from '@/features/admin/components/Drawer';
import { useCategories } from '@/features/catalog/hooks';
import { toEgp } from '@/lib/money';
import type { Product } from '@/types/domain';
import { ProductFormSchema, type ProductFormValues } from '../schemas';
import { useCreateProduct, useUpdateProduct } from '../hooks';
import styles from './ProductFormDrawer.module.css';

interface ProductFormDrawerProps {
  open: boolean;
  product: Product | null; // null = create mode
  onClose: () => void;
}

function defaultValues(product: Product | null): Partial<ProductFormValues> {
  if (!product) {
    return {
      nameAr: '', nameEn: '', subtitle: '', categoryId: '',
      priceEgp: 0, weight: '', stock: 0, glyph: '',
    };
  }
  return {
    nameAr:    product.nameAr,
    nameEn:    product.nameEn,
    subtitle:  product.subtitle,
    categoryId: product.categoryId,
    priceEgp:  toEgp(product.price),
    ...(product.oldPrice !== undefined ? { oldPriceEgp: toEgp(product.oldPrice) } : {}),
    weight:    product.weight,
    stock:     product.stock,
    glyph:     product.glyph ?? '',
    ...(product.badge !== undefined ? { badge: product.badge } : {}),
  };
}

export function ProductFormDrawer({ open, product, onClose }: ProductFormDrawerProps) {
  const { t, i18n } = useTranslation('common');
  const isEdit = product !== null;
  const { data: categories } = useCategories();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: defaultValues(product),
  });

  // Re-seed defaults when switching between create and edit, or when the
  // edited product changes.
  useEffect(() => {
    reset(defaultValues(product));
  }, [product, reset]);

  const createMut = useCreateProduct();
  const updateMut = useUpdateProduct();

  const activeMut = isEdit ? updateMut : createMut;

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    try {
      if (isEdit && product) {
        await updateMut.mutateAsync({ id: product.id, values });
      } else {
        await createMut.mutateAsync(values);
      }
      onClose();
    } catch {
      // Surfaced via FormError below; keep the drawer open for retry.
    }
  };

  const errorMessage = (key: string | undefined): string => (key ? t(key) : '');

  return (
    <Drawer
      open={open}
      title={t(isEdit ? 'admin.products.form_title_edit' : 'admin.products.form_title_create')}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('admin.products.cancel')}
          </button>
          <button
            type="submit"
            form="product-form"
            className={styles.saveBtn}
            disabled={isSubmitting}
          >
            {t('admin.products.save')}
          </button>
        </>
      }
    >
      <form id="product-form" className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.label}>{t('admin.products.field_name_ar')}</span>
            <input
              className={styles.input}
              dir="rtl"
              {...register('nameAr')}
            />
            {errors.nameAr && <span className={styles.error}>{errorMessage(errors.nameAr.message)}</span>}
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{t('admin.products.field_name_en')}</span>
            <input
              className={styles.input}
              dir="ltr"
              lang={i18n.language === 'ar' ? 'en' : undefined}
              {...register('nameEn')}
            />
            {errors.nameEn && <span className={styles.error}>{errorMessage(errors.nameEn.message)}</span>}
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>{t('admin.products.field_subtitle')}</span>
          <input className={styles.input} {...register('subtitle')} />
          {errors.subtitle && <span className={styles.error}>{errorMessage(errors.subtitle.message)}</span>}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t('admin.products.field_category')}</span>
          <select className={styles.input} {...register('categoryId')}>
            <option value="">—</option>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {i18n.language === 'en' ? c.nameEn : c.nameAr}
              </option>
            ))}
          </select>
          {errors.categoryId && <span className={styles.error}>{errorMessage(errors.categoryId.message)}</span>}
        </label>

        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.label}>{t('admin.products.field_price')}</span>
            <input
              className={styles.input}
              type="number"
              step="0.01"
              min="0"
              {...register('priceEgp')}
            />
            {errors.priceEgp && <span className={styles.error}>{errorMessage(errors.priceEgp.message)}</span>}
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{t('admin.products.field_old_price')}</span>
            <input
              className={styles.input}
              type="number"
              step="0.01"
              min="0"
              {...register('oldPriceEgp')}
            />
            {errors.oldPriceEgp && <span className={styles.error}>{errorMessage(errors.oldPriceEgp.message)}</span>}
          </label>
        </div>

        <div className={styles.grid}>
          <label className={styles.field}>
            <span className={styles.label}>{t('admin.products.field_weight')}</span>
            <input className={styles.input} {...register('weight')} />
            {errors.weight && <span className={styles.error}>{errorMessage(errors.weight.message)}</span>}
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{t('admin.products.field_stock')}</span>
            <input
              className={styles.input}
              type="number"
              min="0"
              step="1"
              {...register('stock')}
            />
            {errors.stock && <span className={styles.error}>{errorMessage(errors.stock.message)}</span>}
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.label}>{t('admin.products.field_glyph')}</span>
          <input className={styles.input} maxLength={8} {...register('glyph')} />
        </label>

        {activeMut.isError && (
          <FormError error={activeMut.error} fallbackKey="errors.product_save_failed" />
        )}
      </form>
    </Drawer>
  );
}
