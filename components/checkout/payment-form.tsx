"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Banknote, Smartphone, Plus, Loader2 } from "lucide-react"
import { mockPaymentMethods, processPayment, type PaymentMethod } from "@/lib/payments"
import { useToast } from "@/hooks/use-toast"

interface PaymentFormProps {
  subtotal: number
  deliveryFee: number
  total: number
  onPaymentSuccess: (transactionId: string) => void
}

export function PaymentForm({ subtotal, deliveryFee, total, onPaymentSuccess }: PaymentFormProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(mockPaymentMethods[0].id)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAddCard, setShowAddCard] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      const transaction = await processPayment(total, selectedPaymentMethod, `ORD-${Date.now()}`)

      if (transaction.status === "completed") {
        toast({
          title: "Pago exitoso",
          description: "Tu pedido ha sido confirmado y está siendo preparado",
        })
        onPaymentSuccess(transaction.id)
      } else {
        toast({
          title: "Error en el pago",
          description: "No se pudo procesar el pago. Intenta con otro método.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar el pago",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getPaymentIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "card":
        return <CreditCard className="w-5 h-5" />
      case "cash":
        return <Banknote className="w-5 h-5" />
      case "digital_wallet":
        return <Smartphone className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
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
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Comisión de servicio (incluida)</span>
            <span>${(subtotal * 0.15).toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Métodos de pago */}
      <Card>
        <CardHeader>
          <CardTitle>Método de pago</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
            <div className="space-y-3">
              {mockPaymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <div className="flex items-center gap-3 flex-1">
                    {getPaymentIcon(method.type)}
                    <div className="flex-1">
                      <Label htmlFor={method.id} className="font-medium cursor-pointer">
                        {method.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{method.details}</p>
                    </div>
                    {method.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Predeterminado
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>

          {/* Agregar nueva tarjeta */}
          {!showAddCard ? (
            <Button variant="outline" onClick={() => setShowAddCard(true)} className="w-full mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Agregar nueva tarjeta
            </Button>
          ) : (
            <Card className="mt-4">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardNumber">Número de tarjeta</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                    <Input id="cardName" placeholder="Juan Pérez" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Vencimiento</Label>
                    <Input id="expiry" placeholder="MM/AA" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowAddCard(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button className="flex-1">Guardar tarjeta</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Botón de pago */}
      <Button onClick={handlePayment} disabled={isProcessing} className="w-full" size="lg">
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Procesando pago...
          </>
        ) : (
          `Pagar ${total.toFixed(2)}`
        )}
      </Button>
    </div>
  )
}
