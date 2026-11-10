import { useEffect, useState } from "react"
import type { ArticleEditingSession } from "@/app/types/articleEditingSession"

const POLL_INTERVAL_MS = 20 * 1000

// Solo observa si alguien está editando el artículo (sin emitir heartbeat propio) --
// usado en la tabla para avisar antes de entrar al editor, a diferencia de
// useArticleEditingPresence que sí marca presencia porque se usa dentro del editor.
// Mismo motivo que ese hook para usar fetch directo en vez de una Server Action: evitar
// que el polling periódico dispare una revalidación de Server Components.
export default function useArticleEditingObserver(articleId: string) {
  const [editor, setEditor] = useState<ArticleEditingSession | null>(null)

  useEffect(() => {
    let cancelled = false

    const tick = async () => {
      const response = await fetch(`/api/articles/${articleId}/editing-session`)
      const data = response.ok ? await response.json() : null
      if (!cancelled) setEditor(data ?? null)
    }

    tick()
    const interval = setInterval(tick, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [articleId])

  return editor
}
