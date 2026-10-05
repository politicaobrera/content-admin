'use client'

import { useState } from "react"
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import Button from "@/app/components/Button"
import usePortada from "../hooks/usePortada"
import { LAYOUT_CATALOG, LayoutCatalogEntry } from "../layoutCatalog"
import DraggableLayout from "./DraggableLayout"
import DroppableColumn from "./DroppableColumn"
import LayoutSchematicPreview from "./LayoutSchematicPreview"

const CURRENT_COLUMN_ID = "sortable-layouts-current"
const AVAILABLE_COLUMN_ID = "sortable-layouts-available"

interface LayoutsSorterProps {
  current: string[]
  id: string
}

function resolveOrder(slugs: string[]): LayoutCatalogEntry[] {
  return slugs
    .map((slug) => LAYOUT_CATALOG.find((entry) => entry.slug === slug))
    .filter((entry): entry is LayoutCatalogEntry => Boolean(entry))
}

const LayoutsSorter = ({ current, id }: LayoutsSorterProps) => {
  const { saveLayouts } = usePortada()
  const router = useRouter()
  const [layouts, setLayouts] = useState<LayoutCatalogEntry[]>(resolveOrder(current))
  const [available, setAvailable] = useState<LayoutCatalogEntry[]>(
    LAYOUT_CATALOG.filter((entry) => !current.includes(entry.slug))
  )
  const [activeItem, setActiveItem] = useState<LayoutCatalogEntry | null>(null)

  const handleSave = async () => {
    saveLayouts(layouts.map((layout) => layout.slug), id).then((result) => {
      if (result.error) {
        toast.error(result.error.message)
      }
      if (result.data) {
        toast.success("Diseño de portada actualizado correctamente")
      }
    })
    router.refresh()
  }

  const handleDragStart = (event: any) => {
    const { active } = event
    const allItems = [...layouts, ...available]
    setActiveItem(allItems.find((item) => item.slug === active.id) ?? null)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) {
      setActiveItem(null)
      return
    }

    const activeList = layouts.find((item) => item.slug === active.id) ? 'current' : 'available'
    const overList = over.id === CURRENT_COLUMN_ID
      ? 'current'
      : over.id === AVAILABLE_COLUMN_ID
        ? 'available'
        : layouts.find((item) => item.slug === over.id) ? 'current' : 'available'

    if (activeList === overList) {
      if (activeList === 'current') {
        setLayouts((curr) => {
          const oldIndex = curr.findIndex((item) => item.slug === active.id)
          const newIndex = curr.findIndex((item) => item.slug === over.id)
          return arrayMove(curr, oldIndex, newIndex)
        })
      } else {
        setAvailable((curr) => {
          const oldIndex = curr.findIndex((item) => item.slug === active.id)
          const newIndex = curr.findIndex((item) => item.slug === over.id)
          return arrayMove(curr, oldIndex, newIndex)
        })
      }
    } else {
      if (activeList === 'current') {
        setAvailable((curr) => [
          layouts.find((item) => item.slug === active.id)!,
          ...curr,
        ])
        setLayouts((curr) => curr.filter((item) => item.slug !== active.id))
      } else {
        setLayouts((curr) => [
          available.find((item) => item.slug === active.id)!,
          ...curr,
        ])
        setAvailable((curr) => curr.filter((item) => item.slug !== active.id))
      }
    }
    setActiveItem(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-10">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <div className="flex flex-col flex-1">
            <div className="bg-gray-200 text-center border-gray-400 border-solid border-2 rounded-md">
              <h2 className="text-2xl font-bold">Orden actual</h2>
            </div>
            <DroppableColumn id={CURRENT_COLUMN_ID} className="min-h-[200px]">
              <SortableContext
                id={CURRENT_COLUMN_ID}
                items={layouts.map((layout) => layout.slug)}
                strategy={verticalListSortingStrategy}
              >
                {layouts.map((layout, idx) => (
                  <DraggableLayout key={layout.slug} layout={layout} idx={idx} />
                ))}
              </SortableContext>
            </DroppableColumn>
          </div>
          <div className="flex flex-col flex-1">
            <div className="bg-gray-200 text-center border-gray-400 border-solid border-2 rounded-md">
              <h2 className="text-2xl font-bold">Disponibles</h2>
            </div>
            <DroppableColumn id={AVAILABLE_COLUMN_ID} className="min-h-[200px]">
              <SortableContext
                id={AVAILABLE_COLUMN_ID}
                items={available.map((layout) => layout.slug)}
                strategy={verticalListSortingStrategy}
              >
                {available.map((layout, idx) => (
                  <DraggableLayout key={layout.slug} layout={layout} idx={idx} showIndex={false} />
                ))}
              </SortableContext>
            </DroppableColumn>
          </div>
          <DragOverlay>
            {activeItem ? (
              <div className="bg-white p-4 rounded-md shadow-md my-2 text-slate-950">
                <h1>{activeItem.label}</h1>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
        <div className="flex flex-col flex-1">
          <div className="bg-gray-200 text-center border-gray-400 border-solid border-2 rounded-md">
            <h2 className="text-2xl font-bold">Previsualización</h2>
          </div>
          <div className="flex flex-col gap-2 p-2 mt-1">
            {layouts.map((layout) => (
              <LayoutSchematicPreview key={layout.slug} slug={layout.slug} label={layout.label} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex align-middle justify-end">
        <Button onClick={handleSave}>Guardar Orden</Button>
      </div>
    </div>
  )
}

export default LayoutsSorter
