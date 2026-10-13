'use client'

import React, { createContext, useContext, useState } from "react"
import { ArticleType } from "@/app/types/article"

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
}

const PortadaDraftContext = createContext<PortadaDraftContextValue | null>(null)

export const PortadaDraftProvider: React.FC<{ initialArticles: ArticleWithID[]; children: React.ReactNode }> = ({
  initialArticles,
  children,
}) => {
  const [draftArticles, setDraftArticles] = useState<ArticleWithID[]>(initialArticles)

  return (
    <PortadaDraftContext.Provider value={{ draftArticles, setDraftArticles }}>
      {children}
    </PortadaDraftContext.Provider>
  )
}

export const usePortadaDraft = () => {
  const ctx = useContext(PortadaDraftContext)
  if (!ctx) throw new Error("usePortadaDraft debe usarse dentro de PortadaDraftProvider")
  return ctx
}
