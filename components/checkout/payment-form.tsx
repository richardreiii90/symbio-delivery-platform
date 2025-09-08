"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Banknote, Smartphone, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"

interface PaymentFormProps {
  subtotal: number
  deliveryFee: number
  total: number
  onPaymentSuccess: (transactionId: string) => void
}

const paymentMethods = [
  { id: "efectivo", name: "Efectivo", icon: Banknote, description: "Pago al recibir el pedido" },
  { id: "tarjeta", name: "Tarjeta de Crédito/Débito", icon: CreditCard, description: "Visa, Mastercard, etc." },
  { id: "transferencia", name: "Transferencia Bancaria", icon: Smartphone, description: "Mercado Pago, etc." },
]

export function PaymentForm({ subtotal, deliveryFee, total, onPaymentSuccess }: PaymentFormProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("efectivo")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const { items } = useCart()

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      const selectedMethod = paymentMethods.find((m) => m.id === selectedPaymentMethod)

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: 1, // En una app real, esto vendría del contexto de usuario autenticado
          businessId: 1, // También cambié a integer para consistencia
          items: items,
          total: total,
          deliveryAddress: "Dirección del cliente",
          paymentMethod: selectedMethod?.name || "Efectivo",
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "¡Pedido confirmado!",
          description: result.message,
        })
        onPaymentSuccess(result.orderId)
      } else {
        toast({
          title: "Error",
          description: "No se pudo procesar el pedido",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error processing order:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar el pedido",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Resumen del pedido */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Envío</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Método de pago</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon
                return (
                  <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex items-center gap-3 flex-1">
                      <IconComponent className="w-5 h-5" />
                      <div className="flex-1">
                        <Label htmlFor={method.id} className="font-medium cursor-pointer">
                          {method.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Botón de confirmación */}
      <Button onClick={handlePayment} disabled={isProcessing} className="w-full" size="lg">
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Confirmando pedido...
          </>
        ) : (
          `Confirmar pedido - $${total.toFixed(2)}`
        )}
      </Button>
    </div>
  )
}
