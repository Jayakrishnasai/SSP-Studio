'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

export default function CamFramesSequence() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')

    // Standard Full HD resolution for high quality rendering
    canvas.width = 1920
    canvas.height = 1080

    const frameCount = 279
    const currentFrame = index => (
      `/CamFrames/frame_${String(index).padStart(3, '0')}_delay-0.055s.png`
    )

    const images = []
    const frames = { frame: 0 }
    
    let imagesLoaded = 0

    let ctx = gsap.context(() => {
      for (let i = 0; i < frameCount; i++) {
        const img = new Image()
        img.src = currentFrame(i)
        img.onload = () => {
          imagesLoaded++
          if (imagesLoaded === 1) {
            render() // render the very first frame immediately
          }
          if (imagesLoaded === frameCount) {
            setIsLoaded(true)
          }
        }
        images.push(img)
      }

      function render() {
        context.clearRect(0, 0, canvas.width, canvas.height)
        const img = images[frames.frame]
        if (img && img.complete) {
           const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
           const x = (canvas.width / 2) - (img.width / 2) * scale
           const y = (canvas.height / 2) - (img.height / 2) * scale
           context.drawImage(img, x, y, img.width * scale, img.height * scale)
        }
      }

      // Master timeline
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
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        onUpdate: render,
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

    return () => ctx.revert()
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
              Cinematic Experience
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 tracking-tight leading-[0.9] drop-shadow-2xl">
              Every Frame<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-ssp-accent to-ssp-accent-light">Tells A Story</span>
            </h1>
            <p className="text-lg md:text-2xl text-ssp-gray-light mt-6 max-w-2xl mx-auto drop-shadow-md">
              Scroll to explore the visual journey.
            </p>
          </div>
          
          {/* SECTION 2 */}
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

          {/* SECTION 3 */}
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

          {/* SECTION 4 */}
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
        
        {/* Optional Loading Indicator for the frames */}
        {!isLoaded && (
          <div className="absolute bottom-10 right-10 z-50 text-ssp-accent text-sm tracking-widest uppercase flex items-center gap-3">
             <div className="w-4 h-4 border-2 border-ssp-accent border-t-transparent rounded-full animate-spin" />
             Loading Sequence...
          </div>
        )}
    </div>
  )
}
