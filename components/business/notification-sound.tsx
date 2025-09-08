"use client"

import { useEffect, useState } from "react"

export function NotificationSound() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)

  useEffect(() => {
    // Initialize audio context on user interaction
    const initAudio = () => {
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        setAudioContext(ctx)
      }
    }

    document.addEventListener("click", initAudio, { once: true })
    return () => document.removeEventListener("click", initAudio)
  }, [audioContext])

  useEffect(() => {
    // Simulate new order notifications every 30 seconds for demo
    const interval = setInterval(() => {
      playOrderNotification()
    }, 30000)

    return () => clearInterval(interval)
  }, [audioContext])

  const playOrderNotification = () => {
    if (!audioContext) return

    // Create a pleasant notification sound
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Create a two-tone notification
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2)
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.4)

    oscillator.type = "sine"
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.6)
  }

  return null // This component doesn't render anything visible
}
