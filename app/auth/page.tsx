"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState("customer")
  const [showMasterKey, setShowMasterKey] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("[v0] Frontend: Intentando login con email:", email)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()
      console.log("[v0] Frontend: Respuesta del servidor:", result)

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.user))

        toast({
          title: "¡Bienvenido!",
          description: `Sesión iniciada como ${result.user.name}`,
          duration: 3000,
        })

        setTimeout(() => {
          // Redirigir según tipo de usuario
          if (result.user.userType === "business") {
            router.push("/business")
          } else if (result.user.userType === "driver") {
            router.push("/driver")
          } else if (result.user.userType === "admin") {
            router.push("/admin")
          } else {
            router.push("/")
          }
        }, 1000)
      } else {
        console.log("[v0] Frontend: Error de login:", result.error)
        toast({
          title: "Error de inicio de sesión",
          description: result.error || "Credenciales incorrectas",
          variant: "destructive",
          duration: 5000,
        })
      }
    } catch (error) {
      console.error("[v0] Frontend: Login error:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string
    const masterKey = formData.get("masterKey") as string

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, userType, masterKey }),
      })

      const result = await response.json()

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.user))

        toast({ title: "¡Cuenta creada!", description: `Bienvenido ${result.user.name}` })

        // Redirigir según tipo de usuario
        if (result.user.userType === "business") {
          router.push("/business")
        } else if (result.user.userType === "driver") {
          router.push("/driver")
        } else if (result.user.userType === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      } else {
        toast({
          title: "Error al crear cuenta",
          description: result.error || "No se pudo crear la cuenta. Intenta nuevamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Register error:", error)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor. Verifica tu conexión.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserTypeChange = (value: string) => {
    setUserType(value)
    setShowMasterKey(value === "admin")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-xl">D</span>
            </div>
            <CardTitle>Bienvenido a DeliveryApp</CardTitle>
            <CardDescription>Inicia sesión o crea una cuenta para comenzar</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" name="password" type="password" placeholder="••••••••" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userType">Tipo de cuenta</Label>
                    <Select value={userType} onValueChange={handleUserTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de cuenta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Cliente</SelectItem>
                        <SelectItem value="business">Comercio/Tienda</SelectItem>
                        <SelectItem value="driver">Repartidor</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {showMasterKey && (
                    <div className="space-y-2">
                      <Label htmlFor="masterKey">Llave Maestra</Label>
                      <Input
                        id="masterKey"
                        name="masterKey"
                        type="password"
                        placeholder="Llave maestra requerida"
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Se requiere llave maestra para crear cuentas de administrador
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" name="name" type="text" placeholder="Tu nombre" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input id="email-register" name="email" type="email" placeholder="tu@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+1234567890" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Contraseña</Label>
                    <Input id="password-register" name="password" type="password" placeholder="••••••••" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
