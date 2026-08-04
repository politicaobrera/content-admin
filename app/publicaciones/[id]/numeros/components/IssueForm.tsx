'use client'

import React, { useState } from "react"
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
import { ResourceSourceType } from "@/app/types/resource"
import ResourceSelector from "@/app/resources/components/ResourceSelector"
import useIssue from "../hooks/useIssue"
import IssueArticleSelector from "./IssueArticleSelector"

interface IssueFormProps {
  publicationId: string
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

const IssueForm:React.FC<IssueFormProps> = ({publicationId, issue}) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [currentCoverImageSrc, setCurrentCoverImageSrc] = useState<string>(issue?.coverImage?.src || "")
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string>(issue?.pdfUrl || "")
  const [currentArticles, setCurrentArticles] = useState<Partial<ArticleType>[]>(issue?.articles ?? [])
  const {create, edit} = useIssue();

  const {
    register,
    control,
    handleSubmit,
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

  const onSubmit:SubmitHandler<FieldValues> = (payload) => {
    setLoading(true)
    const {coverImageCaption, ...rest} = payload
    const merged: Partial<IssueType> = Object.assign(
      rest,
      {
        publicationId,
        number: Number(payload.number),
        coverImage: currentCoverImageSrc ? {src: currentCoverImageSrc, caption: coverImageCaption} : undefined,
        pdfUrl: currentPdfUrl,
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
              sourceType={ResourceSourceType.Image}
              src={currentCoverImageSrc}
              onChange={setCurrentCoverImageSrc}
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
              sourceType={ResourceSourceType.Document}
              src={currentPdfUrl}
              onChange={setCurrentPdfUrl}
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
