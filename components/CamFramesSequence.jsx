'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

const copy = {
  section1: {
    eyebrow: 'Cinematic Experience',
    headlineMain: 'Every Frame',
    headlineAccent: 'Tells A Story',
    body: 'Scroll to explore the visual journey.',
  },
  section2: {
    eyebrow: 'Fluid Motion',
    headlineMain: 'Unmatched',
    headlineSecond: 'Smoothness',
    body: 'Dynamic and precise transitions.',
  },
  section3: {
    eyebrow: 'Visual Excellence',
    headlineMain: 'Premium',
    headlineSecond: 'Detail',
    body: 'Pixel-perfect precision in every shot.',
  },
  section4: {
    eyebrow: 'The Final Cut',
    headlineMain: 'Your Vision,',
    headlineAccent: 'Realized',
    body: "Let's build something extraordinary together.",
  },
  loading: 'Loading Sequence...',
}

export default function CamFramesSequence() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d', { alpha: false })

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    const frameCount = 279
    const frameFolder = window.innerWidth < 768
      ? '/CamFramesWebP/mobile'
      : window.innerWidth < 1200
        ? '/CamFramesWebP/tablet'
        : '/CamFramesWebP/desktop'
    const preloadCount = isMobile ? 14 : 28
    const preloadRadius = isMobile ? 28 : 60
    const evictionPadding = preloadRadius * 2
    const mobileFrameStep = 1
    const timelineFrameCount = Math.ceil(frameCount / mobileFrameStep)

    const currentFrame = index => `${frameFolder}/frame_${String(index).padStart(3, '0')}.webp`
    const fallbackFrame = index => `/CamFrames/frame_${String(index).padStart(3, '0')}_delay-0.055s.png`
    const imagePromises = new Map()
    const decodedImages = new Map()
    const frames = { frame: 0 }
    const renderState = {
      rafId: null,
      requestedFrame: 0,
      renderedFrame: -1,
      active: true,
    }
    let handleResize = null
    let handleVisibilityChange = null

    let ctx = gsap.context(() => {
      resizeCanvas()

      function loadFrame(index, useFallback = false, fetchPriority = 'auto') {
        const safeIndex = Math.max(0, Math.min(frameCount - 1, index))
        const cacheKey = `${useFallback ? 'png' : 'webp'}-${safeIndex}`

        if (imagePromises.has(cacheKey)) {
          return imagePromises.get(cacheKey)
        }

        const img = new Image()
        img.decoding = 'async'
        img.fetchPriority = fetchPriority
        img.src = useFallback ? fallbackFrame(safeIndex) : currentFrame(safeIndex)

        const promise = img.decode()
          .then(() => {
            decodedImages.set(safeIndex, img)
            return img
          })
          .catch(() => {
            imagePromises.delete(cacheKey)

            if (!useFallback) {
              return loadFrame(safeIndex, true, fetchPriority)
            }

            return null
          })

        imagePromises.set(cacheKey, promise)
        return promise
      }

      function preloadInitialFrames() {
        const requests = []

        for (let i = 0; i < preloadCount; i++) {
          requests.push(loadFrame(i * mobileFrameStep))
        }

        Promise.allSettled(requests).then(() => setIsLoaded(true))
      }

      function preloadAround(index) {
        const renderedFrame = renderState.renderedFrame >= 0 ? renderState.renderedFrame : index
        const bridgeStart = Math.min(index, renderedFrame)
        const bridgeEnd = Math.max(index, renderedFrame)
        const start = Math.max(0, bridgeStart - preloadRadius)
        const end = Math.min(frameCount - 1, bridgeEnd + preloadRadius)
        const direction = index >= renderState.renderedFrame ? 1 : -1

        loadFrame(index, false, 'high')

        for (let distance = mobileFrameStep; distance <= preloadRadius; distance += mobileFrameStep) {
          const ahead = index + (distance * direction)
          const behind = index - (distance * direction)

          if (ahead >= start && ahead <= end) {
            loadFrame(ahead, false, distance <= mobileFrameStep * 3 ? 'high' : 'auto')
          }

          if (behind >= start && behind <= end) {
            loadFrame(behind)
          }
        }

        preloadBridgeFrames(renderedFrame, index, direction)

        for (const cachedIndex of decodedImages.keys()) {
          if (cachedIndex < start - evictionPadding || cachedIndex > end + evictionPadding) {
            decodedImages.delete(cachedIndex)
            imagePromises.delete(`webp-${cachedIndex}`)
            imagePromises.delete(`png-${cachedIndex}`)
          }
        }
      }

      function preloadBridgeFrames(fromFrame, toFrame, direction) {
        if (fromFrame === toFrame) return

        const bridgeLimit = isMobile ? 18 : 28
        const start = fromFrame + direction
        const end = direction > 0
          ? Math.min(toFrame, fromFrame + bridgeLimit)
          : Math.max(toFrame, fromFrame - bridgeLimit)

        for (let frame = start; direction > 0 ? frame <= end : frame >= end; frame += direction) {
          loadFrame(frame, false, 'high')
        }
      }

      function getResolvedFrame(rawFrame) {
        return Math.min(frameCount - 1, Math.round(rawFrame) * mobileFrameStep)
      }

      function requestRender(index) {
        renderState.requestedFrame = index

        if (renderState.rafId) return

        renderState.rafId = requestAnimationFrame(advanceRender)
      }

      function advanceRender() {
        renderState.rafId = null

        if (!renderState.active || renderState.renderedFrame === renderState.requestedFrame) {
          return
        }

        const didDrawFrame = renderFrame(getNextDisplayFrame())

        if (didDrawFrame && renderState.active && renderState.renderedFrame !== renderState.requestedFrame) {
          renderState.rafId = requestAnimationFrame(advanceRender)
        }
      }

      function getNextDisplayFrame() {
        if (renderState.renderedFrame < 0) {
          return 0
        }

        const direction = renderState.requestedFrame > renderState.renderedFrame ? 1 : -1
        return renderState.renderedFrame + direction
      }

      function renderFrame(index) {
        const img = decodedImages.get(index)

        if (!img) {
          const direction = renderState.requestedFrame >= renderState.renderedFrame ? 1 : -1
          preloadBridgeFrames(
            renderState.renderedFrame >= 0 ? renderState.renderedFrame : index,
            renderState.requestedFrame,
            direction
          )

          loadFrame(index, false, 'high').then(loadedImage => {
            if (!loadedImage || !renderState.active) return

            const isStillNeeded = renderState.renderedFrame < renderState.requestedFrame
              ? index > renderState.renderedFrame && index <= renderState.requestedFrame
              : index < renderState.renderedFrame && index >= renderState.requestedFrame

            if (isStillNeeded) {
              requestRender(renderState.requestedFrame)
            }
          })

          if (renderState.renderedFrame < 0) {
            const nearestFrame = getNearestDecodedFrame(index)

            if (nearestFrame !== null) {
              drawFrame(nearestFrame, decodedImages.get(nearestFrame))
            }
          }

          return false
        }

        drawFrame(index, img)
        return true
      }

      function getNearestDecodedFrame(index) {
        let nearestFrame = null
        let nearestDistance = Infinity
        const maxDistance = preloadRadius + evictionPadding

        for (const cachedIndex of decodedImages.keys()) {
          const distance = Math.abs(cachedIndex - index)

          if (distance < nearestDistance && distance <= maxDistance) {
            nearestFrame = cachedIndex
            nearestDistance = distance
          }
        }

        return nearestFrame
      }

      function drawFrame(index, img) {
        context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

        const scale = Math.max(canvas.clientWidth / img.width, canvas.clientHeight / img.height)
        const width = img.width * scale
        const height = img.height * scale
        const x = (canvas.clientWidth - width) / 2
        const y = (canvas.clientHeight - height) / 2

        context.drawImage(img, x, y, width, height)
        renderState.renderedFrame = index
      }

      function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const rect = canvas.getBoundingClientRect()
        const width = Math.round(rect.width * dpr)
        const height = Math.round(rect.height * dpr)

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
          context.setTransform(dpr, 0, 0, dpr, 0, 0)
          requestRender(renderState.renderedFrame >= 0 ? renderState.renderedFrame : 0)
        }
      }

      handleResize = function handleResize() {
        resizeCanvas()
        ScrollTrigger.refresh()
      }

      handleVisibilityChange = function handleVisibilityChange() {
        renderState.active = !document.hidden

        if (renderState.active) {
          requestRender(renderState.requestedFrame)
        }
      }

      window.addEventListener('resize', handleResize, { passive: true })
      document.addEventListener('visibilitychange', handleVisibilityChange)

      loadFrame(0).then(img => {
        if (img) {
          setIsLoaded(true)
          requestRender(0)
          preloadInitialFrames()
        }
      })

      if (prefersReducedMotion) {
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%", // Scroll 4 viewport heights down to scrub the entire video
          scrub: 0.5, // 0.5 seconds delay for smooth scrubbing
          pin: true,
          anticipatePin: 1,
        }
      })

      // Animate frame sequence
      tl.to(frames, {
        frame: timelineFrameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: () => {
          const nextFrame = getResolvedFrame(frames.frame)
          requestRender(nextFrame)
          preloadAround(nextFrame)
        },
        duration: 1
      }, 0)

      // Section 1 Text Animation (Visible initially, fades out)
      tl.to(".sec-1-text", { opacity: 0, y: -50, duration: 0.1, ease: "power2.inOut" }, 0.1)
      
      // Section 2 Text Animation
      tl.fromTo(".sec-2-text", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" }, 0.2)
        .to(".sec-2-text", { opacity: 0, y: -50, duration: 0.1, ease: "power2.inOut" }, 0.4)
        
      // Section 3 Text Animation
      tl.fromTo(".sec-3-text", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" }, 0.45)
        .to(".sec-3-text", { opacity: 0, y: -50, duration: 0.1, ease: "power2.inOut" }, 0.65)
        
      // Section 4 Text Animation
      tl.fromTo(".sec-4-text", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" }, 0.7)
        .to(".sec-4-text", { opacity: 0, scale: 0.9, duration: 0.1, ease: "power2.inOut" }, 0.95) // Final fade out before Hero section

    }, containerRef)

    return () => {
      renderState.active = false

      if (renderState.rafId) {
        cancelAnimationFrame(renderState.rafId)
      }

      if (handleResize) {
        window.removeEventListener('resize', handleResize)
      }

      if (handleVisibilityChange) {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }

      ctx.revert()
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-ssp-darker overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover z-0" 
        />
        
        {/* Dark vignette overlay for cinematic feel & text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 z-10 pointer-events-none" />
        
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          {/* SECTION 1 */}
          <div className="sec-1-text absolute text-center text-ssp-white px-6 w-full max-w-4xl">
            <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm md:text-base mb-4 md:mb-6 drop-shadow-md">
              {copy.section1.eyebrow}
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 tracking-tight leading-[0.9] drop-shadow-2xl">
              {copy.section1.headlineMain}<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-ssp-accent to-ssp-accent-light">{copy.section1.headlineAccent}</span>
            </h1>
            <p className="text-lg md:text-2xl text-ssp-gray-light mt-6 max-w-2xl mx-auto drop-shadow-md">
              {copy.section1.body}
            </p>
          </div>
          
          {/* SECTION 2 */}
          <div className="sec-2-text absolute text-center text-ssp-white px-6 opacity-0 w-full max-w-4xl">
            <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm md:text-base mb-4 md:mb-6 drop-shadow-md">
              {copy.section2.eyebrow}
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 tracking-tight leading-[0.9] drop-shadow-2xl">
              {copy.section2.headlineMain}<br/>{copy.section2.headlineSecond}
            </h1>
            <p className="text-lg md:text-2xl text-ssp-gray-light mt-6 max-w-2xl mx-auto drop-shadow-md">
              {copy.section2.body}
            </p>
          </div>

          {/* SECTION 3 */}
          <div className="sec-3-text absolute text-center text-ssp-white px-6 opacity-0 w-full max-w-4xl">
            <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm md:text-base mb-4 md:mb-6 drop-shadow-md">
              {copy.section3.eyebrow}
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 tracking-tight leading-[0.9] drop-shadow-2xl">
              {copy.section3.headlineMain}<br/>{copy.section3.headlineSecond}
            </h1>
            <p className="text-lg md:text-2xl text-ssp-gray-light mt-6 max-w-2xl mx-auto drop-shadow-md">
              {copy.section3.body}
            </p>
          </div>

          {/* SECTION 4 */}
          <div className="sec-4-text absolute text-center text-ssp-white px-6 opacity-0 w-full max-w-4xl">
            <p className="text-ssp-accent tracking-[0.3em] uppercase text-sm md:text-base mb-4 md:mb-6 drop-shadow-md">
              {copy.section4.eyebrow}
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 tracking-tight leading-[0.9] drop-shadow-2xl">
              {copy.section4.headlineMain}<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-ssp-accent to-ssp-accent-light">{copy.section4.headlineAccent}</span>
            </h1>
            <p className="text-lg md:text-2xl text-ssp-gray-light mt-6 max-w-2xl mx-auto drop-shadow-md">
              {copy.section4.body}
            </p>
          </div>
        </div>
        
        {/* Optional Loading Indicator for the frames */}
        {!isLoaded && (
          <div className="absolute bottom-10 right-10 z-50 text-ssp-accent text-sm tracking-widest uppercase flex items-center gap-3">
             <div className="w-4 h-4 border-2 border-ssp-accent border-t-transparent rounded-full animate-spin" />
             {copy.loading}
          </div>
        )}
    </div>
  )
}
