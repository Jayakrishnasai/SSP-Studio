'use client'
import { useEffect, useRef } from 'react'
import useDevicePerformance from '../lib/hooks/useDevicePerformance'
import { debounce } from '../lib/utils'

export default function Particles() {
  const canvasRef = useRef(null)
  const { particleCount, particleLineDistance, disableParticles } = useDevicePerformance()

  useEffect(() => {
    if (disableParticles) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      const count = Math.min(
        Math.floor((canvas.width * canvas.height) / 18000),
        particleCount
      )
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.1,
      }))
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const len = particles.length
      for (let i = 0; i < len; i++) {
        const p = particles[i]
        p.x += p.speedX
        p.y += p.speedY

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 168, 110, ${p.opacity})`
        ctx.fill()
      }

      if (particleLineDistance > 0) {
        for (let i = 0; i < len; i++) {
          const a = particles[i]
          for (let j = i + 1; j < len; j++) {
            const b = particles[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const distSq = dx * dx + dy * dy
            if (distSq < particleLineDistance * particleLineDistance) {
              const dist = Math.sqrt(distSq)
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.strokeStyle = `rgba(200, 168, 110, ${0.05 * (1 - dist / particleLineDistance)})`
              ctx.stroke()
            }
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    resize()
    createParticles()
    animate()

    const debouncedResize = debounce(() => {
      resize()
      createParticles()
    }, 250)

    window.addEventListener('resize', debouncedResize, { passive: true })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', debouncedResize)
      particles = []
    }
  }, [particleCount, particleLineDistance, disableParticles])

  if (disableParticles) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
