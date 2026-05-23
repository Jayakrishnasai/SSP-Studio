export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const TOTAL_FRAMES = 279

function pad(i) {
  return String(i).padStart(3, '0')
}

export function framePath(i) {
  return `/CamFrames/frame_${pad(i)}_delay-0.055s.png`
}

export function sampleFrames(count = 28) {
  const step = Math.max(1, Math.floor(TOTAL_FRAMES / count))
  return Array.from({ length: count }, (_, idx) => {
    const i = Math.min(idx * step, TOTAL_FRAMES - 1)
    return framePath(i)
  })
}

export function frameRange(start, end) {
  return Array.from({ length: end - start + 1 }, (_, idx) => framePath(start + idx))
}
