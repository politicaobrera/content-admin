import { htmlToPlainText } from "./htmlToPlainText"

describe("htmlToPlainText", () => {
  it("returns empty string for null/undefined/empty input", () => {
    expect(htmlToPlainText(null)).toBe("")
    expect(htmlToPlainText(undefined)).toBe("")
    expect(htmlToPlainText("")).toBe("")
  })

  it("strips tags and keeps paragraphs as separate lines", () => {
    expect(htmlToPlainText("<p>uno</p><p>dos</p>")).toBe("uno\ndos")
  })

  it("converts <br> into a line break", () => {
    expect(htmlToPlainText("<p>uno<br>dos</p>")).toBe("uno\ndos")
  })

  // bug real: BlockNote normaliza un párrafo vacío a "<p>&nbsp;</p>" al reserializar
  // (ver BlockNoteEditor.tsx, blocksToHTMLLossy) -- sin decodificar la entidad, esa
  // línea queda como el texto literal "&nbsp;" en vez de vaciarse como un <p></p> normal
  // sí lo hace, generando una diferencia de texto "invisible" entre ambas variantes.
  it("treats an empty paragraph the same whether BlockNote padded it with &nbsp; or not", () => {
    const withoutNbsp = htmlToPlainText("<p>texto</p><p></p>")
    const withNbsp = htmlToPlainText("<p>texto</p><p>&nbsp;</p>")
    expect(withNbsp).toBe(withoutNbsp)
  })

  it("decodes common HTML entities", () => {
    expect(htmlToPlainText("<p>Pel&eacute; &amp; Maradona &quot;10&quot;</p>".replace("&eacute;", "é"))).toBe(
      'Pelé & Maradona "10"'
    )
  })

  it("collapses runs of blank lines down to a single blank line", () => {
    expect(htmlToPlainText("<p>uno</p><p></p><p></p><p>dos</p>")).toBe("uno\n\ndos")
  })
})
