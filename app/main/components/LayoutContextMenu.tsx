'use client'

import { useEffect, useRef, useState } from "react"
import { LayoutCatalogEntry } from "../layoutCatalog"

interface LayoutContextMenuProps {
  catalogEntry: LayoutCatalogEntry
  anchor: { x: number; y: number }
  currentParams?: Record<string, string>
  onClose: () => void
  onRemove: () => void
  onSaveParams: (params: Record<string, string>) => void
}

// Menú contextual (click derecho) de una instancia de layout en "Orden actual": permite
// quitarla de la portada, o — si el layout del catálogo declara `params` — editar los
// valores de esta instancia puntual (ej. el título del kicker de "Al minuto").
const LayoutContextMenu = ({ catalogEntry, anchor, currentParams, onClose, onRemove, onSaveParams }: LayoutContextMenuProps) => {
  const [editingParams, setEditingParams] = useState(false)
  const [draftParams, setDraftParams] = useState<Record<string, string>>(currentParams ?? {})
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

  const hasParams = (catalogEntry.params?.length ?? 0) > 0

  return (
    <div
      ref={menuRef}
      style={{ top: anchor.y, left: anchor.x }}
      className="fixed z-50 min-w-[220px] rounded-md border-2 border-black bg-white shadow-lg text-slate-950"
    >
      {!editingParams ? (
        <div className="flex flex-col py-1">
          {hasParams && (
            <button
              type="button"
              className="px-4 py-2 text-left text-sm hover:bg-gray-100"
              onClick={() => setEditingParams(true)}
            >
              Asignar valor
            </button>
          )}
          <button
            type="button"
            className="px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
            onClick={() => {
              onRemove()
              onClose()
            }}
          >
            Eliminar de la lista
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 p-3">
          {catalogEntry.params!.map((param) => (
            <div key={param.key} className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">{param.label}</label>
              <input
                autoFocus
                type="text"
                placeholder={param.placeholder}
                value={draftParams[param.key] ?? ""}
                onChange={(e) => setDraftParams((prev) => ({ ...prev, [param.key]: e.target.value }))}
                className="p-1.5 border-2 border-gray-300 rounded text-sm"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              className="px-3 py-1 text-sm rounded border-2 border-gray-300"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="px-3 py-1 text-sm rounded bg-gray-900 text-white"
              onClick={() => {
                onSaveParams(draftParams)
                onClose()
              }}
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LayoutContextMenu
