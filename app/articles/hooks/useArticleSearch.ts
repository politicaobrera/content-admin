import { useEffect, useState } from "react"
import getArticles from "@/app/actions/data/articles/getArticles"
import { ArticleStatus, ArticleType } from "@/app/types/article"
import { Section } from "@/app/types/sections"
import { AuthorType } from "@/app/types/author"
import { TagType } from "@/app/types/tag"
import useDebouncedValue from "@/app/hooks/useDebouncedValue"

const MIN_TITLE_LENGTH = 2
// cuando el buscador recibe foco sin ningún filtro activo, se muestran las últimas
// notas -- lo más común es querer vincular una nota recién creada
const RECENT_RESULTS_COUNT = 5

interface UseArticleSearchOptions {
  // una nota no puede vincularse a sí misma como relacionada -- se excluye de los
  // resultados cuando se pasa (no aplica en IssueArticleSelector/CampaignLookupPanel,
  // que no editan "la nota en sí" sino una entidad distinta que LINKEA notas)
  excludeArticleId?: string
}

// Lógica de búsqueda de notas compartida por ContentLookupPanel, CampaignLookupPanel e
// IssueArticleSelector -- título + sección + autor + tag, con debounce y "últimas
// notas" al enfocar el input sin filtro activo. Cada lugar sigue manejando su propia
// lista de "ya vinculados" y el render de resultados (difieren: miniatura, botón
// "insertar en el cuerpo", múltiples entidades además de notas, etc.) -- esto solo
// unifica la parte 100% idéntica: buscar notas publicadas con estos 4 filtros.
export default function useArticleSearch({ excludeArticleId }: UseArticleSearchOptions = {}) {
  const [title, setTitle] = useState("")
  const [section, setSection] = useState<Section | null>(null)
  const [author, setAuthor] = useState<AuthorType | null>(null)
  const [tags, setTags] = useState<TagType[]>([])
  const [results, setResults] = useState<ArticleType[]>([])
  const [loading, setLoading] = useState(false)
  const [showingRecent, setShowingRecent] = useState(false)
  const debouncedTitle = useDebouncedValue(title)

  const hasFilter = debouncedTitle.trim().length >= MIN_TITLE_LENGTH || !!section || !!author || tags.length > 0

  useEffect(() => {
    if (!hasFilter) {
      // sin filtro: no se pisa la lista de "recientes" que haya quedado cargada por
      // el onFocus del input (ver handleFocus) -- esa es la única forma de tener
      // resultados sin ningún filtro activo
      return
    }

    setShowingRecent(false)
    let cancelled = false
    setLoading(true)

    const params = {
      ...(debouncedTitle.trim().length >= MIN_TITLE_LENGTH ? { title: debouncedTitle.trim() } : {}),
      ...(section ? { section: section._id } : {}),
      ...(author ? { authors: author._id } : {}),
      ...(tags.length > 0 ? { tags: tags.map(t => t._id) } : {}),
      perPage: '20',
    }

    // no se puede vincular una nota que todavía no está publicada
    getArticles({ ...params, status: ArticleStatus.Published }).then(({ data, error }) => {
      if (error) console.log("error al buscar notas", error)
      if (cancelled) return
      const filtered = excludeArticleId ? (data ?? []).filter((item) => item._id !== excludeArticleId) : (data ?? [])
      setResults(filtered)
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [debouncedTitle, section, author, tags, excludeArticleId, hasFilter])

  const handleFocus = () => {
    if (hasFilter) return
    setShowingRecent(true)
    setLoading(true)
    getArticles({ perPage: String(RECENT_RESULTS_COUNT), sortField: 'articleId', sortOrder: 'desc', status: ArticleStatus.Published }).then(({ data, error }) => {
      if (error) console.log("error al obtener notas recientes", error)
      const filtered = excludeArticleId ? (data ?? []).filter((item) => item._id !== excludeArticleId) : (data ?? [])
      setResults(filtered)
      setLoading(false)
    })
  }

  const reset = () => {
    setTitle("")
    setResults([])
    setShowingRecent(false)
  }

  return {
    state: { title, section, author, tags, results, loading, showingRecent, hasFilter },
    actions: { setTitle, setSection, setAuthor, setTags, handleFocus, reset },
  }
}
