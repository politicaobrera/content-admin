import { useEffect, useState } from "react"
import getArticleEditingSession, { ArticleEditingSession } from "@/app/actions/data/articles/getArticleEditingSession"

const POLL_INTERVAL_MS = 20 * 1000

// Solo observa si alguien está editando el artículo (sin emitir heartbeat propio) --
// usado en la tabla para avisar antes de entrar al editor, a diferencia de
// useArticleEditingPresence que sí marca presencia porque se usa dentro del editor.
export default function useArticleEditingObserver(articleId: string) {
  const [editor, setEditor] = useState<ArticleEditingSession | null>(null)

  useEffect(() => {
    let cancelled = false

    const tick = async () => {
      const { data } = await getArticleEditingSession(articleId)
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
