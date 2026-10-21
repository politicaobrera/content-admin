'use client'

import { useEffect, useState } from "react"
import getArticles from "@/app/actions/data/articles/getArticles"
import getResources from "@/app/actions/data/resources/getResources"
import getEvents from "@/app/actions/data/events/getEvents"
import { ArticleType } from "@/app/types/article"
import { ResourceType } from "@/app/types/resource"
import { EventType } from "@/app/types/event"
import { TagType } from "@/app/types/tag"
import TagSelector from "@/app/components/tags/TagSelector"
import useDebouncedValue from "@/app/hooks/useDebouncedValue"

type LookupResult =
  | { entity: 'articles'; data: Partial<ArticleType> }
  | { entity: 'resources'; data: Partial<ResourceType> }
  | { entity: 'events'; data: Partial<EventType> }

type LookupEntity = LookupResult['entity']
type RelatedItem = Partial<ArticleType> | Partial<ResourceType> | Partial<EventType>

const MIN_TITLE_LENGTH = 2

interface CampaignLookupPanelProps {
  relatedArticles: Partial<ArticleType>[]
  relatedResources: Partial<ResourceType>[]
  relatedEvents: Partial<EventType>[]
  onChangeRelatedArticles: (items: Partial<ArticleType>[]) => void
  onChangeRelatedResources: (items: Partial<ResourceType>[]) => void
  onChangeRelatedEvents: (items: Partial<EventType>[]) => void
}

function getThumbnailSrc(result: LookupResult): string | undefined {
  if (result.entity === 'articles') return result.data.image?.src
  if (result.entity === 'resources') return result.data.src
  return result.data.image
}

const CampaignLookupPanel = ({
  relatedArticles,
  relatedResources,
  relatedEvents,
  onChangeRelatedArticles,
  onChangeRelatedResources,
  onChangeRelatedEvents,
}: CampaignLookupPanelProps) => {
  const [entity, setEntity] = useState<LookupEntity>('articles')
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState<TagType[]>([])
  const [results, setResults] = useState<LookupResult[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedTitle = useDebouncedValue(title)

  const hasFilter = debouncedTitle.trim().length >= MIN_TITLE_LENGTH || tags.length > 0
  const currentRelated: RelatedItem[] =
    entity === 'articles' ? relatedArticles : entity === 'resources' ? relatedResources : relatedEvents
  // events.model no indexa por tags, así que ese filtro solo aplica a notas/recursos
  const supportsTagFilter = entity !== 'events'

  useEffect(() => {
    if (!hasFilter) {
      setResults([])
      return
    }

    let cancelled = false
    setLoading(true)

    const params = {
      ...(debouncedTitle.trim().length >= MIN_TITLE_LENGTH ? { title: debouncedTitle.trim() } : {}),
      ...(supportsTagFilter && tags.length > 0 ? { tags: tags.map(t => t._id) } : {}),
      perPage: '20',
    }

    async function search() {
      if (entity === 'articles') {
        const { data, error } = await getArticles(params)
        if (error) console.log("error al buscar notas para vincular", error)
        if (!cancelled) setResults((data ?? []).map((item) => ({ entity: 'articles' as const, data: item })))
      } else if (entity === 'resources') {
        const { data, error } = await getResources(params)
        if (error) console.log("error al buscar recursos para vincular", error)
        if (!cancelled) setResults((data ?? []).map((item) => ({ entity: 'resources' as const, data: item })))
      } else {
        const { data, error } = await getEvents(params)
        if (error) console.log("error al buscar eventos para vincular", error)
        if (!cancelled) setResults((data ?? []).map((item) => ({ entity: 'events' as const, data: item })))
      }
      if (!cancelled) setLoading(false)
    }

    search()

    return () => { cancelled = true }
  }, [debouncedTitle, tags, entity, hasFilter, supportsTagFilter])

  const handleLink = (result: LookupResult) => {
    const alreadyLinked = currentRelated.some((i) => i._id === result.data._id)
    if (alreadyLinked) return
    if (result.entity === 'articles') {
      onChangeRelatedArticles([...relatedArticles, result.data])
    } else if (result.entity === 'resources') {
      onChangeRelatedResources([...relatedResources, result.data])
    } else {
      onChangeRelatedEvents([...relatedEvents, result.data])
    }
  }

  const handleUnlink = (item: RelatedItem) => {
    if (entity === 'articles') {
      onChangeRelatedArticles(relatedArticles.filter((i) => i._id !== item._id))
    } else if (entity === 'resources') {
      onChangeRelatedResources(relatedResources.filter((i) => i._id !== item._id))
    } else {
      onChangeRelatedEvents(relatedEvents.filter((i) => i._id !== item._id))
    }
  }

  return (
    <div className="flex flex-col gap-3 border-2 border-gray-400 rounded-md p-3">
      <h3 className="font-bold text-lg">Notas / recursos / eventos relacionados</h3>
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
        <button
          type="button"
          className={entity === 'events' ? 'font-bold underline' : 'text-gray-500'}
          onClick={() => setEntity('events')}
        >
          Eventos
        </button>
      </div>

      {currentRelated.length > 0 && (
        <ul className="flex flex-col gap-1">
          {currentRelated.map((item) => (
            <li
              key={item._id}
              className="flex items-center gap-2 border-l-4 border-black bg-gray-100 px-2 py-1"
            >
              <span className="font-semibold flex-1">{item.title}</span>
              <button type="button" className="underline text-sm" onClick={() => handleUnlink(item)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        type="text"
        placeholder="Buscar por título..."
        className="w-full border-2 p-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {supportsTagFilter && <TagSelector currentTags={tags} onChange={setTags} />}
      {loading && <p>Buscando...</p>}
      {!loading && hasFilter && results.length === 0 && <p>Sin resultados</p>}
      {!loading && results.length > 0 && (
        <ul className="flex flex-col gap-1 max-h-64 overflow-scroll">
          {results.map((result) => {
            const { data } = result
            const alreadyLinked = currentRelated.some((i) => i._id === data._id)
            const thumbnailSrc = getThumbnailSrc(result)
            return (
              <li
                key={data._id}
                className="flex items-center gap-2 border-2 border-black rounded-md p-1"
              >
                {thumbnailSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnailSrc}
                    alt=""
                    className="w-10 h-10 object-cover rounded-sm flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-sm bg-gray-200 flex-shrink-0" />
                )}
                <span className="font-semibold">{data.title}</span>
                {result.entity !== 'events' && result.data.slug && (
                  <span className="ml-auto text-sm text-gray-500">/{result.data.slug}</span>
                )}
                {result.entity === 'events' && result.data.date && (
                  <span className="ml-auto text-sm text-gray-500">
                    {new Date(result.data.date).toLocaleDateString()}{result.data.place ? ` · ${result.data.place}` : ''}
                  </span>
                )}
                <button
                  type="button"
                  className="underline text-sm disabled:opacity-50"
                  disabled={alreadyLinked}
                  onClick={() => handleLink(result)}
                >
                  {alreadyLinked ? 'Vinculado' : 'Vincular'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default CampaignLookupPanel
