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

const ArticleSearchPanel = ({ excludeArticleIds, onAddArticle }: ArticleSearchPanelProps) => {
  const [title, setTitle] = useState("")
  const [section, setSection] = useState<Section | null>(null)
  const [tags, setTags] = useState<TagType[]>([])
  const [results, setResults] = useState<Partial<ArticleType>[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedTitle = useDebouncedValue(title)

  const hasFilter = debouncedTitle.trim().length >= MIN_TITLE_LENGTH || !!section || tags.length > 0

  useEffect(() => {
    if (!hasFilter) {
      setResults([])
      return
    }

    let cancelled = false
    setLoading(true)

    getArticles({
      ...(debouncedTitle.trim().length >= MIN_TITLE_LENGTH ? { title: debouncedTitle.trim() } : {}),
      ...(section ? { section: section._id } : {}),
      ...(tags.length > 0 ? { tags: tags.map(t => t._id) } : {}),
      status: ArticleStatus.Published,
      perPage: '20',
    }).then(({ data, error }) => {
      if (cancelled) return
      if (error) {
        console.log("error al buscar articulos para portada", error)
      }
      setResults((data ?? []).filter(a => !excludeArticleIds.includes(a.articleId)))
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
      <div className="flex gap-6 flex-wrap items-start">
        <div className="min-w-[220px]">
          <SectionSelector currentSection={section} onChange={setSection} />
        </div>
        <TagSelector currentTags={tags} onChange={setTags} />
      </div>
      {loading && <p>Buscando...</p>}
      {!loading && hasFilter && results.length === 0 && <p>Sin resultados</p>}
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
