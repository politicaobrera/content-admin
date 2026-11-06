import { useCallback, useEffect, useRef, useState } from "react"
import { ArticleType } from "@/app/types/article"
import { Section } from "@/app/types/sections"
import { AuthorType } from "@/app/types/author"
import { TagType } from "@/app/types/tag"
import { ResourceType } from "@/app/types/resource"

export interface ArticleDraftFields {
  title: string
  volanta: string
  subhead: string
  content: string
  section: Section | null
  authors: AuthorType[]
  authorsDescriptions: string[]
  tags: TagType[]
  keyIdeas: string[]
  relatedArticles: Partial<ArticleType>[]
  relatedResources: Partial<ResourceType>[]
  status: boolean
}

interface StoredDraft {
  savedAt: string
  fields: ArticleDraftFields
}

const draftKey = (articleId: string) => `po-draft:article:${articleId}`

const readDraft = (articleId: string): StoredDraft | null => {
  try {
    const raw = localStorage.getItem(draftKey(articleId))
    if (!raw) return null
    return JSON.parse(raw) as StoredDraft
  } catch {
    return null
  }
}

// autosave puramente local: nada de esto pega al backend, es solo para
// sobrevivir un cierre de pestaña/crash accidental antes de apretar GUARDAR
export default function useArticleDraft(articleId: string, articleUpdatedAt?: string) {
  const [pendingDraft, setPendingDraft] = useState<StoredDraft | null>(null)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const checkedRef = useRef(false)

  useEffect(() => {
    if (checkedRef.current) return
    checkedRef.current = true

    const draft = readDraft(articleId)
    if (!draft) return

    // si el draft es más viejo que la última edición conocida del server,
    // alguien más (u otra pestaña) ya guardó algo más nuevo: no lo ofrecemos
    if (articleUpdatedAt && new Date(draft.savedAt) <= new Date(articleUpdatedAt)) {
      localStorage.removeItem(draftKey(articleId))
      return
    }

    setPendingDraft(draft)
  }, [articleId, articleUpdatedAt])

  const save = useCallback((fields: ArticleDraftFields) => {
    const draft: StoredDraft = { savedAt: new Date().toISOString(), fields }
    try {
      localStorage.setItem(draftKey(articleId), JSON.stringify(draft))
      setSavedAt(new Date(draft.savedAt))
    } catch {
      // localStorage lleno o deshabilitado (modo privado): el autosave
      // simplemente no persiste, no es un error que deba interrumpir al editor
    }
  }, [articleId])

  const discardDraft = useCallback(() => {
    try {
      localStorage.removeItem(draftKey(articleId))
    } catch {
      // no-op si localStorage no está disponible
    }
    setPendingDraft(null)
  }, [articleId])

  const clearAfterSave = useCallback(() => {
    discardDraft()
    setSavedAt(null)
  }, [discardDraft])

  return { pendingDraft, savedAt, save, discardDraft, clearAfterSave }
}
