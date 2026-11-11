'use client'

import { useEffect, useRef } from "react"

interface ArticleContextMenuProps {
  anchor: { x: number; y: number }
  articleId: number | string
  onClose: () => void
  onOpenArticle: () => void
  onMoveToTop: () => void
  onMoveToBottom: () => void
}

// Mismo propósito que soltar una nota arrastrándola arriba/abajo de todo en una lista
// larga (hoy hasta 100+ notas, ver conversación), pero sin tener que scrollear: soltarla
// mal un pixel de más la manda al fondo de la lista entera, y subirla a mano de a una
// posición es tedioso. Mismo patrón que LayoutContextMenu (ver ese archivo).
const ArticleContextMenu = ({ anchor, onClose, onOpenArticle, onMoveToTop, onMoveToBottom }: ArticleContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose()
    }
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("mousedown", onClickOutside)
    document.addEventListener("keydown", onEscape)
    return () => {
      document.removeEventListener("mousedown", onClickOutside)
      document.removeEventListener("keydown", onEscape)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      style={{ top: anchor.y, left: anchor.x }}
      className="fixed z-50 min-w-[220px] rounded-md border-2 border-black bg-white shadow-lg text-slate-950"
    >
      <div className="flex flex-col py-1">
        <button
          type="button"
          className="px-4 py-2 text-left text-sm hover:bg-gray-100"
          onClick={() => { onOpenArticle(); onClose() }}
        >
          Abrir nota
        </button>
        <button
          type="button"
          className="px-4 py-2 text-left text-sm hover:bg-gray-100"
          onClick={() => { onMoveToTop(); onClose() }}
        >
          Mandar al principio
        </button>
        <button
          type="button"
          className="px-4 py-2 text-left text-sm hover:bg-gray-100"
          onClick={() => { onMoveToBottom(); onClose() }}
        >
          Mandar al final
        </button>
      </div>
    </div>
  )
}

export default ArticleContextMenu
