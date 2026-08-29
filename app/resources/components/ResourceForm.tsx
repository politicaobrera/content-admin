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
import { ExternalSource, ResourceSourceType, ResourceType } from "@/app/types/resource"
import useResource from "../hooks/useResource"
import ActionButtonsContainer from "@/app/components/layout/ActionButtonsContainer"
import TagSelector from "@/app/components/tags/TagSelector"
import { TagType } from "@/app/types/tag"
import ResourceSelector from "./ResourceSelector"
import ExternalSourcesEditor from "./ExternalSourcesEditor"
import { useClipboard } from "@/app/hooks/useClipboard"

interface ResourceFormProps {
  resource?: ResourceType
}

const options = [
  { value: ResourceSourceType.Image, label: "Imágen" },
  { value: ResourceSourceType.Video, label: "Video" },
  { value: ResourceSourceType.Audio, label: "Audio" },
  { value: ResourceSourceType.Document, label: "Documento" },
];

const ResourceForm:React.FC<ResourceFormProps> = ({resource}) => {
  const { copyToClipboard } = useClipboard()
  console.log("recurso con data", resource)
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [currentTags, setCurrentTags] = useState<TagType[]>(resource?.tags || [])
  const [currentUrl, setCurrentUrl] = useState<string>(resource?.src || "")
  const [currentExternalSources, setCurrentExternalSources] = useState<ExternalSource[]>(resource?.externalSources || [])
  const {create, edit} = useResource();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: {
      errors,
    } 
  } = useForm<FieldValues | {title: string}>({
    defaultValues:{
      title: resource?.title || "",
      sourceType: resource?.sourceType || ResourceSourceType.Image,
      caption: resource?.caption || "",
      src: resource?.src || ""
    },
  })

  const onSubmit:SubmitHandler<FieldValues | ResourceType> = (payload) => {
    setLoading(true)
    const merged: Partial<ResourceType> = Object.assign(
      payload,
      {
        tags: currentTags
      },
      {
        src: currentUrl
      },
      {
        externalSources: currentExternalSources
      }
    )
    console.log("voy a guardar resource", merged)
    
    if (resource) {
      // edit
      console.log("old resource", resource)
      const mergedResource:ResourceType = Object.assign(
        resource,
        merged,
      )
      console.log("edit merged", mergedResource)
      edit(mergedResource).then(result => {
        if (result.error){
          toast.error(result.error.message)
        } 
        if(result.data){
          toast.success("Recurso editado correctamente")
          router.refresh()
        }
      })
      setLoading(false)
      return
    }
    create(merged as ResourceType).then(result => {
      if (result.error){
        toast.error(result.error.message)
      } 
      if(result.data){
        toast.success("Recurso creado correctamente")
        router.refresh()
      }
    })
    setLoading(false)
  }

  const handleResourceFileChange = async (url:string) => {
    setCurrentUrl(url)
  }

  const handleCancel = () => {
    router.push(`/resources`);
  };

  const handleCopyCurrentUrl = async () => {
    if (!currentUrl) return
    const success = await copyToClipboard(currentUrl)
    if (success) {
      toast.success("Enlace copiado al portapapeles")
      return
    } 
    toast.error("No se pudo copiar el enlace")

  }

  const currentValues = watch() as ResourceType

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
            label="Título"
            id="title"
            type="text"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="Título del recurso"
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
              htmlFor={"sourceType"}
            >
              Tipo
            </label>
            <Controller
              name="sourceType"
              control={control}
              //rules={{ required: "Selecciona un tipo de fuente" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={options}
                  placeholder="Selecciona un tipo"
                  isClearable
                  value={options.find((opt) => opt.value === field.value) || null}
                  onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : "")}
                />
              )}
            />
          </div>
          <ResourceSelector
            sourceType={currentValues.sourceType}
            src={currentUrl}
            fileName={currentValues.title}
            onChange={handleResourceFileChange}
          />
          <div className="flex flex-col gap-2">
            <label className="block text-sm text-gray-900 font-medium leading-6" htmlFor="external-url">
              O pegá directamente una URL existente (ej: video ya subido a YouTube), en vez de subir un archivo
            </label>
            <div className="flex gap-2">
              <input
                id="external-url"
                type="text"
                placeholder="https://youtube.com/..."
                className="border-2 p-1 flex-1"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
              />
              <button
                type="button"
                className="underline text-sm"
                onClick={handleCopyCurrentUrl}
                disabled={!currentUrl}
              >
                Copiar
              </button>
            </div>
          </div>
          <Separator />
          <ExternalSourcesEditor
            sources={currentExternalSources}
            onChange={setCurrentExternalSources}
          />
          <Input
            label="Leyenda"
            id="caption"
            type="text"
            register={register}
            disabled={loading}
            errors={errors}
            placeHolder="Leyenda del recurso"
          />

          <TagSelector
            currentTags={currentTags}
            onChange={(newTags) => setCurrentTags(newTags)}
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
              {
                loading ? 'Loading' : 'Cancelar'
              }
            </Button>
          </ActionButtonsContainer>
          <Separator />
          <h5>Link</h5>
          <span>{resource?.src}</span>
        </form>
      </div>
    </div>
  )
}

export default ResourceForm