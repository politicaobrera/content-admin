'use client'

import { useEffect, useState } from "react"
import getResources from "@/app/actions/data/resources/getResources"
import getEvents from "@/app/actions/data/events/getEvents"
import { ArticleType } from "@/app/types/article"
import { ResourceType } from "@/app/types/resource"
import { EventType } from "@/app/types/event"
import useDebouncedValue from "@/app/hooks/useDebouncedValue"
import useArticleSearch from "@/app/articles/hooks/useArticleSearch"
import ArticleSearchFilters from "@/app/articles/components/ArticleSearchFilters"
import { formatArgDate } from "@/app/utils/dates"

type LookupResult =
  | { entity: 'articles'; data: Partial<ArticleType> }
  | { entity: 'resources'; data: Partial<ResourceType> }
  | { entity: 'events'; data: Partial<EventType> }

type LookupEntity = LookupResult['entity']
type RelatedItem = Partial<ArticleType> | Partial<ResourceType> | Partial<EventType>

const MIN_TITLE_LENGTH = 2
// cuando el buscador recibe foco sin ningun filtro activo, se muestran resultados
// recientes/proximos de esa entidad -- lo mas comun es querer vincular algo nuevo
const RECENT_RESULTS_COUNT = 5

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

  // búsqueda de notas (título + sección + autor + tag) compartida con
  // ContentLookupPanel e IssueArticleSelector -- ver useArticleSearch
  const articleSearch = useArticleSearch()

  const [otherTitle, setOtherTitle] = useState("")
  const [otherResults, setOtherResults] = useState<Partial<ResourceType | EventType>[]>([])
  const [otherLoading, setOtherLoading] = useState(false)
  const [otherShowingRecent, setOtherShowingRecent] = useState(false)
  const debouncedOtherTitle = useDebouncedValue(otherTitle)
  const hasOtherFilter = debouncedOtherTitle.trim().length >= MIN_TITLE_LENGTH

  const currentRelated: RelatedItem[] =
    entity === 'articles' ? relatedArticles : entity === 'resources' ? relatedResources : relatedEvents

  const results: LookupResult[] = entity === 'articles'
    ? articleSearch.state.results.map((item) => ({ entity: 'articles' as const, data: item }))
    : entity === 'resources'
      ? otherResults.map((item) => ({ entity: 'resources' as const, data: item as Partial<ResourceType> }))
      : otherResults.map((item) => ({ entity: 'events' as const, data: item as Partial<EventType> }))
  const loading = entity === 'articles' ? articleSearch.state.loading : otherLoading
  const showingRecent = entity === 'articles' ? articleSearch.state.showingRecent : otherShowingRecent
  const hasFilter = entity === 'articles' ? articleSearch.state.hasFilter : hasOtherFilter

  useEffect(() => {
    setOtherTitle("")
    setOtherResults([])
    setOtherShowingRecent(false)
  }, [entity])

  useEffect(() => {
    if (entity === 'articles' || !hasOtherFilter) return
    setOtherShowingRecent(false)
    let cancelled = false
    setOtherLoading(true)
    const params = { title: debouncedOtherTitle.trim(), perPage: '20' }
    const request = entity === 'resources' ? getResources(params) : getEvents(params)
    request.then(({ data, error }) => {
      if (error) console.log(`error al buscar ${entity} para vincular`, error)
      if (!cancelled) {
        setOtherResults(data ?? [])
        setOtherLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [entity, debouncedOtherTitle, hasOtherFilter])

  const handleOtherFocus = () => {
    if (hasOtherFilter) return
    setOtherShowingRecent(true)
    setOtherLoading(true)
    if (entity === 'resources') {
      getResources({ perPage: String(RECENT_RESULTS_COUNT), sortField: 'createdAt', sortOrder: 'desc' }).then(({ data, error }) => {
        if (error) console.log("error al obtener recursos recientes", error)
        setOtherResults(data ?? [])
        setOtherLoading(false)
      })
    } else if (entity === 'events') {
      // eventos: proximos vigentes (misma logica que FeaturedAgendaPanel en portada),
      // no "ultimos creados" -- mas probable querer vincular un evento que no paso
      getEvents({ from: new Date().toISOString(), perPage: String(RECENT_RESULTS_COUNT) }).then(({ data, error }) => {
        if (error) console.log("error al obtener proximos eventos", error)
        setOtherResults(data ?? [])
        setOtherLoading(false)
      })
    }
  }

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

      {entity === 'articles' ? (
        <ArticleSearchFilters
          title={articleSearch.state.title}
          onTitleChange={articleSearch.actions.setTitle}
          onTitleFocus={articleSearch.actions.handleFocus}
          section={articleSearch.state.section}
          onSectionChange={articleSearch.actions.setSection}
          author={articleSearch.state.author}
          onAuthorChange={articleSearch.actions.setAuthor}
          tags={articleSearch.state.tags}
          onTagsChange={articleSearch.actions.setTags}
        />
      ) : (
        <input
          type="text"
          placeholder="Buscar por título..."
          className="w-full border-2 border-gray-400 rounded-md p-1.5 text-gray-900"
          value={otherTitle}
          onFocus={handleOtherFocus}
          onChange={(e) => setOtherTitle(e.target.value)}
        />
      )}
      {loading && <p>Buscando...</p>}
      {!loading && showingRecent && results.length > 0 && (
        <p className="text-xs text-gray-500 italic">
          {entity === 'articles' ? 'Últimas notas:' : entity === 'resources' ? 'Últimos recursos:' : 'Próximos eventos:'}
        </p>
      )}
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
                    {formatArgDate(result.data.date)}{result.data.place ? ` · ${result.data.place}` : ''}
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
