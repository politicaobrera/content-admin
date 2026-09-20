import mammoth from "mammoth"

export type ParsedWordArticle = {
  title: string
  volanta?: string
  subhead?: string
  content: string
}

export type ParseWordArticleError = {
  fileName: string
  reason: string
}

const LABEL_REGEX = /^\s*(titulo|t[ií]tulo|volanta|bajada|autores?)\s*:\s*(.*)$/i

const normalizeLabel = (label: string): "titulo" | "volanta" | "bajada" | "autor" => {
  const lower = label.toLowerCase()
  if (lower.startsWith("titulo") || lower.startsWith("título")) return "titulo"
  if (lower.startsWith("volanta")) return "volanta"
  if (lower.startsWith("bajada")) return "bajada"
  return "autor"
}

const parseWordArticle = async (
  file: File
): Promise<{ data?: ParsedWordArticle, error?: ParseWordArticleError }> => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const { value: rawText } = await mammoth.extractRawText({ arrayBuffer })
    const lines = rawText.split("\n").map((line: string) => line.trim())

    let title: string | undefined
    let volanta: string | undefined
    let subhead: string | undefined
    let lastLabelIndex = -1

    lines.forEach((line: string, index: number) => {
      const match = line.match(LABEL_REGEX)
      if (!match) return
      const label = normalizeLabel(match[1])
      const value = match[2].trim()
      lastLabelIndex = index
      if (label === "titulo") title = value
      if (label === "volanta") volanta = value
      if (label === "bajada") subhead = value
      // autor se detecta pero se ignora por el momento
    })

    if (!title) {
      return {
        error: {
          fileName: file.name,
          reason: "No se encontró un título (línea 'titulo: ...')",
        },
      }
    }

    const bodyLines = lines
      .slice(lastLabelIndex + 1)
      .filter((line: string) => line.length > 0)
    const content = bodyLines.map((line: string) => `<p>${line}</p>`).join("")

    return {
      data: {
        title,
        volanta: volanta || undefined,
        subhead: subhead || undefined,
        content,
      },
    }
  } catch (error) {
    console.log("Error al parsear el archivo Word", error)
    return {
      error: {
        fileName: file.name,
        reason: "No se pudo leer el archivo",
      },
    }
  }
}

export default parseWordArticle
