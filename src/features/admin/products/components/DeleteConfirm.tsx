import { useTranslation } from 'react-i18next';
import { FormError } from '@/components/FormError/FormError';
import { Drawer } from '@/features/admin/components/Drawer';
import type { Product } from '@/types/domain';
import { useDeleteProduct } from '../hooks';
import styles from './DeleteConfirm.module.css';

interface DeleteConfirmProps {
  product: Product | null;
  onClose: () => void;
}

export function DeleteConfirm({ product, onClose }: DeleteConfirmProps) {
  const { t, i18n } = useTranslation('common');
  const deleteMut = useDeleteProduct();
  const open = product !== null;

  const name = product
    ? (i18n.language === 'en' ? product.nameEn : product.nameAr)
    : '';

  const handleConfirm = async () => {
    if (!product) return;
    try {
      await deleteMut.mutateAsync(product.id);
      onClose();
    } catch {
      // Error rendered inline; leave the dialog open so the admin can retry.
    }
  };

  return (
    <Drawer
      open={open}
      title={t('admin.products.delete_confirm_title')}
      onClose={onClose}
      footer={
        <>
          <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={deleteMut.isPending}>
            {t('admin.products.cancel')}
          </button>
          <button type="button" className={styles.deleteBtn} onClick={handleConfirm} disabled={deleteMut.isPending}>
            {t('admin.products.delete_confirm_action')}
          </button>
        </>
      }
    >
      <p className={styles.body}>{t('admin.products.delete_confirm_body', { name })}</p>
      {deleteMut.isError && (
        <FormError error={deleteMut.error} fallbackKey="errors.product_delete_failed" />
      )}
    </Drawer>
  );
}
