'use client'

import { useMemo, useState } from "react"
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
import {
  LAYOUT_CATALOG,
  LayoutCatalogEntry,
  LayoutInstance,
  createLayoutInstanceId,
  normalizeLayoutInstances,
} from "../layoutCatalog"
import DraggableLayout from "./DraggableLayout"
import DroppableColumn from "./DroppableColumn"
import LayoutSchematicPreview from "./LayoutSchematicPreview"
import PortadaPreviewIframe from "./PortadaPreviewIframe"
import LayoutContextMenu from "./LayoutContextMenu"

const CURRENT_COLUMN_ID = "sortable-layouts-current"
const AVAILABLE_COLUMN_ID = "sortable-layouts-available"

interface LayoutsSorterProps {
  current: unknown[]
  id: string
}

function resolveCatalogEntry(slug: string): LayoutCatalogEntry | undefined {
  return LAYOUT_CATALOG.find((entry) => entry.slug === slug)
}

// las marcadas `repeatable` quedan disponibles aunque ya haya una instancia en uso
function resolveAvailable(currentSlugs: string[]): LayoutCatalogEntry[] {
  return LAYOUT_CATALOG.filter((entry) => entry.repeatable || !currentSlugs.includes(entry.slug))
}

interface ContextMenuState {
  instanceId: string
  anchor: { x: number; y: number }
}

const LayoutsSorter = ({ current, id }: LayoutsSorterProps) => {
  const { saveLayouts } = usePortada()
  const router = useRouter()
  const [layouts, setLayouts] = useState<LayoutInstance[]>(normalizeLayoutInstances(current))
  // derivado de `layouts`, no estado propio, para no tener que sincronizarlo a mano
  const available = useMemo(() => resolveAvailable(layouts.map((l) => l.slug)), [layouts])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)

  const handleSave = async () => {
    saveLayouts(layouts, id).then((result) => {
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
    setActiveId(active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const activeInCurrent = layouts.find((item) => item.instanceId === active.id)
    const activeList = activeInCurrent ? 'current' : 'available'
    const overList = over.id === CURRENT_COLUMN_ID
      ? 'current'
      : over.id === AVAILABLE_COLUMN_ID
        ? 'available'
        : layouts.find((item) => item.instanceId === over.id) ? 'current' : 'available'

    if (activeList === 'current' && overList === 'current') {
      setLayouts((curr) => {
        const oldIndex = curr.findIndex((item) => item.instanceId === active.id)
        const newIndex = curr.findIndex((item) => item.instanceId === over.id)
        return arrayMove(curr, oldIndex, newIndex)
      })
      return
    }

    if (activeList === 'available' && overList === 'available') {
      return
    }

    if (activeList === 'available' && overList === 'current') {
      const catalogEntry = LAYOUT_CATALOG.find((entry) => entry.slug === active.id)
      if (!catalogEntry) return
      const newInstance: LayoutInstance = { slug: catalogEntry.slug, instanceId: createLayoutInstanceId(catalogEntry.slug) }
      setLayouts((curr) => {
        const overIndex = curr.findIndex((item) => item.instanceId === over.id)
        if (overIndex === -1) return [newInstance, ...curr]
        const next = [...curr]
        next.splice(overIndex, 0, newInstance)
        return next
      })
      return
    }

    if (activeList === 'current' && overList === 'available') {
      setLayouts((curr) => curr.filter((item) => item.instanceId !== active.id))
    }
  }

  const handleRemoveInstance = (instanceId: string) => {
    setLayouts((curr) => curr.filter((item) => item.instanceId !== instanceId))
  }

  const handleSaveInstanceParams = (instanceId: string, params: Record<string, string>) => {
    setLayouts((curr) => curr.map((item) => item.instanceId === instanceId ? { ...item, params } : item))
  }

  const activeItem = activeId
    ? layouts.find((l) => l.instanceId === activeId)
      ? resolveCatalogEntry(layouts.find((l) => l.instanceId === activeId)!.slug)
      : resolveCatalogEntry(activeId)
    : null

  const contextMenuInstance = contextMenu ? layouts.find((l) => l.instanceId === contextMenu.instanceId) : null
  const contextMenuCatalogEntry = contextMenuInstance ? resolveCatalogEntry(contextMenuInstance.slug) : null

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
                items={layouts.map((layout) => layout.instanceId)}
                strategy={verticalListSortingStrategy}
              >
                {layouts.map((instance, idx) => {
                  const catalogEntry = resolveCatalogEntry(instance.slug)
                  if (!catalogEntry) return null
                  return (
                    <DraggableLayout
                      key={instance.instanceId}
                      instance={instance}
                      catalogEntry={catalogEntry}
                      idx={idx}
                      onContextMenu={(e) => setContextMenu({ instanceId: instance.instanceId, anchor: { x: e.clientX, y: e.clientY } })}
                    />
                  )
                })}
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
                  <DraggableLayout
                    key={layout.slug}
                    instance={{ slug: layout.slug, instanceId: layout.slug }}
                    catalogEntry={layout}
                    idx={idx}
                    showIndex={false}
                  />
                ))}
              </SortableContext>
            </DroppableColumn>
            {available.some((l) => l.repeatable) && (
              <p className="text-xs text-gray-500 mt-1 px-1">
                Los layouts marcados como repetibles (ej. &quot;Al minuto&quot;) se pueden arrastrar varias veces.
              </p>
            )}
          </div>
          <DragOverlay>
            {activeItem ? (
              <div className="bg-white p-4 rounded-md shadow-md my-2 text-slate-950 border-2 border-black">
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
            {layouts.map((instance) => {
              const catalogEntry = resolveCatalogEntry(instance.slug)
              if (!catalogEntry) return null
              return (
                <LayoutSchematicPreview key={instance.instanceId} slug={catalogEntry.slug} label={catalogEntry.label} />
              )
            })}
          </div>
        </div>
      </div>
      <div className="flex align-middle justify-end">
        <Button onClick={handleSave}>Guardar Orden</Button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="bg-gray-200 text-center border-gray-400 border-solid border-2 rounded-md">
          <h2 className="text-2xl font-bold">Previsualización real</h2>
        </div>
        <PortadaPreviewIframe layouts={layouts} />
      </div>
      {contextMenu && contextMenuCatalogEntry && (
        <LayoutContextMenu
          catalogEntry={contextMenuCatalogEntry}
          anchor={contextMenu.anchor}
          currentParams={contextMenuInstance?.params}
          onClose={() => setContextMenu(null)}
          onRemove={() => handleRemoveInstance(contextMenu.instanceId)}
          onSaveParams={(params) => handleSaveInstanceParams(contextMenu.instanceId, params)}
        />
      )}
    </div>
  )
}

export default LayoutsSorter
