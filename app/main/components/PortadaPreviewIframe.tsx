'use client'

import { useEffect, useRef, useState } from "react"
import { LayoutCatalogEntry } from "../layoutCatalog"
import { usePortadaDraft } from "../context/PortadaDraftContext"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ""
const PREVIEW_PATH = "/preview-portada"

interface PortadaPreviewIframeProps {
  layouts: LayoutCatalogEntry[]
}

// Manda el borrador actual (layouts elegidos + notas, en el orden en que están ahora
// mismo en el admin, sin necesidad de guardar) a la página /preview-portada del sitio
// público vía postMessage — esa página la renderiza ahí dentro con los componentes
// reales de Gatsby (ArticleCard, HeroGridLayout, etc.), así la previsualización es
// fiel a lo que vería un lector real, sin duplicar ningún estilo acá en el admin.
const PortadaPreviewIframe = ({ layouts }: PortadaPreviewIframeProps) => {
  const { draftArticles } = usePortadaDraft()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeReady, setIframeReady] = useState(false)

  const needed = layouts.reduce((sum, layout) => sum + layout.articleCount, 0)
  const assigned = draftArticles.length

  const postDraft = () => {
    if (!SITE_URL) return
    iframeRef.current?.contentWindow?.postMessage(
      {
        source: "politicaobrera-admin-preview",
        layouts: layouts.map((l) => l.slug),
        articles: draftArticles,
      },
      SITE_URL,
    )
  }

  // reenvía el borrador cada vez que cambia el orden de layouts o de notas, no solo al
  // cargar — así la preview se actualiza en vivo mientras se sigue arrastrando
  useEffect(() => {
    if (iframeReady) postDraft()
  }, [iframeReady, layouts, draftArticles])

  if (!SITE_URL) {
    return (
      <div className="p-3 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded-md">
        Falta configurar NEXT_PUBLIC_SITE_URL para mostrar la previsualización real.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`p-2 rounded-md text-sm font-semibold text-center ${
          assigned >= needed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {assigned} de {needed} notas necesarias asignadas
        {assigned < needed && ` (faltan ${needed - assigned})`}
        {assigned > needed && ` (sobran ${assigned - needed}, no se usarán)`}
      </div>
      <iframe
        ref={iframeRef}
        src={`${SITE_URL}${PREVIEW_PATH}`}
        onLoad={() => setIframeReady(true)}
        title="Previsualización de portada"
        className="w-full border-2 border-gray-300 rounded-md bg-white"
        style={{ height: "80vh" }}
      />
    </div>
  )
}

export default PortadaPreviewIframe
