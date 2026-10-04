'use client'

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { LayoutCatalogEntry } from "../layoutCatalog"

interface DraggableLayoutProps {
  layout: LayoutCatalogEntry
  idx: number
  showIndex?: boolean
}

function DraggableLayout({ layout, idx, showIndex = true }: DraggableLayoutProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: layout.slug })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
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
        <div className="font-bold text-md">{layout.label}</div>
        <div className="text-sm text-gray-600">{layout.articleCount} notas</div>
      </div>
    </div>
  )
}

export default DraggableLayout
