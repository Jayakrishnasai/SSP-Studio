'use client'
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import useDevicePerformance from '../lib/hooks/useDevicePerformance'

const TOTAL_FRAMES = 279

function getCanvasScale() {
  if (typeof window === 'undefined') return 1
  const dpr = Math.min(window.devicePixelRatio, 2)
  const isMobile = window.innerWidth < 768
  if (isMobile) return Math.min(dpr, 1.5) * 0.6
  return Math.min(dpr, 2) * 0.75
}

export default function CamFramesSequence() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const { isLowPerformance, isMediumPerformance } = useDevicePerformance()
  const imagesRef = useRef([])
  const framesRef = useRef({ frame: 0 })
  const ctxRef = useRef(null)
  const rafRef = useRef(null)
  const isDestroyedRef = useRef(false)
  const pendingRenderRef = useRef(false)

  const frameCount = useMemo(() => {
    if (isLowPerformance) return 80
    if (isMediumPerformance) return 140
    return TOTAL_FRAMES
  }, [isLowPerformance, isMediumPerformance])

  const stepSize = useMemo(() => Math.max(1, Math.floor(TOTAL_FRAMES / frameCount)), [frameCount])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { alpha: false, desynchronized: true })
    ctxRef.current = context

    const scale = getCanvasScale()
    const baseW = Math.min(window.innerWidth, 1920)
    const baseH = Math.min(window.innerHeight, 1080)
    canvas.width = baseW * scale
    canvas.height = baseH * scale
    canvas.style.width = `${baseW}px`
    canvas.style.height = `${baseH}px`

    isDestroyedRef.current = false

    const images = []
    imagesRef.current = images
    const frames = framesRef.current
    frames.frame = 0

    let imagesLoaded = 0
    let isFirstFrameRendered = false

    function render() {
      if (isDestroyedRef.current) return
      if (!context || !canvas) return
      const img = images[frames.frame]
      if (img && img.complete && img.naturalWidth > 0) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        const scaleX = canvas.width / img.naturalWidth
        const scaleY = canvas.height / img.naturalHeight
        const s = Math.max(scaleX, scaleY)
        const x = (canvas.width / 2) - (img.naturalWidth / 2) * s
        const y = (canvas.height / 2) - (img.naturalHeight / 2) * s
        context.drawImage(img, x, y, img.naturalWidth * s, img.naturalHeight * s)
      }
    }

    function progressiveLoad(startIdx) {
      const loadBatch = Math.min(15, frameCount)
      let loaded = 0

      function loadNext(idx) {
        if (idx >= frameCount || isDestroyedRef.current) return
        const actualFrame = Math.min(idx * stepSize, TOTAL_FRAMES - 1)
        const img = new Image()
        img.fetchPriority = idx < 20 ? 'high' : 'low'
        img.src = `/CamFrames/frame_${String(actualFrame).padStart(3, '0')}_delay-0.055s.png`
        img.onload = () => {
          images[idx] = img
          loaded++
          imagesLoaded++
          const progress = Math.round((imagesLoaded / frameCount) * 100)
          setLoadProgress(progress)
          if (idx === 0) {
            render()
            isFirstFrameRendered = true
          }
          if (imagesLoaded === frameCount) {
            setIsLoaded(true)
          }
        }
        img.onerror = () => {
          images[idx] = img
          loaded++
          imagesLoaded++
          if (imagesLoaded === frameCount) {
            setIsLoaded(true)
          }
        }
        if (loaded >= loadBatch) {
          loaded = 0
          setTimeout(() => loadNext(idx + 1), 50)
        } else {
          loadNext(idx + 1)
        }
      }

      loadNext(startIdx || 0)
    }

    progressiveLoad(0)

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=400%',
          scrub: 0.3,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      tl.to(frames, {
        frame: frameCount - 1,
        snap: 'frame',
        ease: 'none',
        onUpdate: render,
        duration: 1,
      }, 0)

      tl.to('.sec-1-text', { opacity: 0, y: -50, duration: 0.1, ease: 'power2.inOut' }, 0.1)

      tl.fromTo('.sec-2-text', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.2)
        .to('.sec-2-text', { opacity: 0, y: -50, duration: 0.1, ease: 'power2.inOut' }, 0.4)

      tl.fromTo('.sec-3-text', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.45)
        .to('.sec-3-text', { opacity: 0, y: -50, duration: 0.1, ease: 'power2.inOut' }, 0.65)

      tl.fromTo('.sec-4-text', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.7)
        .to('.sec-4-text', { opacity: 0, scale: 0.9, duration: 0.1, ease: 'power2.inOut' }, 0.95)
    }, containerRef)

    return () => {
      isDestroyedRef.current = true
      ctx.revert()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      images.length = 0
    }
  }, [frameCount, stepSize])

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-ssp-darker overflow-hidden will-change-transform">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 z-10 pointer-events-none" />

      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="sec-1-text absolute text-center text-ssp-white px-6 w-full max-w-4xl">
          <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm md:text-base mb-4 md:mb-6 drop-shadow-md">
              Cinematic Experience
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 tracking-tight leading-[0.9] drop-shadow-2xl">
              Every Frame<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-ssp-accent to-ssp-accent-light">Tells A Story</span>
          </h1>
          <p className="text-lg md:text-2xl text-ssp-gray-light mt-6 max-w-2xl mx-auto drop-shadow-md">
              Scroll to explore the visual journey.
          </p>
        </div>

        <div className="sec-2-text absolute text-center text-ssp-white px-6 opacity-0 w-full max-w-4xl">
          <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm md:text-base mb-4 md:mb-6 drop-shadow-md">
              Fluid Motion
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 tracking-tight leading-[0.9] drop-shadow-2xl">
              Unmatched<br/>Smoothness
          </h1>
          <p className="text-lg md:text-2xl text-ssp-gray-light mt-6 max-w-2xl mx-auto drop-shadow-md">
              Dynamic and precise transitions.
          </p>
        </div>

        <div className="sec-3-text absolute text-center text-ssp-white px-6 opacity-0 w-full max-w-4xl">
          <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm md:text-base mb-4 md:mb-6 drop-shadow-md">
              Visual Excellence
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 tracking-tight leading-[0.9] drop-shadow-2xl">
              Premium<br/>Detail
          </h1>
          <p className="text-lg md:text-2xl text-ssp-gray-light mt-6 max-w-2xl mx-auto drop-shadow-md">
              Pixel-perfect precision in every shot.
          </p>
        </div>

        <div className="sec-4-text absolute text-center text-ssp-white px-6 opacity-0 w-full max-w-4xl">
          <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm md:text-base mb-4 md:mb-6 drop-shadow-md">
              The Final Cut
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 tracking-tight leading-[0.9] drop-shadow-2xl">
              Your Vision,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-ssp-accent to-ssp-accent-light">Realized</span>
          </h1>
          <p className="text-lg md:text-2xl text-ssp-gray-light mt-6 max-w-2xl mx-auto drop-shadow-md">
              Let's build something extraordinary together.
          </p>
        </div>
      </div>

      {!isLoaded && (
        <div className="absolute bottom-10 right-10 z-50 text-ssp-accent text-sm tracking-widest uppercase flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-ssp-accent border-t-transparent rounded-full animate-spin" />
          <span>Loading {loadProgress}%</span>
        </div>
      )}
    </div>
  )
}
