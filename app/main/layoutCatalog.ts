export interface LayoutCatalogEntry {
  slug: string
  label: string
  articleCount: number
}

// Espejo manual de politicaobrera-reloaded/src/components/layout/front-page/layoutCatalog.ts
// (sin `component`: el admin no importa JSX de Material UI). Si se agrega/renombra un
// layout del lado del sitio público, actualizar también aquí.
export const LAYOUT_CATALOG: LayoutCatalogEntry[] = [
  { slug: "hero-grid-11", label: "Hero + grilla (11 notas)", articleCount: 11 },
  { slug: "headline-trio-4", label: "Titular + trío (4 notas)", articleCount: 4 },
  { slug: "duo-strip-7", label: "Dúo + tira horizontal (7 notas)", articleCount: 7 },
  { slug: "photo-strip-5", label: "Tira de fotos (5 notas)", articleCount: 5 },
  { slug: "magazine-spread-6", label: "Spread revista (6 notas)", articleCount: 6 },
]

export const DEFAULT_LAYOUT_ORDER = [
  "hero-grid-11",
  "headline-trio-4",
  "duo-strip-7",
  "photo-strip-5",
  "magazine-spread-6",
]
