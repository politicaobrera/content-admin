'use client'

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { LayoutCatalogEntry, LayoutInstance } from "../layoutCatalog"

interface DraggableLayoutProps {
  instance: LayoutInstance
  catalogEntry: LayoutCatalogEntry
  idx: number
  showIndex?: boolean
  onContextMenu?: (e: React.MouseEvent) => void
}

function DraggableLayout({ instance, catalogEntry, idx, showIndex = true, onContextMenu }: DraggableLayoutProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: instance.instanceId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const paramValue = instance.params && catalogEntry.params?.[0]
    ? instance.params[catalogEntry.params[0].key]
    : undefined

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onContextMenu={(e) => {
        e.preventDefault()
        onContextMenu?.(e)
      }}
      className="
        relative
        bg-white
        rounded-md
        shadow-md
        text-slate-950
        border-solid
        border-2
        flex
        items-center
        border-black
        my-1
        p-3
        gap-3
      "
    >
      {showIndex && (
        <div className="font-bold text-4xl w-10 flex flex-shrink-0 justify-center items-center">
          {idx + 1}
        </div>
      )}
      <div className="flex flex-col">
        <div className="font-bold text-md">{catalogEntry.label}</div>
        <div className="text-sm text-gray-600">{catalogEntry.articleCount} notas</div>
        {paramValue && (
          <div className="text-xs text-gray-500 italic">&quot;{paramValue}&quot;</div>
        )}
      </div>
    </div>
  )
}

export default DraggableLayout
