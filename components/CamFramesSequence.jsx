'use client'
import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import useDevicePerformance from '../lib/hooks/useDevicePerformance'

const TOTAL_FRAMES = 279
const CRITICAL_FRAME_COUNT = 20
const BACKGROUND_BATCH_SIZE = 5
const BACKGROUND_BATCH_DELAY = 30

function getCanvasScale() {
  if (typeof window === 'undefined') return 1
  const dpr = Math.min(window.devicePixelRatio, 2)
  const isMobile = window.innerWidth < 768
  if (isMobile) return Math.min(dpr, 1.5) * 0.5
  return Math.min(dpr, 2) * 0.75
}

function signalFramesReady() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ssp:framesReady'))
  }
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
  const tlRef = useRef(null)
  const stRef = useRef(null)
  const hasSignaledReady = useRef(false)

  const fullFrameCount = useMemo(() => {
    if (isLowPerformance) return 80
    if (isMediumPerformance) return 140
    return TOTAL_FRAMES
  }, [isLowPerformance, isMediumPerformance])

  const stepSize = useMemo(() => Math.max(1, Math.floor(TOTAL_FRAMES / fullFrameCount)), [fullFrameCount])

  const render = useCallback(() => {
    if (isDestroyedRef.current) return
    const canvas = canvasRef.current
    const context = ctxRef.current
    if (!context || !canvas) return
    const images = imagesRef.current
    const idx = framesRef.current.frame
    const img = images[idx]
    if (img && img.complete && img.naturalWidth > 0) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      const scaleX = canvas.width / img.naturalWidth
      const scaleY = canvas.height / img.naturalHeight
      const s = Math.max(scaleX, scaleY)
      const x = (canvas.width / 2) - (img.naturalWidth / 2) * s
      const y = (canvas.height / 2) - (img.naturalHeight / 2) * s
      context.drawImage(img, x, y, img.naturalWidth * s, img.naturalHeight * s)
    }
  }, [])

  const createTimeline = useCallback((count) => {
    if (stRef.current) {
      stRef.current.kill()
    }
    if (tlRef.current) {
      tlRef.current.kill()
    }

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

    tl.to(framesRef.current, {
      frame: count - 1,
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

    tlRef.current = tl
    stRef.current = tl.scrollTrigger
  }, [render])

  const rebuildTimeline = useCallback((newCount) => {
    if (isDestroyedRef.current) return
    const scroll = window.scrollY
    createTimeline(newCount)
    ScrollTrigger.refresh()
  }, [createTimeline])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    hasSignaledReady.current = false

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
    framesRef.current.frame = 0

    let imagesLoaded = 0
    let criticalLoaded = 0
    let isFirstFrameRendered = false

    function createImage(index) {
      const actualFrame = Math.min(index * stepSize, TOTAL_FRAMES - 1)
      const img = new Image()
      img.fetchPriority = index < CRITICAL_FRAME_COUNT ? 'high' : 'low'
      img.src = `/CamFrames/frame_${String(actualFrame).padStart(3, '0')}_delay-0.055s.png`
      return img
    }

    function renderFirstFrame() {
      const img = images[0]
      if (img && img.complete && img.naturalWidth > 0 && !isFirstFrameRendered) {
        isFirstFrameRendered = true
        context.clearRect(0, 0, canvas.width, canvas.height)
        const scaleX = canvas.width / img.naturalWidth
        const scaleY = canvas.height / img.naturalHeight
        const s = Math.max(scaleX, scaleY)
        const x = (canvas.width / 2) - (img.naturalWidth / 2) * s
        const y = (canvas.height / 2) - (img.naturalHeight / 2) * s
        context.drawImage(img, x, y, img.naturalWidth * s, img.naturalHeight * s)
      }
    }

    function loadCriticalFrames() {
      return new Promise((resolve) => {
        let loaded = 0
        for (let i = 0; i < CRITICAL_FRAME_COUNT; i++) {
          const img = createImage(i)
          images[i] = img
          const onload = () => {
            loaded++
            criticalLoaded = loaded
            if (i === 0) renderFirstFrame()
            if (loaded === CRITICAL_FRAME_COUNT) resolve()
          }
          img.onload = onload
          img.onerror = onload
        }
      })
    }

    function loadBackgroundFrames(startIdx) {
      let idx = startIdx
      let batchLoaded = 0

      function loadNext() {
        if (idx >= fullFrameCount || isDestroyedRef.current) return

        const img = createImage(idx)
        images[idx] = img
        img.onload = () => {
          imagesLoaded++
          batchLoaded++
          const pct = Math.round(((criticalLoaded + imagesLoaded) / fullFrameCount) * 100)
          setLoadProgress(Math.min(pct, 100))
          if (idx === 0) renderFirstFrame()
          if (imagesLoaded + criticalLoaded >= fullFrameCount) {
            setIsLoaded(true)
          }
        }
        img.onerror = () => {
          imagesLoaded++
          batchLoaded++
          if (imagesLoaded + criticalLoaded >= fullFrameCount) {
            setIsLoaded(true)
          }
        }

        batchLoaded++
        if (batchLoaded >= BACKGROUND_BATCH_SIZE) {
          batchLoaded = 0
          setTimeout(loadNext, BACKGROUND_BATCH_DELAY)
        } else {
          loadNext()
        }

        idx++
      }

      loadNext()
    }

    async function init() {
      await loadCriticalFrames()
      if (isDestroyedRef.current) return

      if (!hasSignaledReady.current) {
        hasSignaledReady.current = true
        signalFramesReady()
      }

      createTimeline(CRITICAL_FRAME_COUNT)
      setIsLoaded(true)

      if (fullFrameCount > CRITICAL_FRAME_COUNT) {
        setTimeout(() => {
          loadBackgroundFrames(CRITICAL_FRAME_COUNT)
        }, 500)
      }
    }

    init()

    return () => {
      isDestroyedRef.current = true
      if (tlRef.current) tlRef.current.kill()
      if (stRef.current) stRef.current.kill()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      images.length = 0
    }
  }, [fullFrameCount, stepSize, createTimeline, render])

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
          <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm md:text-base mb-4 md:mb-6 drop-shadow-md">Fluid Motion</p>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 tracking-tight leading-[0.9] drop-shadow-2xl">Unmatched<br/>Smoothness</h1>
          <p className="text-lg md:text-2xl text-ssp-gray-light mt-6 max-w-2xl mx-auto drop-shadow-md">Dynamic and precise transitions.</p>
        </div>

        <div className="sec-3-text absolute text-center text-ssp-white px-6 opacity-0 w-full max-w-4xl">
          <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm md:text-base mb-4 md:mb-6 drop-shadow-md">Visual Excellence</p>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 tracking-tight leading-[0.9] drop-shadow-2xl">Premium<br/>Detail</h1>
          <p className="text-lg md:text-2xl text-ssp-gray-light mt-6 max-w-2xl mx-auto drop-shadow-md">Pixel-perfect precision in every shot.</p>
        </div>

        <div className="sec-4-text absolute text-center text-ssp-white px-6 opacity-0 w-full max-w-4xl">
          <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm md:text-base mb-4 md:mb-6 drop-shadow-md">The Final Cut</p>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 tracking-tight leading-[0.9] drop-shadow-2xl">Your Vision,<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-ssp-accent to-ssp-accent-light">Realized</span></h1>
          <p className="text-lg md:text-2xl text-ssp-gray-light mt-6 max-w-2xl mx-auto drop-shadow-md">Let&apos;s build something extraordinary together.</p>
        </div>
      </div>
    </div>
  )
}
