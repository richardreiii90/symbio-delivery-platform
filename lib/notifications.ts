// Sistema de notificaciones en tiempo real
export interface Notification {
  id: string
  type:
    | "order_created"
    | "order_accepted"
    | "order_rejected"
    | "order_picked_up"
    | "order_delivered"
    | "driver_assigned"
  title: string
  message: string
  data?: any
  timestamp: Date
  read: boolean
  userId: string
  userType: "customer" | "business" | "driver"
}

export interface OrderUpdate {
  orderId: string
  status: "pending" | "accepted" | "preparing" | "ready" | "picked_up" | "delivered" | "cancelled"
  estimatedTime?: number
  driverId?: string
  businessId: string
  customerId: string
}

// Simulación de base de datos en memoria para notificaciones
const notifications: Notification[] = []
const subscribers = new Map<string, Response>()

export function addNotification(notification: Omit<Notification, "id" | "timestamp" | "read">) {
  const newNotification: Notification = {
    ...notification,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date(),
    read: false,
  }

  notifications.push(newNotification)

  // Enviar notificación a suscriptores
  const userKey = `${notification.userType}_${notification.userId}`
  const subscriber = subscribers.get(userKey)

  if (subscriber) {
    const encoder = new TextEncoder()
    const data = encoder.encode(`data: ${JSON.stringify(newNotification)}\n\n`)
    subscriber.body?.getWriter().write(data)
  }

  return newNotification
}

export function getNotifications(userId: string, userType: string): Notification[] {
  return notifications.filter((n) => n.userId === userId && n.userType === userType)
}

export function markAsRead(notificationId: string) {
  const notification = notifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

export function addSubscriber(userId: string, userType: string, response: Response) {
  const key = `${userType}_${userId}`
  subscribers.set(key, response)
}

export function removeSubscriber(userId: string, userType: string) {
  const key = `${userType}_${userId}`
  subscribers.delete(key)
}

// Funciones helper para crear notificaciones específicas
export function notifyOrderCreated(orderId: string, businessId: string, customerName: string) {
  addNotification({
    type: "order_created",
    title: "Nuevo Pedido",
    message: `Nuevo pedido de ${customerName}`,
    data: { orderId },
    userId: businessId,
    userType: "business",
  })
}

export function notifyOrderAccepted(orderId: string, customerId: string, businessName: string) {
  addNotification({
    type: "order_accepted",
    title: "Pedido Aceptado",
    message: `${businessName} ha aceptado tu pedido`,
    data: { orderId },
    userId: customerId,
    userType: "customer",
  })
}

export function notifyDriverAssigned(orderId: string, customerId: string, driverName: string) {
  addNotification({
    type: "driver_assigned",
    title: "Repartidor Asignado",
    message: `${driverName} está en camino a recoger tu pedido`,
    data: { orderId },
    userId: customerId,
    userType: "customer",
  })
}
