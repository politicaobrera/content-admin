'use client'

import { LAYOUT_CATALOG } from "../layoutCatalog"
import { usePortadaDraft } from "../context/PortadaDraftContext"

// Mismo contador en ambas pestañas de portada (Artículos y Diseño de portada), leído
// directo del draft compartido (PortadaDraftContext) para que no haga falta guardar
// para ver si ya hay suficientes notas asignadas para los layouts elegidos.
const ArticlesNeededBadge = () => {
  const { draftArticles, draftLayouts } = usePortadaDraft()

  const needed = draftLayouts.reduce((sum, instance) => {
    const catalogEntry = LAYOUT_CATALOG.find((entry) => entry.slug === instance.slug)
    return sum + (catalogEntry?.articleCount ?? 0)
  }, 0)
  const assigned = draftArticles.length

  return (
    <div
      className={`p-2 rounded-md text-sm font-semibold text-center ${
        assigned >= needed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {assigned} de {needed} notas necesarias asignadas
      {assigned < needed && ` (faltan ${needed - assigned})`}
      {assigned > needed && ` (sobran ${assigned - needed}, no se usarán)`}
    </div>
  )
}

export default ArticlesNeededBadge
