'use client'

import { useEffect, useState } from "react"
import getArticles from "@/app/actions/data/articles/getArticles"
import { ArticleStatus, ArticleType } from "@/app/types/article"
import { Section } from "@/app/types/sections"
import { TagType } from "@/app/types/tag"
import SectionSelector from "@/app/components/sections/SectionSelector"
import TagSelector from "@/app/components/tags/TagSelector"
import ImageThumb from "@/app/components/image/ImageThumb"
import useDebouncedValue from "@/app/hooks/useDebouncedValue"

interface ArticleSearchPanelProps {
  excludeArticleIds: number[]
  onAddArticle: (article: Partial<ArticleType>) => void
}

const MIN_TITLE_LENGTH = 2
// se pide bastante más de lo que se va a mostrar porque los resultados que ya están
// en "Orden actual"/"Últimas notas" se ocultan (dnd-kit necesita ids únicos entre ambas
// columnas) — en secciones muy activas, la mayoría de los últimos N ya están ahí
const SEARCH_PER_PAGE = '50'

const ArticleSearchPanel = ({ excludeArticleIds, onAddArticle }: ArticleSearchPanelProps) => {
  const [title, setTitle] = useState("")
  const [section, setSection] = useState<Section | null>(null)
  const [tags, setTags] = useState<TagType[]>([])
  const [results, setResults] = useState<Partial<ArticleType>[]>([])
  const [hiddenCount, setHiddenCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const debouncedTitle = useDebouncedValue(title)

  const hasFilter = debouncedTitle.trim().length >= MIN_TITLE_LENGTH || !!section || tags.length > 0

  useEffect(() => {
    if (!hasFilter) {
      setResults([])
      setHiddenCount(0)
      return
    }

    let cancelled = false
    setLoading(true)

    getArticles({
      ...(debouncedTitle.trim().length >= MIN_TITLE_LENGTH ? { title: debouncedTitle.trim() } : {}),
      ...(section ? { section: section._id } : {}),
      ...(tags.length > 0 ? { tags: tags.map(t => t._id) } : {}),
      status: ArticleStatus.Published,
      perPage: SEARCH_PER_PAGE,
    }).then(({ data, error }) => {
      if (cancelled) return
      if (error) {
        console.log("error al buscar articulos para portada", error)
      }
      const matches = data ?? []
      const visible = matches.filter(a => !excludeArticleIds.includes(a.articleId))
      setResults(visible)
      setHiddenCount(matches.length - visible.length)
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [debouncedTitle, section, tags, hasFilter, excludeArticleIds])

  return (
    <div className="flex flex-col gap-3 border-2 border-gray-400 rounded-md p-3">
      <h3 className="font-bold text-lg">Buscar nota para agregar</h3>
      <input
        type="text"
        placeholder="Buscar por título..."
        className="w-full border-2 p-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <SectionSelector currentSection={section} onChange={setSection} isClearable />
        <TagSelector currentTags={tags} onChange={setTags} showSearch/>
      </div>
      {loading && <p>Buscando...</p>}
      {!loading && hasFilter && results.length === 0 && hiddenCount === 0 && <p>Sin resultados</p>}
      {!loading && hasFilter && results.length === 0 && hiddenCount > 0 && (
        <p className="text-sm text-gray-500">
          {hiddenCount === 1 ? "La única nota encontrada ya" : `Las ${hiddenCount} notas encontradas ya`} está{hiddenCount === 1 ? '' : 'n'} en &quot;Orden actual&quot; o &quot;Últimas notas&quot;.
        </p>
      )}
      {!loading && hiddenCount > 0 && results.length > 0 && (
        <p className="text-sm text-gray-500">
          {hiddenCount} resultado{hiddenCount === 1 ? '' : 's'} más no se muestra{hiddenCount === 1 ? '' : 'n'} porque ya está{hiddenCount === 1 ? '' : 'n'} en &quot;Orden actual&quot; o &quot;Últimas notas&quot;.
        </p>
      )}
      {!loading && results.length > 0 && (
        <ul className="flex flex-col gap-1 max-h-64 overflow-scroll">
          {results.map(article => (
            <li
              key={article._id}
              className="flex items-center gap-2 border-2 border-black rounded-md p-1 cursor-pointer hover:bg-gray-100"
              onClick={() => onAddArticle(article)}
            >
              <ImageThumb image={article.image} />
              <span className="font-semibold">{article.title}</span>
              <span className="ml-auto text-sm text-gray-500">#{article.articleId}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ArticleSearchPanel
