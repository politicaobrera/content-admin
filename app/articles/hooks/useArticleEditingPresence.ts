import { useEffect, useState } from "react"
import type { ArticleEditingSession } from "@/app/types/articleEditingSession"

const HEARTBEAT_INTERVAL_MS = 15 * 1000

// Mientras el editor de una nota está abierto, avisa que "estamos editando" (heartbeat)
// y consulta si hay otra persona editándola, para mostrar un aviso -- sin bloquear nada.
// Usa fetch directo a un Route Handler (no Server Actions): una Server Action invocada
// desde un setInterval dispara una revalidación de Server Components en cada llamada,
// lo que re-renderizaba (y remontaba) todo el formulario cada 15s.
export default function useArticleEditingPresence(articleId: string) {
  const [otherEditor, setOtherEditor] = useState<ArticleEditingSession | null>(null)

  useEffect(() => {
    let cancelled = false

    const tick = async () => {
      fetch(`/api/articles/${articleId}/editing-session`, { method: 'POST' })
      const response = await fetch(`/api/articles/${articleId}/editing-session`)
      const data = response.ok ? await response.json() : null
      if (!cancelled) setOtherEditor(data ?? null)
    }

    tick()
    const interval = setInterval(tick, HEARTBEAT_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [articleId])

  return otherEditor
}
