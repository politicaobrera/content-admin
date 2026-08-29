'use client'

import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import getArticles from "@/app/actions/data/articles/getArticles"
import getResources from "@/app/actions/data/resources/getResources"
import { ArticleType } from "@/app/types/article"
import { ResourceType } from "@/app/types/resource"
import { TagType } from "@/app/types/tag"
import TagSelector from "@/app/components/tags/TagSelector"
import useDebouncedValue from "@/app/hooks/useDebouncedValue"
import { Section } from "@/app/types/sections"
import { useClipboard } from "@/app/hooks/useClipboard"

type LookupEntity = 'articles' | 'resources'
type LookupResult = { _id: string, title: string, slug: string, section?: Section}

const MIN_TITLE_LENGTH = 2

interface ContentLookupPanelProps {
  excludeArticleId?: string
  relatedArticles: Partial<ArticleType>[]
  relatedResources: Partial<ResourceType>[]
  onChangeRelatedArticles: (items: Partial<ArticleType>[]) => void
  onChangeRelatedResources: (items: Partial<ResourceType>[]) => void
}

const ContentLookupPanel = ({
  excludeArticleId,
  relatedArticles,
  relatedResources,
  onChangeRelatedArticles,
  onChangeRelatedResources,
}: ContentLookupPanelProps) => {
  const { copyToClipboard } = useClipboard()
  const [entity, setEntity] = useState<LookupEntity>('articles')
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState<TagType[]>([])
  const [results, setResults] = useState<LookupResult[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedTitle = useDebouncedValue(title)

  const hasFilter = debouncedTitle.trim().length >= MIN_TITLE_LENGTH || tags.length > 0
  const currentRelated = entity === 'articles' ? relatedArticles : relatedResources

  useEffect(() => {
    if (!hasFilter) {
      setResults([])
      return
    }

    let cancelled = false
    setLoading(true)

    const params = {
      ...(debouncedTitle.trim().length >= MIN_TITLE_LENGTH ? { title: debouncedTitle.trim() } : {}),
      ...(tags.length > 0 ? { tags: tags.map(t => t._id) } : {}),
      perPage: '20',
    }

    const search = entity === 'articles'
      ? getArticles(params)
      : getResources(params)

    search.then((response) => {
      if (cancelled) return
      const { data, error } = response as { data?: (Partial<ArticleType> | Partial<ResourceType>)[], error?: unknown }
      if (error) {
        console.log("error al buscar contenido para vincular", error)
      }
      const items = (data ?? []) as LookupResult[]
      const filtered = entity === 'articles'
        ? items.filter((item) => item._id !== excludeArticleId)
        : items
      setResults(filtered)
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [debouncedTitle, tags, entity, excludeArticleId, hasFilter])

  const handleCopySlug = async (item: LookupResult) => {
    const text = `https://politicaobrerareloadedtest.firebaseapp.com${item?.section && item.section.slug === "revista" ? "/revista" : ""}/${item.slug}`
    const success = await copyToClipboard(text)
    if (success) {
      console.log("Enlace al portapapeles:", text)
      toast.success("Enlace copiado al portapapeles!!")
      return
    }
    toast.error("No se pudo copiar el enlace")
  }

  const handleLink = (item: LookupResult) => {
    const alreadyLinked = currentRelated.some((i) => i._id === item._id)
    if (alreadyLinked) return
    if (entity === 'articles') {
      onChangeRelatedArticles([...relatedArticles, item])
    } else {
      onChangeRelatedResources([...relatedResources, item])
    }
  }

  const handleUnlink = (item: Partial<ArticleType> | Partial<ResourceType>) => {
    if (entity === 'articles') {
      onChangeRelatedArticles(relatedArticles.filter((i) => i._id !== item._id))
    } else {
      onChangeRelatedResources(relatedResources.filter((i) => i._id !== item._id))
    }
  }

  return (
    <div className="flex flex-col gap-3 border-2 border-gray-400 rounded-md p-3">
      <h3 className="font-bold text-lg">Notas / recursos relacionados</h3>
      <div className="flex gap-4">
        <button
          type="button"
          className={entity === 'articles' ? 'font-bold underline' : 'text-gray-500'}
          onClick={() => setEntity('articles')}
        >
          Notas
        </button>
        <button
          type="button"
          className={entity === 'resources' ? 'font-bold underline' : 'text-gray-500'}
          onClick={() => setEntity('resources')}
        >
          Recursos
        </button>
      </div>

      {currentRelated.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {currentRelated.map((item) => (
            <div
              key={item._id}
              className="p-2 rounded-md bg-yellow-500 flex font-bold items-center gap-2"
            >
              {item.title}
              <button type="button" onClick={() => handleUnlink(item)}>✕</button>
            </div>
          ))}
        </div>
      )}

      <input
        type="text"
        placeholder="Buscar por título..."
        className="w-full border-2 p-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TagSelector currentTags={tags} onChange={setTags} />
      {loading && <p>Buscando...</p>}
      {!loading && hasFilter && results.length === 0 && <p>Sin resultados</p>}
      {!loading && results.length > 0 && (
        <ul className="flex flex-col gap-1 max-h-64 overflow-scroll">
          {results.map((item) => {
            const alreadyLinked = currentRelated.some((i) => i._id === item._id)
            return (
              <li
                key={item._id}
                className="flex items-center gap-2 border-2 border-black rounded-md p-1"
              >
                <span className="font-semibold">{item.title}</span>
                <span className="ml-auto text-sm text-gray-500">/{item.slug}</span>
                <button
                  type="button"
                  className="underline text-sm"
                  onClick={() => handleCopySlug(item)}
                >
                  Copiar enlace
                </button>
                <button
                  type="button"
                  className="underline text-sm disabled:opacity-50"
                  disabled={alreadyLinked}
                  onClick={() => handleLink(item)}
                >
                  {alreadyLinked ? 'Vinculada' : 'Vincular'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default ContentLookupPanel
