'use client'

import { useEffect, useRef, useState } from "react"

export default function MerchantDashboard() {
  const [events, setEvents] = useState<string[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio('/sounds/new-order.mp3')
  }, [])

  function simulateNewOrder() {
    setEvents(prev => [`Nuevo pedido #${prev.length+1}`, ...prev])
    audioRef.current?.play().catch(()=>{})
    if (Notification?.permission === 'granted') new Notification('Nuevo pedido')
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-2">Panel de Comercio</h2>
      <button onClick={() => Notification.requestPermission?.()} className="border px-3 py-1 rounded mr-2">Permitir Notificaciones</button>
      <button onClick={simulateNewOrder} className="border px-3 py-1 rounded">Simular Pedido</button>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Eventos</h3>
        <ul className="space-y-1">
          {events.map((e, i) => <li key={i} className="border p-2 rounded">{e}</li>)}
        </ul>
      </div>
      <p className="text-sm text-gray-500 mt-6">Conectá Ably en producción para eventos reales.</p>
    </section>
  )
}
