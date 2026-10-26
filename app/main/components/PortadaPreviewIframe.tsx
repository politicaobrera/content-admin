'use client'

import { useEffect, useRef, useState } from "react"
import Button from "@/app/components/Button"
import { LayoutInstance } from "../layoutCatalog"
import { usePortadaDraft } from "../context/PortadaDraftContext"
import ArticlesNeededBadge from "./ArticlesNeededBadge"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ""
const PREVIEW_PATH = "/preview-portada"

interface PortadaPreviewIframeProps {
  layouts: LayoutInstance[]
}

// El iframe (pesado) solo se monta al tocar "Previsualizar"; un cambio posterior en
// layouts/notas no la refresca solo, marca "desactualizada" hasta el próximo click.
const PortadaPreviewIframe = ({ layouts }: PortadaPreviewIframeProps) => {
  const { draftArticles } = usePortadaDraft()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [iframeReady, setIframeReady] = useState(false)
  const [isStale, setIsStale] = useState(false)

  const postDraft = () => {
    if (!SITE_URL) return
    iframeRef.current?.contentWindow?.postMessage(
      {
        source: "politicaobrera-admin-preview",
        layouts,
        articles: draftArticles,
      },
      SITE_URL,
    )
  }

  // se espera el handshake "politicaobrera-preview-ready" en vez de confiar en `load`
  // del iframe, que dispara antes de que React hidrate y registre el listener ahí
  useEffect(() => {
    if (!showPreview) return
    const onHandshake = (event: MessageEvent) => {
      if (SITE_URL && event.origin !== new URL(SITE_URL).origin) return
      if ((event.data as any)?.source !== "politicaobrera-preview-ready") return
      setIframeReady(true)
    }
    window.addEventListener("message", onHandshake)
    return () => window.removeEventListener("message", onHandshake)
  }, [showPreview])

  useEffect(() => {
    if (iframeReady) {
      postDraft()
      setIsStale(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeReady])

  useEffect(() => {
    if (showPreview) setIsStale(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layouts, draftArticles])

  const handleTogglePreview = () => {
    if (!showPreview) {
      setShowPreview(true)
      return
    }
    setIframeReady(false)
    if (iframeRef.current) iframeRef.current.src = `${SITE_URL}${PREVIEW_PATH}`
  }

  return (
    <div className="flex flex-col gap-2">
      <ArticlesNeededBadge />

      {!SITE_URL ? (
        <div className="p-3 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded-md">
          Falta configurar NEXT_PUBLIC_SITE_URL para mostrar la previsualización real.
        </div>
      ) : (
        <Button type="button" onClick={handleTogglePreview}>
          {!showPreview ? 'Previsualizar' : isStale ? 'Actualizar previsualización' : 'Previsualización al día'}
        </Button>
      )}

      {showPreview && SITE_URL && (
        <iframe
          ref={iframeRef}
          src={`${SITE_URL}${PREVIEW_PATH}`}
          title="Previsualización de portada"
          className="w-full border-2 border-gray-300 rounded-md bg-white"
          style={{ height: "80vh" }}
        />
      )}
    </div>
  )
}

export default PortadaPreviewIframe
