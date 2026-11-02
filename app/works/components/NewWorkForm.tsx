'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import Select from 'react-select'
import {
  FieldValues,
  SubmitHandler,
  useForm
} from "react-hook-form"

import Button from "@/app/components/Button"
import Input from "@/app/components/inputs/Input"
import AuthorSelector from "@/app/components/authors/AuthorSelector"
import { AuthorType } from "@/app/types/author"
import { WorkType } from "@/app/types/work"
import { iResponseOne } from "@/app/types/responses"
import createWork from "@/app/actions/data/works/createWork"

const LICENSE_OPTIONS: { value: WorkType['license']; label: string }[] = [
  { value: "dominio-publico", label: "Dominio público" },
  { value: "cc-by-sa", label: "CC BY-SA" },
]

// a diferencia de NewArticleForm (solo title -- el resto se completa editando), el
// backend exige authors + sourceUrl + sourceLabel + license en el create mismo de Work
// (ver works.controller.ts), así que el alta mínima pide esos campos también; el resto
// (año, tipo, descripción, capítulos, pdf) se completa después en WorkForm
const NewWorkForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [currentAuthors, setCurrentAuthors] = useState<AuthorType[]>([])
  const [currentLicense, setCurrentLicense] = useState<WorkType['license']>("dominio-publico")

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      sourceUrl: '',
      sourceLabel: '',
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = async (payload) => {
    if (currentAuthors.length === 0) {
      toast.error("Elegí al menos un autor")
      return
    }
    setLoading(true)
    const { data, error }: iResponseOne<WorkType> = await createWork({
      title: payload.title,
      sourceUrl: payload.sourceUrl,
      sourceLabel: payload.sourceLabel,
      license: currentLicense,
      authors: currentAuthors.map((author) => author._id),
    })
    if (error) {
      toast.error(error.message)
    }
    if (data) {
      toast.success("Obra creada correctamente")
      router.push(`/works/${data._id}`)
      return
    }
    setLoading(false)
    setShowForm(false)
    router.refresh()
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="bg-white p-4 rounded-lg shadow">
        {showForm ? (
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Título"
              id="title"
              type="text"
              register={register}
              required={true}
              disabled={loading}
              errors={errors}
              placeHolder="Título de la obra"
            />
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Autores</label>
              <AuthorSelector
                authors={currentAuthors}
                descriptions={[]}
                onChange={(authors) => setCurrentAuthors(authors)}
              />
            </div>
            <Input
              label="URL de la fuente"
              id="sourceUrl"
              type="text"
              register={register}
              required={true}
              disabled={loading}
              errors={errors}
              placeHolder="https://..."
            />
            <Input
              label="Atribución de la fuente"
              id="sourceLabel"
              type="text"
              register={register}
              required={true}
              disabled={loading}
              errors={errors}
              placeHolder="Ej: Marxists Internet Archive (marxists.org)"
            />
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Licencia</label>
              <Select
                options={LICENSE_OPTIONS}
                value={LICENSE_OPTIONS.find((o) => o.value === currentLicense) ?? null}
                onChange={(val) => val && setCurrentLicense((val as { value: WorkType['license'] }).value)}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" fullWidth disabled={loading} loading={loading}>
                CREAR
              </Button>
              <Button type="button" danger disabled={loading} onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <Button type="button" fullWidth disabled={loading} onClick={() => setShowForm(true)}>
            + NUEVA OBRA
          </Button>
        )}
      </div>
    </div>
  )
}

export default NewWorkForm
