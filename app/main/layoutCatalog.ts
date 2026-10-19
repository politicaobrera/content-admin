export interface LayoutParamSchema {
  key: string
  label: string
  placeholder?: string
}

export interface LayoutCatalogEntry {
  slug: string
  label: string
  articleCount: number
  params?: LayoutParamSchema[]
  // permite más de una instancia en la misma portada
  repeatable?: boolean
}

// Espejo manual de politicaobrera-reloaded/src/components/layout/front-page/layoutCatalog.ts
// (sin `component`: el admin no importa JSX de Material UI). Si se agrega/renombra un
// layout o se le cambian sus params/repeatable del lado del sitio público, actualizar
// también aquí.
export const LAYOUT_CATALOG: LayoutCatalogEntry[] = [
  { slug: "hero-grid-11", label: "Hero + grilla (11 notas)", articleCount: 11 },
  { slug: "headline-trio-4", label: "Titular + trío (4 notas)", articleCount: 4 },
  { slug: "duo-strip-7", label: "Dúo + tira horizontal (7 notas)", articleCount: 7 },
  { slug: "photo-strip-5", label: "Tira de fotos (5 notas)", articleCount: 5 },
  { slug: "magazine-spread-6", label: "Spread revista (6 notas)", articleCount: 6 },
  { slug: "breaking-news-1", label: "Último momento (1 nota)", articleCount: 1 },
  {
    slug: "timeline-strip-6",
    label: "Al minuto (6 notas)",
    articleCount: 6,
    params: [{ key: "title", label: "Título del bloque", placeholder: "Al minuto" }],
    repeatable: true,
  },
  { slug: "split-feature-5", label: "Split editorial (5 notas)", articleCount: 5 },
]

export const DEFAULT_LAYOUT_ORDER = [
  "hero-grid-11",
  "headline-trio-4",
  "duo-strip-7",
  "photo-strip-5",
  "magazine-spread-6",
]

export interface LayoutInstance {
  slug: string
  instanceId: string
  params?: Record<string, string>
}

let instanceCounter = 0
export function createLayoutInstanceId(slug: string): string {
  instanceCounter += 1
  return `${slug}-${Date.now()}-${instanceCounter}`
}

// `current` puede traer el formato viejo (string suelto) o el nuevo
// ({slug, instanceId, params}) — mismo criterio que en el repo del sitio público.
export function normalizeLayoutInstances(raw: unknown): LayoutInstance[] {
  if (!Array.isArray(raw)) return []
  return raw.map((entry) => {
    if (typeof entry === "string") {
      return { slug: entry, instanceId: createLayoutInstanceId(entry) }
    }
    if (entry && typeof entry === "object" && typeof (entry as any).slug === "string") {
      const { slug, instanceId, params } = entry as Partial<LayoutInstance>
      return { slug: slug!, instanceId: instanceId || createLayoutInstanceId(slug!), params }
    }
    return null
  }).filter((entry): entry is LayoutInstance => Boolean(entry))
}
