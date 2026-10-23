'use client'

import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import useDebouncedValue from "@/app/hooks/useDebouncedValue"
import getEvents from "@/app/actions/data/events/getEvents"
import getIssues from "@/app/actions/data/issues/getIssues"
import getPublications from "@/app/actions/data/publications/getPublications"
import { EventType } from "@/app/types/event"
import { IssueType } from "@/app/types/issue"
import { PublicationType } from "@/app/types/publication"
import ImageThumb from "@/app/components/image/ImageThumb"
import usePortada from "../hooks/usePortada"

const MIN_TITLE_LENGTH = 2
// cuando el campo de búsqueda está vacío pero tiene foco, se muestran los próximos
// eventos vigentes (orden por fecha ascendente, desde hoy) -- cubre el caso más común
// de querer destacar el evento que se acaba de crear sin tener que escribir nada
const UPCOMING_EVENTS_COUNT = 5

interface FeaturedAgendaPanelProps {
  id: string
  currentFeaturedEvents: Partial<EventType>[]
  currentFeaturedIssues: Partial<IssueType>[]
}

function formatEventLabel(event: Partial<EventType>): string {
  const date = event.date ? new Date(event.date).toLocaleDateString('es-AR') : ''
  return date ? `${event.title} (${date})` : event.title || ''
}

function formatIssueLabel(issue: Partial<IssueType>): string {
  const publication = typeof issue.publicationId === 'object' ? issue.publicationId?.name : undefined
  return publication ? `${publication} N.º ${issue.number}` : `N.º ${issue.number}`
}

const FeaturedAgendaPanel = ({ id, currentFeaturedEvents, currentFeaturedIssues }: FeaturedAgendaPanelProps) => {
  const { saveFeaturedEvents, saveFeaturedIssues } = usePortada()

  const [featuredEvents, setFeaturedEvents] = useState(currentFeaturedEvents)
  const [featuredIssues, setFeaturedIssues] = useState(currentFeaturedIssues)

  // ── Eventos ──────────────────────────────────────────────────────────────
  const [eventTitle, setEventTitle] = useState("")
  const debouncedEventTitle = useDebouncedValue(eventTitle)
  const [eventResults, setEventResults] = useState<EventType[]>([])
  const [showingUpcoming, setShowingUpcoming] = useState(false)

  useEffect(() => {
    if (debouncedEventTitle.trim().length < MIN_TITLE_LENGTH) {
      // sin texto buscado: no se pisa la lista de "próximos eventos" que haya
      // quedado cargada por el onFocus del input (ver handleEventInputFocus)
      return
    }
    setShowingUpcoming(false)
    let cancelled = false
    getEvents({ title: debouncedEventTitle.trim(), perPage: '10' }).then(({ data, error }) => {
      if (error) console.log("error al buscar eventos", error)
      if (!cancelled) setEventResults(data ?? [])
    })
    return () => { cancelled = true }
  }, [debouncedEventTitle])

  const handleEventInputFocus = () => {
    if (eventTitle.trim().length >= MIN_TITLE_LENGTH) return
    setShowingUpcoming(true)
    getEvents({ from: new Date().toISOString(), perPage: String(UPCOMING_EVENTS_COUNT) }).then(({ data, error }) => {
      if (error) console.log("error al obtener próximos eventos", error)
      setEventResults(data ?? [])
    })
  }

  const handleAddEvent = (event: EventType) => {
    if (featuredEvents.some((e) => e._id === event._id)) return
    const next = [...featuredEvents, event]
    setFeaturedEvents(next)
    setEventTitle("")
    setEventResults([])
    setShowingUpcoming(false)
    saveFeaturedEvents(next, id).then(({ data, error }) => {
      if (error) toast.error(error.message)
      if (data) {
        setFeaturedEvents(data.featuredEvents)
        toast.success("Evento destacado actualizado")
      }
    })
  }

  const handleRemoveEvent = (event: Partial<EventType>) => {
    const next = featuredEvents.filter((e) => e._id !== event._id)
    setFeaturedEvents(next)
    saveFeaturedEvents(next, id).then(({ data, error }) => {
      if (error) toast.error(error.message)
      if (data) {
        setFeaturedEvents(data.featuredEvents)
        toast.success("Evento destacado actualizado")
      }
    })
  }

  // ── Números de publicación ───────────────────────────────────────────────
  const [publications, setPublications] = useState<PublicationType[]>([])
  const [selectedPublicationId, setSelectedPublicationId] = useState("")
  const [publicationIssues, setPublicationIssues] = useState<IssueType[]>([])

  useEffect(() => {
    getPublications({ perPage: '100' }).then(({ data, error }) => {
      if (error) console.log("error al obtener publicaciones", error)
      if (data) setPublications(data)
    })
  }, [])

  useEffect(() => {
    if (!selectedPublicationId) {
      setPublicationIssues([])
      return
    }
    let cancelled = false
    getIssues({ publicationId: selectedPublicationId, status: 'published', perPage: '100' }).then(({ data, error }) => {
      if (error) console.log("error al obtener números", error)
      if (!cancelled) setPublicationIssues(data ?? [])
    })
    return () => { cancelled = true }
  }, [selectedPublicationId])

  const handleAddIssue = (issue: IssueType) => {
    if (featuredIssues.some((i) => i._id === issue._id)) return
    const next = [...featuredIssues, issue]
    setFeaturedIssues(next)
    saveFeaturedIssues(next, id).then(({ data, error }) => {
      if (error) toast.error(error.message)
      if (data) {
        setFeaturedIssues(data.featuredIssues)
        toast.success("Número destacado actualizado")
      }
    })
  }

  const handleRemoveIssue = (issue: Partial<IssueType>) => {
    const next = featuredIssues.filter((i) => i._id !== issue._id)
    setFeaturedIssues(next)
    saveFeaturedIssues(next, id).then(({ data, error }) => {
      if (error) toast.error(error.message)
      if (data) {
        setFeaturedIssues(data.featuredIssues)
        toast.success("Número destacado actualizado")
      }
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 border-2 border-gray-400 rounded-md p-3">
        <h3 className="font-bold text-lg">Evento destacado en portada</h3>
        {featuredEvents.length > 0 && (
          <ul className="flex flex-col gap-1">
            {featuredEvents.map((event) => (
              <li
                key={event._id}
                className="flex items-center gap-2 border-l-4 border-black bg-gray-100 px-2 py-1"
              >
                <ImageThumb image={event.image ? { src: event.image } : undefined} />
                <span className="font-semibold flex-1 text-gray-900">{formatEventLabel(event)}</span>
                <button type="button" className="underline text-sm text-gray-900" onClick={() => handleRemoveEvent(event)}>
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          type="text"
          placeholder="Buscar evento por título..."
          className="w-full border-2 p-1 text-gray-900"
          value={eventTitle}
          onFocus={handleEventInputFocus}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        {eventResults.length > 0 && (
          <>
            {showingUpcoming && (
              <p className="text-xs text-gray-500 italic">Próximos eventos vigentes:</p>
            )}
            <ul className="flex flex-col gap-1 max-h-48 overflow-scroll">
              {eventResults.map((event) => {
                const alreadyAdded = featuredEvents.some((e) => e._id === event._id)
                return (
                  <li key={event._id}>
                    <button
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => handleAddEvent(event)}
                      className="flex items-center gap-2 border-2 border-black rounded-md p-1 w-full text-left disabled:opacity-50 enabled:hover:bg-gray-100"
                    >
                      <ImageThumb image={event.image ? { src: event.image } : undefined} />
                      <span className="font-semibold flex-1 text-gray-900">{formatEventLabel(event)}</span>
                      <span className="underline text-sm text-gray-900 shrink-0">
                        {alreadyAdded ? 'Agregado' : 'Destacar'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 border-2 border-gray-400 rounded-md p-3">
        <h3 className="font-bold text-lg">Número de publicación destacado en portada</h3>
        {featuredIssues.length > 0 && (
          <ul className="flex flex-col gap-1">
            {featuredIssues.map((issue) => (
              <li
                key={issue._id}
                className="flex items-center gap-2 border-l-4 border-black bg-gray-100 px-2 py-1"
              >
                <ImageThumb image={issue.coverImage} />
                <span className="font-semibold flex-1 text-gray-900">{formatIssueLabel(issue)}</span>
                <button type="button" className="underline text-sm text-gray-900" onClick={() => handleRemoveIssue(issue)}>
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
        <select
          className="w-full border-2 p-1 text-gray-900"
          value={selectedPublicationId}
          onChange={(e) => setSelectedPublicationId(e.target.value)}
        >
          <option value="">Elegí una publicación...</option>
          {publications.map((pub) => (
            <option key={pub._id} value={pub._id}>{pub.name}</option>
          ))}
        </select>
        {publicationIssues.length > 0 && (
          <ul className="flex flex-col gap-1 max-h-48 overflow-scroll">
            {publicationIssues.map((issue) => {
              const alreadyAdded = featuredIssues.some((i) => i._id === issue._id)
              return (
                <li key={issue._id}>
                  <button
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => handleAddIssue(issue)}
                    className="flex items-center gap-2 border-2 border-black rounded-md p-1 w-full text-left disabled:opacity-50 enabled:hover:bg-gray-100"
                  >
                    <ImageThumb image={issue.coverImage} />
                    <span className="font-semibold flex-1 text-gray-900">N.º {issue.number}</span>
                    <span className="underline text-sm text-gray-900 shrink-0">
                      {alreadyAdded ? 'Agregado' : 'Destacar'}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default FeaturedAgendaPanel
