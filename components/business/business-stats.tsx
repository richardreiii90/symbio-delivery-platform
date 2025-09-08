import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Clock, Star } from "lucide-react"

// Mock statistics data
const mockStats = {
  today: {
    orders: 24,
    revenue: 486.5,
    avgOrderValue: 20.27,
    avgDeliveryTime: 28,
  },
  week: {
    orders: 156,
    revenue: 3240.8,
    avgOrderValue: 20.78,
    avgDeliveryTime: 26,
  },
  month: {
    orders: 642,
    revenue: 13567.2,
    avgOrderValue: 21.13,
    avgDeliveryTime: 27,
  },
  rating: 4.6,
  totalReviews: 89,
  popularItems: [
    { name: "Burger Clásica", orders: 45, revenue: 584.55 },
    { name: "Burger BBQ", orders: 32, revenue: 511.68 },
    { name: "Papas Fritas", orders: 67, revenue: 334.33 },
  ],
}

export function BusinessStats() {
  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoy</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.today.orders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12% vs ayer
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockStats.today.revenue.toFixed(2)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +8% vs ayer
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockStats.today.avgOrderValue.toFixed(2)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              -2% vs ayer
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.today.avgDeliveryTime} min</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              -3 min vs ayer
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Esta Semana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pedidos:</span>
              <span className="font-semibold">{mockStats.week.orders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ingresos:</span>
              <span className="font-semibold">${mockStats.week.revenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Promedio:</span>
              <span className="font-semibold">${mockStats.week.avgOrderValue.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Este Mes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pedidos:</span>
              <span className="font-semibold">{mockStats.month.orders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ingresos:</span>
              <span className="font-semibold">${mockStats.month.revenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Promedio:</span>
              <span className="font-semibold">${mockStats.month.avgOrderValue.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Calificación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold text-center">{mockStats.rating}</div>
            <div className="text-center text-muted-foreground">Basado en {mockStats.totalReviews} reseñas</div>
            <div className="flex justify-center">
              <Badge className="bg-delivery-success text-white">Excelente</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items Más Populares</CardTitle>
          <CardDescription>Los productos más pedidos este mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStats.popularItems.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.orders} pedidos</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${item.revenue.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">ingresos</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
