'use client'

import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import Select from 'react-select'
import { toast } from "react-hot-toast"
import Button from "@/app/components/Button"
import Input from "@/app/components/inputs/Input"
import Separator from "@/app/components/layout/Separator"
import ActionButtonsContainer from "@/app/components/layout/ActionButtonsContainer"
import { IssueStatus, IssueType } from "@/app/types/issue"
import { ArticleType } from "@/app/types/article"
import { ResourceOrigin, ResourceSourceType } from "@/app/types/resource"
import ResourceSelector, { ResourceSelectorHandle } from "@/app/resources/components/ResourceSelector"
import useIssue from "../hooks/useIssue"
import IssueArticleSelector from "./IssueArticleSelector"

interface IssueFormProps {
  publicationId: string
  publicationSlug: string
  issue?: IssueType
}

const statusOptions = [
  { value: IssueStatus.Draft, label: "Borrador" },
  { value: IssueStatus.Published, label: "Publicado" },
];

const toDateInputValue = (value?: string) => {
  if (!value) return ""
  return new Date(value).toISOString().split("T")[0]
}

const IssueForm:React.FC<IssueFormProps> = ({publicationId, publicationSlug, issue}) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [currentArticles, setCurrentArticles] = useState<Partial<ArticleType>[]>(issue?.articles ?? [])
  const coverImageRef = useRef<ResourceSelectorHandle>(null)
  const pdfRef = useRef<ResourceSelectorHandle>(null)
  const {create, edit} = useIssue();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues>({
    defaultValues:{
      number: issue?.number ?? "",
      description: issue?.description || "",
      coverImageCaption: issue?.coverImage?.caption || "",
      headerKicker: issue?.headerKicker || "",
      headerSubtitle: issue?.headerSubtitle || "",
      publishDate: toDateInputValue(issue?.publishDate),
      status: issue?.status || IssueStatus.Draft,
    },
  })

  const currentNumber = watch("number")
  const issueFileName = `${publicationSlug}-numero-${currentNumber || issue?.number || ""}`

  const onSubmit:SubmitHandler<FieldValues> = async (payload) => {
    setLoading(true)
    const {coverImageCaption, ...rest} = payload
    const [coverImageSrc, pdfUrl] = await Promise.all([
      coverImageRef.current?.resolveUrl() ?? Promise.resolve(issue?.coverImage?.src || ""),
      pdfRef.current?.resolveUrl() ?? Promise.resolve(issue?.pdfUrl || ""),
    ])
    const merged: Partial<IssueType> = Object.assign(
      rest,
      {
        publicationId,
        number: Number(payload.number),
        coverImage: coverImageSrc ? {src: coverImageSrc, caption: coverImageCaption} : undefined,
        pdfUrl,
        articles: currentArticles.map(a => ({_id: a._id})),
      }
    )

    if (issue) {
      const mergedIssue:IssueType = Object.assign(
        issue,
        merged,
      )
      edit(mergedIssue).then(result => {
        if (result.error){
          toast.error(result.error.message)
        }
        if(result.data){
          toast.success("Número editado correctamente")
          router.refresh()
        }
      })
      setLoading(false)
      return
    }
    create(merged as IssueType).then(result => {
      if (result.error){
        toast.error(result.error.message)
      }
      if(result.data){
        toast.success("Número creado correctamente")
        router.push(`/publicaciones/${publicationId}/numeros/${result.data._id}`)
      }
    })
    setLoading(false)
  }

  const handleCancel = () => {
    router.push(`/publicaciones/${publicationId}/numeros`);
  };

  return (
    <div
      className="
        mt-8
        mx-4
      "
    >
      <div
        className="
          bg-white
          px-4
          py-8
          rounded-lg
          shadow
        "
      >
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Número"
            id="number"
            type="number"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="1"
          />
          <Input
            label="Descripción"
            id="description"
            type="text"
            register={register}
            disabled={loading}
            errors={errors}
            placeHolder="Descripción del número"
          />
          <Input
            label="Texto destacado (kicker)"
            id="headerKicker"
            type="text"
            register={register}
            disabled={loading}
            errors={errors}
            placeHolder='Ej: "INTERNACIONALISMO N°6"'
          />
          <Input
            label="Subtítulo"
            id="headerSubtitle"
            type="text"
            register={register}
            disabled={loading}
            errors={errors}
            placeHolder='Ej: "Segunda época de En Defensa del Marxismo"'
          />
          <Input
            label="Fecha de publicación"
            id="publishDate"
            type="date"
            register={register}
            disabled={loading}
            errors={errors}
          />
          <div className="flex flex-col gap-2">
            <label
              className="
                block
                text-sm
                text-gray-900
                font-medium
                leading-6
              "
              htmlFor="status"
            >
              Estado
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={statusOptions}
                  placeholder="Selecciona un estado"
                  value={statusOptions.find((opt) => opt.value === field.value) || null}
                  onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : IssueStatus.Draft)}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h5>Portada (opcional)</h5>
            <ResourceSelector
              ref={coverImageRef}
              sourceType={ResourceSourceType.Image}
              src={issue?.coverImage?.src || ""}
              fileName={`${issueFileName}-portada`}
              origin={ResourceOrigin.Publications}
              deferUpload
            />
            <Input
              label="Descripción de la imagen"
              id="coverImageCaption"
              type="text"
              register={register}
              disabled={loading}
              errors={errors}
              placeHolder="Descripción de la portada"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h5>PDF</h5>
            <ResourceSelector
              ref={pdfRef}
              sourceType={ResourceSourceType.Document}
              src={issue?.pdfUrl || ""}
              fileName={`${issueFileName}-pdf`}
              origin={ResourceOrigin.Publications}
              deferUpload
            />
          </div>
          <Separator />
          <IssueArticleSelector
            currentArticles={currentArticles}
            onChange={setCurrentArticles}
          />
          <Separator />
          <ActionButtonsContainer>
            <Button
              type="submit"
              disabled={loading}
            >
              {
                loading ? 'Loading' : 'Guardar'
              }
            </Button>
            <Button
              danger
              disabled={loading}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          </ActionButtonsContainer>
        </form>
      </div>
    </div>
  )
}

export default IssueForm
