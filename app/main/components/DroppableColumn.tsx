'use client'

import { useDroppable } from "@dnd-kit/core"
import clsx from "clsx"

interface DroppableColumnProps {
  id: string
  children: React.ReactNode
}

// Sin esto, una SortableContext vacía no tiene ningún nodo droppable adentro,
// así que dnd-kit nunca resuelve `over` para esa columna y no se puede soltar nada ahí.
function DroppableColumn({ id, children }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "border-dashed border-gray-700 border-2 p-2 w-auto mt-1 min-h-[200px]",
        isOver && "bg-gray-100"
      )}
    >
      {children}
    </div>
  )
}

export default DroppableColumn
