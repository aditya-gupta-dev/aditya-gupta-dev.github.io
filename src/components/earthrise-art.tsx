import { useEffect, useRef, useState } from 'react'
import type { EarthriseFrame } from './earthrise-worker'

const CELL = 8
const RADII: Record<string, number> = { '·': 0.7, '•': 1.6, '●': 2.8 }
const FRAME_INTERVAL = 1000 / 15

export function EarthriseArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context) return

    const worker = new Worker(new URL('./earthrise-worker.ts', import.meta.url), { type: 'module' })
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const startedAt = performance.now()
    let animation = 0
    let previous: EarthriseFrame | undefined
    let pending = false
    let lastRequest = -Infinity

    function requestFrame(time: number) {
      pending = true
      worker.postMessage(time)
    }

    worker.onmessage = ({ data: frame }: MessageEvent<EarthriseFrame>) => {
      pending = false
      // Repaint changed cells only; the lunar terrain stays still.
      if (!previous) {
        context.fillStyle = frame.ground
        context.fillRect(0, 0, canvas.width, canvas.height)
      }

      for (let y = 0; y < frame.rows; y++) {
        for (let x = 0; x < frame.cols; x++) {
          const k = y * frame.cols + x
          const character = y * (frame.cols + 1) + x
          const dot = frame.characters[character]
          if (previous && dot === previous.characters[character] && frame.colors[k] === previous.colors[k]) continue

          if (previous) {
            context.fillStyle = frame.ground
            context.fillRect(x * CELL, y * CELL, CELL, CELL)
          }
          const radius = RADII[dot]
          if (!radius) continue
          context.fillStyle = frame.palette[frame.colors[k]]
          context.beginPath()
          context.arc((x + 0.5) * CELL, (y + 0.5) * CELL, radius, 0, Math.PI * 2)
          context.fill()
        }
      }

      previous = frame
      setStatus('ready')
    }

    worker.onerror = () => {
      cancelAnimationFrame(animation)
      worker.terminate()
      setStatus('error')
    }

    function tick(now: number) {
      if (!pending && now - lastRequest >= FRAME_INTERVAL) {
        requestFrame((now - startedAt) / 1000)
        lastRequest = now
      }
      animation = requestAnimationFrame(tick)
    }

    function updatePlayback() {
      cancelAnimationFrame(animation)
      if (document.hidden) return
      if (motion.matches) {
        requestFrame(0)
      } else {
        animation = requestAnimationFrame(tick)
      }
    }

    requestFrame(0)
    if (!motion.matches && !document.hidden) animation = requestAnimationFrame(tick)
    motion.addEventListener('change', updatePlayback)
    document.addEventListener('visibilitychange', updatePlayback)

    return () => {
      cancelAnimationFrame(animation)
      motion.removeEventListener('change', updatePlayback)
      document.removeEventListener('visibilitychange', updatePlayback)
      worker.terminate()
    }
  }, [])

  return (
    <figure className="relative aspect-2/1 w-full max-w-[min(64rem,calc((100svh-15rem)*2))]">
      <canvas
        ref={canvasRef}
        width={1600}
        height={800}
        role="img"
        aria-label="Earthrise: a rotating blue Earth above a cratered lunar horizon and a sky of twinkling stars"
        aria-busy={status === 'loading'}
        className="block aspect-2/1 w-full"
      >
        Earth rising above the Moon’s cratered surface.
      </canvas>
      {status !== 'ready' && (
        <p role="status" className="absolute inset-0 grid place-items-center px-4 text-center font-terminal text-xs text-terminal-foreground sm:text-sm">
          {status === 'error' ? 'Earthrise could not be rendered. Reload to try again.' : 'Rendering Earthrise…'}
        </p>
      )}
    </figure>
  )
}
