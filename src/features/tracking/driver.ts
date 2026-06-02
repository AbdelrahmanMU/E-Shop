import type { Uuid } from '@/types/domain';

/**
 * Stub driver shown on every tracking page until we wire the real
 * dispatch service (backend phase). Mirrors the prototype's "محمد عبد الله".
 */
export interface DemoDriver {
  id: Uuid;
  name: string;
  initials: string;
  rating: number;
  /** E.164 — phone CTA opens `tel:`. */
  phone: string;
}

export const DEMO_DRIVER: DemoDriver = {
  id: '00000000-0000-4000-8000-0000000000d1',
  name: 'محمد عبد الله',
  initials: 'م.ع',
  rating: 4.9,
  phone: '+201007654321',
};
