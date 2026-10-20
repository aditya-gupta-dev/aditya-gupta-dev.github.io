import earthrise, { meta } from './earthrise'
import type { Frame } from '@/types'

export interface EarthriseFrame {
  characters: string
  colors: Uint8Array
  cols: number
  rows: number
  palette: string[]
  ground: string
}

let frame: Frame | undefined
const colors = new Uint8Array(meta.cols * meta.rows)

self.onmessage = ({ data: time }: MessageEvent<number>) => {
  frame ??= earthrise()
  const result: EarthriseFrame = {
    characters: frame(time, { color: colors }),
    colors,
    cols: meta.cols,
    rows: meta.rows,
    palette: meta.palette,
    ground: meta.ground,
  }
  self.postMessage(result)
}
