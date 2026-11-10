import { useEffect, useState } from "react"
import touchArticleEditingSession from "@/app/actions/data/articles/touchArticleEditingSession"
import getArticleEditingSession, { ArticleEditingSession } from "@/app/actions/data/articles/getArticleEditingSession"

const HEARTBEAT_INTERVAL_MS = 15 * 1000

// Mientras el editor de una nota está abierto, avisa que "estamos editando" (heartbeat)
// y consulta si hay otra persona editándola, para mostrar un aviso -- sin bloquear nada.
export default function useArticleEditingPresence(articleId: string) {
  const [otherEditor, setOtherEditor] = useState<ArticleEditingSession | null>(null)

  useEffect(() => {
    let cancelled = false

    const tick = async () => {
      touchArticleEditingSession(articleId)
      const { data } = await getArticleEditingSession(articleId)
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
