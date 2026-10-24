'use client'

import { useEffect, useRef, useState } from "react"
import Button from "@/app/components/Button"
import { ArticleType } from "@/app/types/article"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ""
const PREVIEW_PATH = "/preview-nota"

interface ArticlePreviewIframeProps {
  article: ArticleType
  // se espera ANTES de mostrar/actualizar la preview por primera vez de cada click --
  // en ArticleForm resuelve (sube si hace falta) la imagen principal pendiente, para
  // que la preview la muestre igual que haría el submit real
  onBeforeShow?: () => Promise<void>
}

// Mismo mecanismo que PortadaPreviewIframe.tsx: el iframe (pesado, carga el sitio
// público real) solo se monta al tocar "Previsualizar". Un cambio posterior en el
// formulario no refresca la preview sola -- queda marcada "desactualizada" hasta el
// próximo click, para no recargar el iframe en cada tecla.
const ArticlePreviewIframe = ({ article, onBeforeShow }: ArticlePreviewIframeProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [iframeReady, setIframeReady] = useState(false)
  const [isStale, setIsStale] = useState(false)
  const [resolving, setResolving] = useState(false)

  const hasSection = !!article.section?._id

  const postDraft = () => {
    if (!SITE_URL) return
    iframeRef.current?.contentWindow?.postMessage(
      {
        source: "politicaobrera-admin-preview-nota",
        article,
      },
      SITE_URL,
    )
  }

  // se espera el handshake "politicaobrera-preview-nota-ready" en vez de confiar en
  // `load` del iframe, que dispara antes de que React hidrate y registre el listener
  // ahí (ver mismo criterio en PortadaPreviewIframe.tsx)
  useEffect(() => {
    if (!showPreview) return
    const onHandshake = (event: MessageEvent) => {
      if (SITE_URL && event.origin !== new URL(SITE_URL).origin) return
      if ((event.data as any)?.source !== "politicaobrera-preview-nota-ready") return
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
  }, [article])

  const handleTogglePreview = async () => {
    setResolving(true)
    await onBeforeShow?.()
    setResolving(false)

    if (!showPreview) {
      setShowPreview(true)
      return
    }
    setIframeReady(false)
    if (iframeRef.current) iframeRef.current.src = `${SITE_URL}${PREVIEW_PATH}`
  }

  return (
    <div className="flex flex-col gap-2">
      {!SITE_URL ? (
        <div className="p-3 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded-md">
          Falta configurar NEXT_PUBLIC_SITE_URL para mostrar la previsualización real.
        </div>
      ) : !hasSection ? (
        <div
          className="p-3 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded-md"
          title="Elegí una sección para poder previsualizar la nota"
        >
          Elegí una sección para poder previsualizar.
        </div>
      ) : (
        <Button type="button" onClick={handleTogglePreview} disabled={resolving}>
          {resolving
            ? 'Preparando previsualización...'
            : !showPreview
              ? 'Previsualizar'
              : isStale
                ? 'Actualizar previsualización'
                : 'Previsualización al día'}
        </Button>
      )}

      {showPreview && SITE_URL && hasSection && (
        <iframe
          ref={iframeRef}
          src={`${SITE_URL}${PREVIEW_PATH}`}
          title="Previsualización de la nota"
          className="w-full border-2 border-gray-300 rounded-md bg-white"
          style={{ height: "80vh" }}
        />
      )}
    </div>
  )
}

export default ArticlePreviewIframe
