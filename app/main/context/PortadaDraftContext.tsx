'use client'

import React, { createContext, useContext, useEffect, useState } from "react"
import { ArticleType } from "@/app/types/article"
import { LayoutInstance } from "../layoutCatalog"

// Estado del borrador de portada compartido entre la pestaña "Artículos" (ArticlesSorter)
// y la pestaña "Diseño de portada" (LayoutsSorter), para que el contador de
// notas-necesarias-vs-asignadas y la preview reflejen el orden actual de arrastre aunque
// todavía no se haya guardado. Vive un nivel arriba de ambas pestañas (en Portada.tsx).
export interface ArticleWithID extends Partial<ArticleType> {
  id: number
}

interface PortadaDraftContextValue {
  draftArticles: ArticleWithID[]
  setDraftArticles: React.Dispatch<React.SetStateAction<ArticleWithID[]>>
  draftLayouts: LayoutInstance[]
  setDraftLayouts: React.Dispatch<React.SetStateAction<LayoutInstance[]>>
}

const PortadaDraftContext = createContext<PortadaDraftContextValue | null>(null)

interface PortadaDraftProviderProps {
  initialArticles: ArticleWithID[]
  initialLayouts: LayoutInstance[]
  children: React.ReactNode
}

export const PortadaDraftProvider: React.FC<PortadaDraftProviderProps> = ({
  initialArticles,
  initialLayouts,
  children,
}) => {
  const [draftArticles, setDraftArticles] = useState<ArticleWithID[]>(initialArticles)
  const [draftLayouts, setDraftLayouts] = useState<LayoutInstance[]>(initialLayouts)

  // initialArticles/initialLayouts solo se usan para el mount inicial de useState --
  // sin estos efectos, un router.refresh() después de guardar (que trae el orden ya
  // persistido desde el server) no se reflejaba acá, y el draft viejo en memoria podía
  // seguir mostrando notas que ya se habían movido a "Orden actual" como si todavía
  // estuvieran en "Últimas notas" (ArticlesSorter las filtra comparando contra este draft).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setDraftArticles(initialArticles)
  }, [initialArticles])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setDraftLayouts(initialLayouts)
  }, [initialLayouts])

  return (
    <PortadaDraftContext.Provider value={{ draftArticles, setDraftArticles, draftLayouts, setDraftLayouts }}>
      {children}
    </PortadaDraftContext.Provider>
  )
}

export const usePortadaDraft = () => {
  const ctx = useContext(PortadaDraftContext)
  if (!ctx) throw new Error("usePortadaDraft debe usarse dentro de PortadaDraftProvider")
  return ctx
}
