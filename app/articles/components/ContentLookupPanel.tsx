'use client'

import { RefObject, useEffect, useState } from "react"
import getResources from "@/app/actions/data/resources/getResources"
import { ArticleType } from "@/app/types/article"
import { ResourceSourceType, ResourceType } from "@/app/types/resource"
import useArticleSearch from "../hooks/useArticleSearch"
import ArticleSearchFilters from "./ArticleSearchFilters"
import useDebouncedValue from "@/app/hooks/useDebouncedValue"
import { BlockNoteEditorHandle, InsertableMediaBlockType } from "@/app/components/inputs/BlockNoteEditor"
import { getArticlePath } from "@/app/utils/articles"

const MIN_TITLE_LENGTH = 2

type LookupResult =
  | { entity: 'articles'; data: Partial<ArticleType> }
  | { entity: 'resources'; data: Partial<ResourceType> }

type LookupEntity = LookupResult['entity']
type RelatedItem = Partial<ArticleType> | Partial<ResourceType>

// cuando el buscador recibe foco sin ningun filtro activo, se muestran los ultimos
// recursos -- lo mismo que useArticleSearch hace para notas, replicado acá solo para
// la rama de recursos (que no comparte el hook, ver nota más abajo)
const RECENT_RESULTS_COUNT = 5

interface ContentLookupPanelProps {
  excludeArticleId?: string
  relatedArticles: Partial<ArticleType>[]
  relatedResources: Partial<ResourceType>[]
  onChangeRelatedArticles: (items: Partial<ArticleType>[]) => void
  onChangeRelatedResources: (items: Partial<ResourceType>[]) => void
  editorRef?: RefObject<BlockNoteEditorHandle | null>
}

// solo imagen/video/audio con archivo propio mapean a un bloque nativo de BlockNote --
// un recurso tipo "document" (PDF) o sin src (solo externalSources) no tiene a donde
// insertarse como bloque de media
const INSERTABLE_SOURCE_TYPES: Partial<Record<ResourceSourceType, InsertableMediaBlockType>> = {
  [ResourceSourceType.Image]: "image",
  [ResourceSourceType.Video]: "video",
  [ResourceSourceType.Audio]: "audio",
}

function getInsertableBlockType(resource: Partial<ResourceType>): InsertableMediaBlockType | undefined {
  if (!resource.src || !resource.sourceType) return undefined
  return INSERTABLE_SOURCE_TYPES[resource.sourceType]
}

// miniatura del resultado de búsqueda: Article expone `image.src`, Resource expone
// `src` directo — se resuelve acá, en un solo lugar
function getThumbnailSrc(result: LookupResult): string | undefined {
  if (result.entity === 'articles') return result.data.image?.src
  return result.data.src
}

const ContentLookupPanel = ({
  excludeArticleId,
  relatedArticles,
  relatedResources,
  onChangeRelatedArticles,
  onChangeRelatedResources,
  editorRef,
}: ContentLookupPanelProps) => {
  const [entity, setEntity] = useState<LookupEntity>('articles')

  // búsqueda de notas: título + sección + autor + tag, compartida con
  // CampaignLookupPanel e IssueArticleSelector (ver useArticleSearch) -- la búsqueda
  // de recursos no comparte estos 4 filtros (no tienen sección/autor/tag de la misma
  // forma), así que se mantiene aparte, como ya estaba
  const articleSearch = useArticleSearch({ excludeArticleId })

  const [resourceTitle, setResourceTitle] = useState("")
  const [resourceResults, setResourceResults] = useState<ResourceType[]>([])
  const [resourceLoading, setResourceLoading] = useState(false)
  const [resourceShowingRecent, setResourceShowingRecent] = useState(false)
  const debouncedResourceTitle = useDebouncedValue(resourceTitle)
  const hasResourceFilter = debouncedResourceTitle.trim().length >= MIN_TITLE_LENGTH

  const currentRelated: RelatedItem[] = entity === 'articles' ? relatedArticles : relatedResources

  const results: LookupResult[] = entity === 'articles'
    ? articleSearch.state.results.map((item) => ({ entity: 'articles' as const, data: item }))
    : resourceResults.map((item) => ({ entity: 'resources' as const, data: item }))
  const loading = entity === 'articles' ? articleSearch.state.loading : resourceLoading
  const showingRecent = entity === 'articles' ? articleSearch.state.showingRecent : resourceShowingRecent
  const hasFilter = entity === 'articles' ? articleSearch.state.hasFilter : hasResourceFilter

  useEffect(() => {
    if (entity !== 'resources') return
    setResourceResults([])
    setResourceShowingRecent(false)
  }, [entity])

  useEffect(() => {
    if (entity !== 'resources' || !hasResourceFilter) return
    setResourceShowingRecent(false)
    let cancelled = false
    setResourceLoading(true)
    getResources({ title: debouncedResourceTitle.trim(), perPage: '20' }).then(({ data, error }) => {
      if (error) console.log("error al buscar recursos para vincular", error)
      if (!cancelled) {
        setResourceResults(data ?? [])
        setResourceLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [entity, debouncedResourceTitle, hasResourceFilter])

  const handleResourceFocus = () => {
    if (hasResourceFilter) return
    setResourceShowingRecent(true)
    setResourceLoading(true)
    getResources({ perPage: String(RECENT_RESULTS_COUNT), sortField: 'createdAt', sortOrder: 'desc' }).then(({ data, error }) => {
      if (error) console.log("error al obtener recursos recientes", error)
      setResourceResults(data ?? [])
      setResourceLoading(false)
    })
  }

  const handleLink = (result: LookupResult) => {
    const alreadyLinked = currentRelated.some((i) => i._id === result.data._id)
    if (alreadyLinked) return
    if (result.entity === 'articles') {
      onChangeRelatedArticles([...relatedArticles, result.data])
    } else {
      onChangeRelatedResources([...relatedResources, result.data])
    }
  }

  const handleUnlink = (item: RelatedItem) => {
    if (entity === 'articles') {
      onChangeRelatedArticles(relatedArticles.filter((i) => i._id !== item._id))
    } else {
      onChangeRelatedResources(relatedResources.filter((i) => i._id !== item._id))
    }
  }

  const handleInsertInBody = (resource: Partial<ResourceType>) => {
    const blockType = getInsertableBlockType(resource)
    if (!blockType || !resource.src || !editorRef?.current) return
    editorRef.current.insertMediaBlock(blockType, resource.src, resource.caption)
  }

  const handleInsertArticleLink = (article: Partial<ArticleType>) => {
    if (!article.slug || !article.title || !editorRef?.current) return
    editorRef.current.insertArticleLink(getArticlePath({ slug: article.slug, section: article.section }), article.title)
  }

  return (
    <div className="flex flex-col gap-3 border-2 border-gray-400 rounded-md p-3">
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
        // lista simple (no pills tipo tag) para no confundirse visualmente con el
        // selector de tags que aparece más abajo en el mismo panel
        <ul className="flex flex-col gap-1">
          {currentRelated.map((item) => {
            const insertableType = entity === 'resources' ? getInsertableBlockType(item) : undefined
            return (
              <li
                key={item._id}
                className="flex items-center gap-2 border-l-4 border-black bg-gray-100 px-2 py-1"
              >
                <span className="font-semibold flex-1">{item.title}</span>
                {insertableType && editorRef && (
                  <button
                    type="button"
                    className="underline text-sm"
                    onClick={() => handleInsertInBody(item)}
                    title="Inserta este recurso en el cuerpo de la nota, en el punto donde estaba el cursor"
                  >
                    Insertar en el cuerpo
                  </button>
                )}
                {entity === 'articles' && editorRef && (
                  <button
                    type="button"
                    className="underline text-sm"
                    onClick={() => handleInsertArticleLink(item)}
                    title="Convierte el texto seleccionado en un link a esta nota. Si no hay texto seleccionado, inserta el título como link."
                  >
                    Agregar como link
                  </button>
                )}
                <button type="button" className="underline text-sm" onClick={() => handleUnlink(item)}>
                  Quitar
                </button>
              </li>
            )
          })}
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
          value={resourceTitle}
          onFocus={handleResourceFocus}
          onChange={(e) => setResourceTitle(e.target.value)}
        />
      )}
      {loading && <p>Buscando...</p>}
      {!loading && showingRecent && results.length > 0 && (
        <p className="text-xs text-gray-500 italic">
          {entity === 'articles' ? 'Últimas notas:' : 'Últimos recursos:'}
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
                {result.entity === 'articles' && data.slug && (
                  <span className="ml-auto text-sm text-gray-500">/{data.slug}</span>
                )}
                <button
                  type="button"
                  className="underline text-sm disabled:opacity-50"
                  disabled={alreadyLinked}
                  onClick={() => handleLink(result)}
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
