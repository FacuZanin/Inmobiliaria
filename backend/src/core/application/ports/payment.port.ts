// backend/src/core/application/ports/payment.port.ts
export interface CheckoutParams {
  userId: string;
  planId: string;
  billingCycle: 'monthly' | 'yearly';
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export type PaymentEventType =
  | 'subscription.activated'
  | 'subscription.cancelled'
  | 'subscription.renewed'
  | 'payment.failed'
  | 'payment.succeeded';

export interface PaymentEvent {
  type: PaymentEventType;
  subscriptionId: string;
  userId: string;
  planId: string;
  occurredAt: Date;
  metadata?: Record<string, unknown>;
}

export interface IPaymentPort {
  // Crea una sesión de checkout y retorna la URL de redirección
  createCheckoutSession(params: CheckoutParams): Promise<string>;
  // Procesa el payload raw del webhook y lo normaliza a PaymentEvent
  handleWebhook(payload: unknown, signature: string): Promise<PaymentEvent>;
  // Cancela una suscripción (al final del período o inmediatamente)
  cancelSubscription(
    subscriptionId: string,
    immediately?: boolean,
  ): Promise<void>;
  // Obtiene el estado actual de una suscripción desde el proveedor
  getSubscriptionStatus(
    subscriptionId: string,
  ): Promise<'active' | 'cancelled' | 'past_due'>;
}

export const PAYMENT_PORT = Symbol('IPaymentPort');
