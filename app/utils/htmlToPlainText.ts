// Convierte el HTML del editor a texto plano, preservando párrafos como líneas separadas,
// para poder mostrar un diff legible del contenido (ver ContentDiffModal).
export function htmlToPlainText(html?: string | null): string {
  if (!html) return ""

  return html
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    // &nbsp; no es whitespace para JS (\s no lo matchea) -- sin decodificarlo antes del
    // trim de abajo, un párrafo vacío que BlockNote normaliza a "<p>&nbsp;</p>" (ver
    // BlockNoteEditor.tsx, blocksToHTMLLossy) queda como la línea literal "&nbsp;" en vez
    // de vaciarse como "<p></p>" sí se vacía -- texto distinto, invisible al ojo, que
    // alcanzaba para marcar "Contenido: cambió" con el modal de diff vacío
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map(line => line.trim())
    .join("\n")
    .trim()
}
