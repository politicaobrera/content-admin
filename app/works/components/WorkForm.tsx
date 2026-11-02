'use client'

import React, { useRef, useState } from "react"
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
import TextArea from "@/app/components/inputs/TextArea"
import Separator from "@/app/components/layout/Separator"
import ActionButtonsContainer from "@/app/components/layout/ActionButtonsContainer"
import AuthorSelector from "@/app/components/authors/AuthorSelector"
import TagSelector from "@/app/components/tags/TagSelector"
import { AuthorType } from "@/app/types/author"
import { TagType } from "@/app/types/tag"
import { OptionType } from "@/app/types/select"
import { WorkChapterType, WorkKind, WorkType } from "@/app/types/work"
import useWork from "../hooks/useWork"
import ChapterEditor from "./ChapterEditor"
import WorkPdfUpload, { WorkPdfUploadHandle } from "./WorkPdfUpload"

interface WorkFormProps {
  work: WorkType
}

const KIND_OPTIONS: { value: WorkKind; label: string }[] = [
  { value: "libro", label: "Libro" },
  { value: "carta", label: "Carta" },
  { value: "ensayo", label: "Ensayo" },
  { value: "manuscrito", label: "Manuscrito" },
  { value: "articulo", label: "Artículo" },
  { value: "otro", label: "Texto" },
]

const LICENSE_OPTIONS: { value: WorkType['license']; label: string }[] = [
  { value: "dominio-publico", label: "Dominio público" },
  { value: "cc-by-sa", label: "CC BY-SA" },
]

const WorkForm: React.FC<WorkFormProps> = ({ work }) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const pdfRef = useRef<WorkPdfUploadHandle>(null)
  const [currentAuthors, setCurrentAuthors] = useState<AuthorType[]>(work.authors)
  const [currentTags, setCurrentTags] = useState<TagType[]>(work.tags)
  const [currentKind, setCurrentKind] = useState<WorkKind>(work.kind)
  const [currentChapters, setCurrentChapters] = useState<WorkChapterType[]>(work.chapters)
  const [currentLicense, setCurrentLicense] = useState<WorkType['license']>(work.license)
  const { edit } = useWork()

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues: {
      title: work.title,
      year: work.year || "",
      description: work.description || "",
      sourceUrl: work.sourceUrl,
      sourceLabel: work.sourceLabel,
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = async (payload) => {
    setLoading(true)
    const resolvedPdfUrl = await pdfRef.current?.resolvePdfUrl() ?? work.pdfUrl ?? undefined
    const merged: WorkType = Object.assign(
      work,
      payload,
      {
        authors: currentAuthors,
        tags: currentTags,
        kind: currentKind,
        license: currentLicense,
        chapters: currentChapters,
        pdfUrl: resolvedPdfUrl,
      },
    )
    const result = await edit(merged)
    if (result.error) {
      toast.error(result.error.message)
    }
    if (result.data) {
      toast.success("Obra editada correctamente")
    }
    setLoading(false)
    router.refresh()
  }

  const handleAuthorChange = (authors: AuthorType[]) => {
    setCurrentAuthors(authors)
  }

  const handleCancel = () => {
    router.push(`/works`)
  }

  const currentKindOption = KIND_OPTIONS.find((o) => o.value === currentKind) ?? null

  return (
    <div className="mt-8 mx-4">
      <div className="bg-white px-4 py-8 sm:rounded-lg sm:px-10 shadow max-w-6xl xl:max-w-screen-2xl">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <ActionButtonsContainer>
              <Button type="submit" loading={loading}>
                GUARDAR
              </Button>
              <Button danger disabled={loading} onClick={handleCancel}>
                Cancelar
              </Button>
            </ActionButtonsContainer>
            <Separator heading label="Título" />
            <Input
              id="title"
              type="text"
              register={register}
              key={`work-title-${work._id}`}
              required={true}
              disabled={loading}
              errors={errors}
              placeHolder="Título de la obra"
              large
            />
          </div>

          <Separator heading label="Autores" />
          <AuthorSelector
            authors={work.authors}
            descriptions={[]}
            onChange={handleAuthorChange}
          />

          <Separator heading label="Año y tipo" />
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                label="Año"
                id="year"
                type="text"
                register={register}
                key={`work-year-${work._id}`}
                disabled={loading}
                errors={errors}
                placeHolder="Ej: 1848, o 1843-1844"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Tipo</label>
              <Select
                options={KIND_OPTIONS}
                value={currentKindOption}
                onChange={(val) => val && setCurrentKind((val as OptionType).value as WorkKind)}
                placeholder="Seleccionar..."
              />
            </div>
          </div>

          <Separator heading label="Descripción" />
          <TextArea
            label="Descripción"
            id="description"
            register={register}
            key={`work-description-${work._id}`}
            disabled={loading}
            errors={errors}
            placeHolder="Descripción breve de la obra (opcional)"
            rows={3}
          />

          <Separator heading label="PDF de la obra" />
          <WorkPdfUpload
            ref={pdfRef}
            id="work-pdf"
            pdfUrl={work.pdfUrl ?? null}
            fileName={work.slug}
          />

          <Separator heading label="Capítulos" />
          <ChapterEditor
            chapters={currentChapters}
            onChange={setCurrentChapters}
          />

          <Separator heading label="Etiquetas" />
          <TagSelector
            onChange={setCurrentTags}
            currentTags={currentTags}
          />

          <Separator heading label="Fuente y licencia" />
          <Input
            label="URL de la fuente"
            id="sourceUrl"
            type="text"
            register={register}
            key={`work-sourceUrl-${work._id}`}
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
            key={`work-sourceLabel-${work._id}`}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder='Ej: Marxists Internet Archive (marxists.org) — transcripción: ...'
          />
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Licencia</label>
            <Select
              options={LICENSE_OPTIONS}
              value={LICENSE_OPTIONS.find((o) => o.value === currentLicense) ?? null}
              onChange={(val) => val && setCurrentLicense((val as { value: WorkType['license'] }).value)}
              placeholder="Seleccionar..."
            />
          </div>

          <ActionButtonsContainer>
            <Button type="submit" loading={loading}>
              GUARDAR
            </Button>
            <Button danger disabled={loading} onClick={handleCancel}>
              Cancelar
            </Button>
          </ActionButtonsContainer>
        </form>
      </div>
    </div>
  )
}

export default WorkForm
