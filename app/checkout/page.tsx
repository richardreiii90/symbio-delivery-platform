"use client"

import { useState } from "react"
import { PaymentForm } from "@/components/checkout/payment-form"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [transactionId, setTransactionId] = useState("")

  const subtotal = getTotalPrice()
  const deliveryFee = 2.5
  const total = subtotal + deliveryFee

  const handlePaymentSuccess = (txnId: string) => {
    setTransactionId(txnId)
    setPaymentCompleted(true)
    clearCart()
  }

  if (items.length === 0 && !paymentCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Carrito vacío</h1>
          <p className="text-muted-foreground mb-4">Agrega algunos productos antes de proceder al pago</p>
          <Link href="/">
            <Button>Explorar restaurantes</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">¡Pago exitoso!</h1>
          <p className="text-muted-foreground mb-4">Tu pedido ha sido confirmado y está siendo preparado</p>
          <p className="text-sm text-muted-foreground mb-6">ID de transacción: {transactionId}</p>
          <div className="space-y-2">
            <Link href="/orders">
              <Button className="w-full">Ver mis pedidos</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent">
                Seguir comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Checkout</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <PaymentForm
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          total={total}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </main>
    </div>
  )
}
