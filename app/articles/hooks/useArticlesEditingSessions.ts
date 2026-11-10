import { useEffect, useState } from "react"
import type { ArticleEditingSession } from "@/app/types/articleEditingSession"

const POLL_INTERVAL_MS = 20 * 1000

type SessionsByArticleId = Record<string, ArticleEditingSession | null>

// Un solo request (batch) por carga de tabla para saber quién está editando cada fila
// visible, en vez de un observer por fila -- con 50 filas por página, 50 requests
// individuales en paralelo cada 20s saturaban el servidor (ver conversación, causó 503s).
export default function useArticlesEditingSessions(articleIds: string[]) {
  const [sessions, setSessions] = useState<SessionsByArticleId>({})
  // clave estable para no re-disparar el efecto en cada render por un array con
  // el mismo contenido pero nueva referencia (misma razón que el fix del autosave)
  const idsKey = articleIds.join(",")

  useEffect(() => {
    if (!idsKey) {
      setSessions({})
      return
    }

    let cancelled = false

    const tick = async () => {
      const response = await fetch('/api/articles/editing-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleIds: idsKey.split(",") }),
      })
      const data = response.ok ? await response.json() : {}
      if (!cancelled) setSessions(data)
    }

    tick()
    const interval = setInterval(tick, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [idsKey])

  return sessions
}
