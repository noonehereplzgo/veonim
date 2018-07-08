import CreateWindowCanvas, { WindowCanvas } from '../core/window-canvas'
import CreateWindowGrid, { WindowGrid } from '../core/window-grid'
import CreateWindowNameplate from '../core/window-nameplate'
import { merge } from '../support/utils'
import { makel } from '../ui/vanilla'

interface WindowLayout {
  row: number
  col: number
  width: number
  height: number
}

interface WindowInfo extends WindowLayout {
  id: number
  gridId: number
}

export interface Window {
  grid: WindowGrid
  canvas: WindowCanvas
  element: HTMLElement
  getWindowSizeAndPosition(): WindowLayout
  setWindowInfo(info: WindowInfo): void
  setCssGridAttributes(attributes: string): void
  addOverlayElement(element: HTMLElement): void
  removeOverlayElement(element: HTMLElement): void
  destroy(): void
}

// container
//  - nameplate
//  - content
//    - overlay
//    - canvas

export default () => {
  const wininfo: WindowInfo = { id: 0, gridId: 0, row: 0, col: 0, width: 0, height: 0 }
  const grid = CreateWindowGrid()

  const container = makel({
    flexFlow: 'column',
    background: 'none',
  })

  const content = makel({
    display: 'flex'
  })

  const overlay = makel({
    display: 'flex',
    position: 'absolute',
  })

  const nameplate = CreateWindowNameplate()
  const canvas = CreateWindowCanvas()

  overlay.setAttribute('wat', 'overlay')
  content.setAttribute('wat', 'content')
  canvas.element.setAttribute('wat', 'canvas')
  nameplate.element.setAttribute('wat', 'nameplate')

  content.appendChild(overlay)
  content.appendChild(canvas.element)

  container.appendChild(nameplate.element)
  container.appendChild(content)

  const api = {
    get grid() { return grid },
    get canvas() { return canvas.api },
    get element() { return container },
  } as Window

  api.setWindowInfo = info => {
    container.id = `${info.id}`
    merge(wininfo, info)
    grid.resize(info.height, info.width)
    canvas.api.resize(info.height, info.width)
  }

  api.getWindowSizeAndPosition = () => {
    const { row, col, width, height } = wininfo
    return { row, col, width, height }
  }

  api.setCssGridAttributes = () => {
    // TODO: set window div element size/pos from css grid attrs
  }

  api.addOverlayElement = element => {
    overlay.appendChild(element)
    return () => overlay.removeChild(element)
  }

  api.removeOverlayElement = el => overlay.contains(el) && overlay.removeChild(el)

  api.destroy = () => {
    // TODO: destroy elements, cleanup, destroy canvas, components, anything else thanks etc.
  }

  return api
}