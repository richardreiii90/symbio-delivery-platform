"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, Calendar, Download, CreditCard } from "lucide-react"

// Mock data para ganancias del negocio
const mockEarningsData = {
  today: {
    revenue: 1250.5,
    orders: 28,
    platformFee: 187.58,
    netEarnings: 1062.92,
  },
  week: {
    revenue: 8750.25,
    orders: 195,
    platformFee: 1312.54,
    netEarnings: 7437.71,
  },
  month: {
    revenue: 35420.8,
    orders: 842,
    platformFee: 5313.12,
    netEarnings: 30107.68,
  },
}

const mockTransactions = [
  {
    id: "TXN-001",
    orderId: "ORD-001",
    amount: 45.5,
    platformFee: 6.83,
    netAmount: 38.67,
    date: "2024-01-15T14:30:00Z",
    status: "completed",
  },
  {
    id: "TXN-002",
    orderId: "ORD-002",
    amount: 32.75,
    platformFee: 4.91,
    netAmount: 27.84,
    date: "2024-01-15T13:45:00Z",
    status: "completed",
  },
  {
    id: "TXN-003",
    orderId: "ORD-003",
    amount: 28.9,
    platformFee: 4.34,
    netAmount: 24.56,
    date: "2024-01-15T12:20:00Z",
    status: "pending",
  },
]

export function EarningsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("today")

  const currentData = mockEarningsData[selectedPeriod]

  return (
    <div className="space-y-6">
      {/* Resumen de ganancias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Brutos</p>
                <p className="text-2xl font-bold text-primary">${currentData.revenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Comisión Plataforma</p>
                <p className="text-2xl font-bold text-red-600">-${currentData.platformFee.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ganancias Netas</p>
                <p className="text-2xl font-bold text-green-600">${currentData.netEarnings.toFixed(2)}</p>
              </div>
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pedidos</p>
                <p className="text-2xl font-bold">{currentData.orders}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros de período */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Historial de Transacciones</CardTitle>
            <div className="flex gap-2">
              <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
                <TabsList>
                  <TabsTrigger value="today">Hoy</TabsTrigger>
                  <TabsTrigger value="week">Semana</TabsTrigger>
                  <TabsTrigger value="month">Mes</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">Pedido #{transaction.orderId}</p>
                    <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                      {transaction.status === "completed" ? "Completado" : "Pendiente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Bruto: ${transaction.amount.toFixed(2)}</p>
                  <p className="text-sm text-red-600">Comisión: -${transaction.platformFee.toFixed(2)}</p>
                  <p className="font-semibold text-green-600">Neto: ${transaction.netAmount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información de transferencias */}
      <Card>
        <CardHeader>
          <CardTitle>Próxima Transferencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Monto a transferir:</span>
              <span className="text-xl font-bold text-primary">${currentData.netEarnings.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Las transferencias se realizan automáticamente cada lunes a las 9:00 AM
            </p>
            <div className="flex gap-2">
              <Button size="sm">Configurar cuenta bancaria</Button>
              <Button variant="outline" size="sm">
                Ver historial
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
