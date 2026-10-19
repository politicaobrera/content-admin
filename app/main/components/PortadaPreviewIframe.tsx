'use client'

import { useEffect, useRef, useState } from "react"
import Button from "@/app/components/Button"
import { LAYOUT_CATALOG, LayoutInstance } from "../layoutCatalog"
import { usePortadaDraft } from "../context/PortadaDraftContext"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ""
const PREVIEW_PATH = "/preview-portada"

interface PortadaPreviewIframeProps {
  layouts: LayoutInstance[]
}

// El contador de notas (liviano, solo cuenta lo que ya está en memoria) se muestra
// siempre. El <iframe> con el sitio real es pesado — pedirle a Gatsby que cargue y
// renderice mientras el editor todavía está acomodando layouts/notas sería ruidoso y
// lento sin necesidad — así que solo se monta cuando el editor toca "Previsualizar", y
// una vez generada, un cambio posterior en layouts/notas no la actualiza solo: hay que
// volver a tocar el botón (que pasa a avisar "desactualizada") para refrescarla.
const PortadaPreviewIframe = ({ layouts }: PortadaPreviewIframeProps) => {
  const { draftArticles } = usePortadaDraft()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [iframeReady, setIframeReady] = useState(false)
  // true desde que se generó/actualizó la última preview hasta que layouts o notas
  // vuelven a cambiar — controla el aviso de "desactualizada" en el botón
  const [isStale, setIsStale] = useState(false)

  const needed = layouts.reduce((sum, instance) => {
    const catalogEntry = LAYOUT_CATALOG.find((entry) => entry.slug === instance.slug)
    return sum + (catalogEntry?.articleCount ?? 0)
  }, 0)
  const assigned = draftArticles.length

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

  // el evento `load` nativo del <iframe> dispara cuando el documento terminó de
  // cargar, lo que puede pasar ANTES de que React hidrate /preview-portada y su
  // useEffect llegue a registrar el listener de "message" — un postMessage mandado
  // en ese instante se pierde en silencio y la preview queda colgada. En vez de
  // confiar en `load`, se espera el handshake "politicaobrera-preview-ready" que esa
  // página manda apenas su listener queda activo (ver preview-portada.tsx).
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

  // apenas el iframe (recién montado o recargado) confirma que está listo, manda el
  // borrador una sola vez — no hay re-posteo automático por cambios posteriores
  useEffect(() => {
    if (iframeReady) {
      postDraft()
      setIsStale(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iframeReady])

  // marca la preview ya generada como desactualizada ante cualquier cambio posterior
  // de layouts/notas — no reenvía nada sola, solo informa en el botón
  useEffect(() => {
    if (showPreview) setIsStale(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layouts, draftArticles])

  const handleTogglePreview = () => {
    if (!showPreview) {
      setShowPreview(true)
      return
    }
    // ya está montado: forzar una recarga del iframe para volver a correr el handshake
    // y reenviar el borrador actual
    setIframeReady(false)
    if (iframeRef.current) iframeRef.current.src = `${SITE_URL}${PREVIEW_PATH}`
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
