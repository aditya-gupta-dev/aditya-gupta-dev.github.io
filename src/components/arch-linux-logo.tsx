import { useEffect, useRef } from 'react'
import archLinux, { meta } from '@/components/arch-linux'

const frame = archLinux()

export function ArchLinuxLogo() {
  const artRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animation = 0

    function start() {
      cancelAnimationFrame(animation)
      if (!artRef.current) return
      artRef.current.textContent = frame(0)
      if (motion.matches) return

      const startedAt = performance.now()
      let previousFrame = -1

      function draw(now: number) {
        const elapsed = (now - startedAt) / 1000
        const currentFrame = Math.floor(elapsed * meta.fps)
        if (currentFrame !== previousFrame && artRef.current) {
          artRef.current.textContent = frame(elapsed)
          previousFrame = currentFrame
        }
        animation = requestAnimationFrame(draw)
      }

      animation = requestAnimationFrame(draw)
    }

    start()
    motion.addEventListener('change', start)
    return () => {
      cancelAnimationFrame(animation)
      motion.removeEventListener('change', start)
    }
  }, [])

  return (
    <pre
      ref={artRef}
      role="img"
      aria-label="Arch Linux logo"
      className="m-0 w-fit select-none font-mono text-[clamp(0.25rem,min(2.25vw,2svh),0.875rem)] leading-none tracking-normal text-arch"
    >
      {frame(0)}
    </pre>
  )
}
