// Convierte el HTML del editor a texto plano, preservando párrafos como líneas separadas,
// para poder mostrar un diff legible del contenido (ver ContentDiffModal).
export function htmlToPlainText(html?: string | null): string {
  if (!html) return ""

  return html
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map(line => line.trim())
    .join("\n")
    .trim()
}
