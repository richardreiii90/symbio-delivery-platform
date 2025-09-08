import "./../styles/globals.css"
import type { ReactNode } from "react"

export const metadata = {
  title: "SYMBIO Delivery Platform",
  description: "Pedidos multi-comercio con panel para comercios y repartidores.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div style={{maxWidth: 960, margin: "0 auto", padding: 16}}>
          <header style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding: "12px 0"}}>
            <h1>SYMBIO Delivery</h1>
            <nav style={{display:"flex", gap: 12}}>
              <a href="/">Inicio</a>
              <a href="/merchant">Comercios</a>
              <a href="/admin">Admin</a>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
