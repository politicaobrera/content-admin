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

const LABEL_REGEX = /^\s*(titulo|t[ií]tulo|volanta|bajada|autor(?:es)?)\s*:\s*(.*)$/i

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
    // mammoth separa párrafos con líneas vacías; cada párrafo puede tener
    // varias líneas (saltos de línea "duros" dentro del mismo párrafo de Word)
    const paragraphs = rawText
      .split(/\r?\n\r?\n/)
      .map((paragraph) => paragraph.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0))
      .filter((paragraphLines) => paragraphLines.length > 0)

    let title: string | undefined
    let volanta: string | undefined
    let subhead: string | undefined
    let lastLabelParagraphIndex = -1

    paragraphs.forEach((paragraphLines, index) => {
      const hasLabel = paragraphLines.some((line) => LABEL_REGEX.test(line))
      if (!hasLabel) return
      lastLabelParagraphIndex = index
      paragraphLines.forEach((line) => {
        const match = line.match(LABEL_REGEX)
        if (!match) return
        const label = normalizeLabel(match[1])
        const value = match[2].trim()
        if (label === "titulo") title = value
        if (label === "volanta") volanta = value
        if (label === "bajada") subhead = value
        // autor se detecta pero se ignora por el momento
      })
    })

    if (!title) {
      return {
        error: {
          fileName: file.name,
          reason: "No se encontró un título (línea 'titulo: ...')",
        },
      }
    }

    const bodyParagraphs = paragraphs.slice(lastLabelParagraphIndex + 1)
    // un <p>&nbsp;</p> entre párrafos reproduce el salto de línea en blanco
    // que deja Word entre párrafos, tal como lo espera BlockNoteEditor
    const content = bodyParagraphs
      .map((paragraphLines) => `<p>${paragraphLines.join(" ")}</p>`)
      .join("<p>&nbsp;</p>")

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
