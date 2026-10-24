'use client'

import { RefObject, useEffect, useState } from "react"
import getArticles from "@/app/actions/data/articles/getArticles"
import getResources from "@/app/actions/data/resources/getResources"
import { ArticleStatus, ArticleType } from "@/app/types/article"
import { ResourceSourceType, ResourceType } from "@/app/types/resource"
import { TagType } from "@/app/types/tag"
import { Section } from "@/app/types/sections"
import TagSelector from "@/app/components/tags/TagSelector"
import SectionSelector from "@/app/components/sections/SectionSelector"
import useDebouncedValue from "@/app/hooks/useDebouncedValue"
import { BlockNoteEditorHandle, InsertableMediaBlockType } from "@/app/components/inputs/BlockNoteEditor"

// Mismo patrón que app/campaigns/components/CampaignLookupPanel.tsx (ver ahí el porqué
// de la union discriminada por `entity` en vez de un tipo aplanado). Este panel es para
// VINCULAR contenido a la nota, no para compartirlo — no tiene sentido copiar enlaces
// desde aquí.
type LookupResult =
  | { entity: 'articles'; data: Partial<ArticleType> }
  | { entity: 'resources'; data: Partial<ResourceType> }

type LookupEntity = LookupResult['entity']
type RelatedItem = Partial<ArticleType> | Partial<ResourceType>

const MIN_TITLE_LENGTH = 2
// cuando el buscador recibe foco sin ningun filtro activo, se muestran los ultimos
// resultados de esa entidad -- lo mas comun es querer vincular algo recien creado
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
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState<TagType[]>([])
  const [section, setSection] = useState<Section | null>(null)
  const [results, setResults] = useState<LookupResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showingRecent, setShowingRecent] = useState(false)
  const debouncedTitle = useDebouncedValue(title)

  // sección solo tiene sentido para notas -- recursos no están seccionados
  const supportsSectionFilter = entity === 'articles'
  const hasFilter = debouncedTitle.trim().length >= MIN_TITLE_LENGTH || tags.length > 0
    || (supportsSectionFilter && !!section)
  const currentRelated: RelatedItem[] = entity === 'articles' ? relatedArticles : relatedResources

  useEffect(() => {
    if (!hasFilter) {
      // sin filtro: no se pisa la lista de "recientes" que haya quedado cargada por
      // el onFocus del input (ver handleInputFocus) -- esa es la unica forma de tener
      // resultados sin ningun filtro activo
      return
    }

    setShowingRecent(false)
    let cancelled = false
    setLoading(true)

    const params = {
      ...(debouncedTitle.trim().length >= MIN_TITLE_LENGTH ? { title: debouncedTitle.trim() } : {}),
      ...(tags.length > 0 ? { tags: tags.map(t => t._id) } : {}),
      ...(supportsSectionFilter && section ? { section: section._id } : {}),
      perPage: '20',
    }

    async function search() {
      if (entity === 'articles') {
        // no se puede vincular una nota que todavia no esta publicada
        const { data, error } = await getArticles({ ...params, status: ArticleStatus.Published })
        if (error) console.log("error al buscar notas para vincular", error)
        if (!cancelled) {
          const filtered = (data ?? []).filter((item) => item._id !== excludeArticleId)
          setResults(filtered.map((item) => ({ entity: 'articles' as const, data: item })))
        }
      } else {
        const { data, error } = await getResources(params)
        if (error) console.log("error al buscar recursos para vincular", error)
        if (!cancelled) setResults((data ?? []).map((item) => ({ entity: 'resources' as const, data: item })))
      }
      if (!cancelled) setLoading(false)
    }

    search()

    return () => { cancelled = true }
  }, [debouncedTitle, tags, section, entity, excludeArticleId, hasFilter, supportsSectionFilter])

  const handleInputFocus = () => {
    if (hasFilter) return
    setShowingRecent(true)
    setLoading(true)
    const recentParams = { perPage: String(RECENT_RESULTS_COUNT), sortField: entity === 'articles' ? 'articleId' : 'createdAt', sortOrder: 'desc' }
    if (entity === 'articles') {
      // no se puede vincular una nota que todavia no esta publicada
      getArticles({ ...recentParams, status: ArticleStatus.Published }).then(({ data, error }) => {
        if (error) console.log("error al obtener notas recientes", error)
        const filtered = (data ?? []).filter((item) => item._id !== excludeArticleId)
        setResults(filtered.map((item) => ({ entity: 'articles' as const, data: item })))
        setLoading(false)
      })
    } else {
      getResources(recentParams).then(({ data, error }) => {
        if (error) console.log("error al obtener recursos recientes", error)
        setResults((data ?? []).map((item) => ({ entity: 'resources' as const, data: item })))
        setLoading(false)
      })
    }
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
                <button type="button" className="underline text-sm" onClick={() => handleUnlink(item)}>
                  Quitar
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <input
        type="text"
        placeholder="Buscar por título..."
        className="w-full border-2 p-1"
        value={title}
        onFocus={handleInputFocus}
        onChange={(e) => setTitle(e.target.value)}
      />
      {supportsSectionFilter && (
        <SectionSelector
          currentSection={section}
          onChange={setSection}
          isClearable
          showLabel={false}
        />
      )}
      <TagSelector currentTags={tags} onChange={setTags} />
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
