import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Package, Clock, Star, TrendingUp, Target } from "lucide-react"

// Mock statistics data
const mockStats = {
  today: {
    deliveries: 8,
    earnings: 87.5,
    hours: 6.5,
    avgRating: 4.8,
  },
  week: {
    deliveries: 42,
    earnings: 456.75,
    hours: 28.5,
    avgRating: 4.7,
  },
  month: {
    deliveries: 186,
    earnings: 1987.25,
    hours: 124,
    avgRating: 4.8,
  },
  goals: {
    weeklyEarnings: { current: 456.75, target: 600, progress: 76 },
    weeklyDeliveries: { current: 42, target: 50, progress: 84 },
    rating: { current: 4.7, target: 4.5, progress: 100 },
  },
  recentDeliveries: [
    { id: "ORD-001", restaurant: "Burger Palace", earnings: 12.5, rating: 5, time: "14:30" },
    { id: "ORD-002", restaurant: "Pizza Express", earnings: 8.75, rating: 4, time: "13:45" },
    { id: "ORD-003", restaurant: "Sushi Zen", earnings: 15.25, rating: 5, time: "12:20" },
  ],
}

export function DriverStats() {
  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregas Hoy</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.today.deliveries}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +2 vs ayer
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancias Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockStats.today.earnings.toFixed(2)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +15% vs ayer
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas Trabajadas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.today.hours}h</div>
            <div className="text-xs text-muted-foreground">
              ${(mockStats.today.earnings / mockStats.today.hours).toFixed(2)}/hora
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.today.avgRating}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
              Excelente
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Metas de la Semana
          </CardTitle>
          <CardDescription>Tu progreso hacia las metas semanales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Ganancias Semanales</span>
              <span className="font-medium">
                ${mockStats.goals.weeklyEarnings.current.toFixed(2)} / $
                {mockStats.goals.weeklyEarnings.target.toFixed(2)}
              </span>
            </div>
            <Progress value={mockStats.goals.weeklyEarnings.progress} className="h-2" />
            <p className="text-xs text-muted-foreground">{mockStats.goals.weeklyEarnings.progress}% completado</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Entregas Semanales</span>
              <span className="font-medium">
                {mockStats.goals.weeklyDeliveries.current} / {mockStats.goals.weeklyDeliveries.target}
              </span>
            </div>
            <Progress value={mockStats.goals.weeklyDeliveries.progress} className="h-2" />
            <p className="text-xs text-muted-foreground">{mockStats.goals.weeklyDeliveries.progress}% completado</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Calificación Promedio</span>
              <span className="font-medium">
                {mockStats.goals.rating.current} / {mockStats.goals.rating.target}
              </span>
            </div>
            <Progress value={mockStats.goals.rating.progress} className="h-2" />
            <div className="flex items-center gap-1">
              <Badge className="bg-delivery-success text-white text-xs">Meta alcanzada</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Period Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Esta Semana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entregas:</span>
              <span className="font-semibold">{mockStats.week.deliveries}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ganancias:</span>
              <span className="font-semibold">${mockStats.week.earnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Horas:</span>
              <span className="font-semibold">{mockStats.week.hours}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Promedio/hora:</span>
              <span className="font-semibold">${(mockStats.week.earnings / mockStats.week.hours).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Este Mes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entregas:</span>
              <span className="font-semibold">{mockStats.month.deliveries}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ganancias:</span>
              <span className="font-semibold">${mockStats.month.earnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Horas:</span>
              <span className="font-semibold">{mockStats.month.hours}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Promedio/hora:</span>
              <span className="font-semibold">${(mockStats.month.earnings / mockStats.month.hours).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Entregas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockStats.recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{delivery.restaurant}</p>
                    <p className="text-xs text-muted-foreground">{delivery.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">${delivery.earnings.toFixed(2)}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs">{delivery.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
