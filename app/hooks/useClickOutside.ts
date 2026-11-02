import { RefObject, useEffect } from "react"

// cierra un dropdown/popover al clickear fuera de su contenedor -- "mousedown" en vez
// de "click" para que corra ANTES del click que podría abrir otro dropdown justo al
// lado (si fuera "click", el cierre del primero y la apertura del segundo competirían
// por el mismo evento)
export default function useClickOutside(ref: RefObject<HTMLElement | null>, onClickOutside: () => void) {
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside()
      }
    }
    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [ref, onClickOutside])
}
