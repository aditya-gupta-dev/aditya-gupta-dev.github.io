export interface FrameOptions {
  paper?: boolean
  color?: Uint8Array
}

export type Frame = (time: number, options?: FrameOptions) => string

export interface Meta<Options> {
  name: string
  category: string
  note: string
  cols: number
  rows: number
  fps: number
  options: Options
  palette: string[]
}
