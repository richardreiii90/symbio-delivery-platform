// Sistema de pagos y comisiones
export interface PaymentMethod {
  id: string
  type: "card" | "cash" | "digital_wallet"
  name: string
  details: string
  isDefault: boolean
}

export interface Transaction {
  id: string
  orderId: string
  amount: number
  platformFee: number
  deliveryFee: number
  businessAmount: number
  driverAmount: number
  paymentMethod: string
  status: "pending" | "completed" | "failed" | "refunded"
  createdAt: Date
  completedAt?: Date
}

export interface Commission {
  businessId: string
  driverId: string
  orderId: string
  orderAmount: number
  platformFeeRate: number
  platformFee: number
  deliveryFee: number
  businessEarnings: number
  driverEarnings: number
  createdAt: Date
}

// Configuración de comisiones
export const COMMISSION_RATES = {
  PLATFORM_FEE_RATE: 0.15, // 15% de comisión de la plataforma
  DELIVERY_BASE_FEE: 2.5,
  DELIVERY_PER_KM: 0.5,
  DRIVER_DELIVERY_PERCENTAGE: 0.8, // 80% del delivery fee va al repartidor
}

// Calcular tarifas de delivery basado en distancia
export function calculateDeliveryFee(distance: number): number {
  return COMMISSION_RATES.DELIVERY_BASE_FEE + distance * COMMISSION_RATES.DELIVERY_PER_KM
}

// Calcular comisiones de un pedido
export function calculateCommissions(orderAmount: number, deliveryFee: number): Commission {
  const platformFee = orderAmount * COMMISSION_RATES.PLATFORM_FEE_RATE
  const businessEarnings = orderAmount - platformFee
  const driverEarnings = deliveryFee * COMMISSION_RATES.DRIVER_DELIVERY_PERCENTAGE
  const platformDeliveryFee = deliveryFee - driverEarnings

  return {
    businessId: "business_123",
    driverId: "driver_123",
    orderId: "temp_order",
    orderAmount,
    platformFeeRate: COMMISSION_RATES.PLATFORM_FEE_RATE,
    platformFee: platformFee + platformDeliveryFee,
    deliveryFee,
    businessEarnings,
    driverEarnings,
    createdAt: new Date(),
  }
}

// Procesar pago
export async function processPayment(amount: number, paymentMethodId: string, orderId: string): Promise<Transaction> {
  // Simulación de procesamiento de pago
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const transaction: Transaction = {
    id: `txn_${Math.random().toString(36).substr(2, 9)}`,
    orderId,
    amount,
    platformFee: amount * COMMISSION_RATES.PLATFORM_FEE_RATE,
    deliveryFee: COMMISSION_RATES.DELIVERY_BASE_FEE,
    businessAmount: amount * (1 - COMMISSION_RATES.PLATFORM_FEE_RATE),
    driverAmount: COMMISSION_RATES.DELIVERY_BASE_FEE * COMMISSION_RATES.DRIVER_DELIVERY_PERCENTAGE,
    paymentMethod: paymentMethodId,
    status: Math.random() > 0.1 ? "completed" : "failed", // 90% success rate
    createdAt: new Date(),
    completedAt: new Date(),
  }

  return transaction
}

// Métodos de pago mock
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "card_1",
    type: "card",
    name: "Visa terminada en 4242",
    details: "**** **** **** 4242",
    isDefault: true,
  },
  {
    id: "card_2",
    type: "card",
    name: "Mastercard terminada en 8888",
    details: "**** **** **** 8888",
    isDefault: false,
  },
  {
    id: "cash",
    type: "cash",
    name: "Efectivo",
    details: "Pago en efectivo al recibir",
    isDefault: false,
  },
  {
    id: "mercadopago",
    type: "digital_wallet",
    name: "Mercado Pago",
    details: "usuario@email.com",
    isDefault: false,
  },
]
