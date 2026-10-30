'use client'

import { useContext, useEffect, useState } from "react"
import getArticles from "@/app/actions/data/articles/getArticles"
import { ArticleStatus, ArticleType } from "@/app/types/article"
import SectionsContext from "@/app/context/SectionsContext"
import { OptionType } from "@/app/types/select"
import ImageThumb from "@/app/components/image/ImageThumb"
import useDebouncedValue from "@/app/hooks/useDebouncedValue"
import useTag from "@/app/tags/hooks/useTag"
import useAuthor from "@/app/authors/hooks/useAuthor"
import FilterBar, { FilterField } from "@/app/components/table/FilterBar"

interface ArticleSearchPanelProps {
  excludeArticleIds: number[]
  onAddArticle: (article: Partial<ArticleType>) => void
}

const MIN_TITLE_LENGTH = 2
// se pide bastante más de lo que se va a mostrar porque los resultados que ya están
// en "Orden actual"/"Últimas notas" se ocultan (dnd-kit necesita ids únicos entre ambas
// columnas) — en secciones muy activas, la mayoría de los últimos N ya están ahí
const SEARCH_PER_PAGE = '50'

const EMPTY_FILTERS: Record<string, any> = { title: '', articleId: '', section: '', tags: [], authors: [] }

const ArticleSearchPanel = ({ excludeArticleIds, onAddArticle }: ArticleSearchPanelProps) => {
  const { sections } = useContext(SectionsContext)
  const { searchByName: searchTags } = useTag()
  const { search: searchAuthors } = useAuthor()
  const [filters, setFilters] = useState<Record<string, any>>(EMPTY_FILTERS)
  const [results, setResults] = useState<Partial<ArticleType>[]>([])
  const [hiddenCount, setHiddenCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const debouncedTitle = useDebouncedValue(filters.title)
  const debouncedArticleId = useDebouncedValue(filters.articleId)

  const sectionOptions = sections.map((sec) => ({ value: sec._id, label: sec.name }))

  const hasFilter = debouncedTitle.trim().length >= MIN_TITLE_LENGTH || !!debouncedArticleId || !!filters.section || filters.tags.length > 0 || filters.authors.length > 0

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
      ...(debouncedArticleId ? { articleId: debouncedArticleId } : {}),
      ...(filters.section ? { section: filters.section } : {}),
      ...(filters.tags.length > 0 ? { tags: filters.tags } : {}),
      ...(filters.authors.length > 0 ? { authors: filters.authors } : {}),
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
  }, [debouncedTitle, debouncedArticleId, filters.section, filters.tags, filters.authors, hasFilter, excludeArticleIds])

  const handleFilterChange = (name: string, value: any) => {
    setFilters((curr) => ({ ...curr, [name]: value }))
  }

  const handleClearFilters = () => setFilters(EMPTY_FILTERS)

  const filterFields: FilterField[] = [
    { type: 'text', name: 'title', label: 'Título', placeholder: 'Buscar por título...' },
    { type: 'text', name: 'articleId', label: 'ID', placeholder: 'Buscar por ID...', numeric: true },
    { type: 'select', name: 'section', label: 'Sección', options: sectionOptions, placeholder: 'Todas las secciones' },
    {
      type: 'asyncMultiSelect',
      name: 'tags',
      label: 'Tags',
      placeholder: 'Buscar tags...',
      loadOptions: async (query: string): Promise<OptionType[]> => {
        if (query.length < 2) return []
        const { data } = await searchTags(query)
        return (data || []).map((tag: any) => ({ value: tag._id, label: tag.name }))
      },
    },
    {
      type: 'asyncMultiSelect',
      name: 'authors',
      label: 'Autores',
      placeholder: 'Buscar autores...',
      loadOptions: async (query: string): Promise<OptionType[]> => {
        if (query.length < 2) return []
        const { data } = await searchAuthors(query)
        return (data || []).map((author: any) => ({ value: author._id, label: author.name }))
      },
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <FilterBar
        fields={filterFields}
        values={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />
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
        <ul className="flex flex-col gap-1 max-h-64 overflow-scroll border-2 border-gray-400 rounded-md p-3">
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
