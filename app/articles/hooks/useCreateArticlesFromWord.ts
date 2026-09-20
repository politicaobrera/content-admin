import { useState } from "react"
import createArticle from "@/app/actions/data/articles/createArticle"
import editArticle from "@/app/actions/data/articles/editArticle"
import parseWordArticle from "@/app/articles/utils/parseWordArticle"

export type CreateFromWordResults = {
  success: string[]
  errors: { fileName: string, reason: string }[]
}

const useCreateArticlesFromWord = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const createFromFiles = async (files: File[]): Promise<CreateFromWordResults> => {
    setLoading(true)
    const results: CreateFromWordResults = { success: [], errors: [] }

    for (const file of files) {
      const { data: parsed, error: parseError } = await parseWordArticle(file)
      if (parseError || !parsed) {
        results.errors.push({
          fileName: file.name,
          reason: parseError?.reason || "No se pudo procesar el archivo",
        })
        continue
      }

      const { data: created, error: createError } = await createArticle(parsed.title)
      if (createError || !created) {
        results.errors.push({
          fileName: file.name,
          reason: createError?.message || "Error al crear la nota",
        })
        continue
      }

      const { error: editError } = await editArticle({
        _id: created._id,
        volanta: parsed.volanta,
        subhead: parsed.subhead,
        content: parsed.content,
      })
      if (editError) {
        results.errors.push({
          fileName: file.name,
          reason: editError.message || "Error al completar la nota",
        })
        continue
      }

      results.success.push(parsed.title)
    }

    setLoading(false)
    return results
  }

  return { loading, createFromFiles }
}

export default useCreateArticlesFromWord
