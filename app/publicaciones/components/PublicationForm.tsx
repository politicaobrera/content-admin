'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { toast } from "react-hot-toast"
import Button from "@/app/components/Button"
import Input from "@/app/components/inputs/Input"
import Separator from "@/app/components/layout/Separator"
import ActionButtonsContainer from "@/app/components/layout/ActionButtonsContainer"
import { PublicationType } from "@/app/types/publication"
import { ResourceOrigin, ResourceSourceType } from "@/app/types/resource"
import ResourceSelector from "@/app/resources/components/ResourceSelector"
import usePublication from "../hooks/usePublication"

interface PublicationFormProps {
  publication?: PublicationType
}

const PublicationForm:React.FC<PublicationFormProps> = ({publication}) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>(publication?.logoUrl || "")
  const [currentHeaderBannerUrl, setCurrentHeaderBannerUrl] = useState<string>(publication?.headerBannerUrl || "")
  const {create, edit} = usePublication();

  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
    }
  } = useForm<FieldValues | {name: string, description: string}>({
    defaultValues:{
      name: publication?.name || "",
      description: publication?.description || "",
    },
  })

  const currentName = watch("name")

  const onSubmit:SubmitHandler<FieldValues | PublicationType> = (payload) => {
    setLoading(true)
    const merged: Partial<PublicationType> = Object.assign(
      payload,
      {
        logoUrl: currentLogoUrl,
        headerBannerUrl: currentHeaderBannerUrl,
      }
    )

    if (publication) {
      const mergedPublication:PublicationType = Object.assign(
        publication,
        merged,
      )
      edit(mergedPublication).then(result => {
        if (result.error){
          toast.error(result.error.message)
        }
        if(result.data){
          toast.success("Publicación editada correctamente")
          router.refresh()
        }
      })
      setLoading(false)
      return
    }
    create(merged as PublicationType).then(result => {
      if (result.error){
        toast.error(result.error.message)
      }
      if(result.data){
        toast.success("Publicación creada correctamente")
        router.push(`/publicaciones/${result.data._id}`)
      }
    })
    setLoading(false)
  }

  const handleCancel = () => {
    router.push(`/publicaciones`);
  };

  const handleClickNumeros = () => {
    if (publication) {
      router.push(`/publicaciones/${publication._id}/numeros`)
    }
  }

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
            label="Nombre"
            id="name"
            type="text"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="Nombre de la publicación"
          />
          <Input
            label="Descripción"
            id="description"
            type="text"
            register={register}
            disabled={loading}
            errors={errors}
            placeHolder="Descripción de la publicación"
          />
          <div className="flex flex-col gap-2">
            <h5>Logo</h5>
            <ResourceSelector
              sourceType={ResourceSourceType.Image}
              src={currentLogoUrl}
              fileName={`${currentName}-logo`}
              origin={ResourceOrigin.Publications}
              onChange={setCurrentLogoUrl}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h5>Banner de cabecera</h5>
            <ResourceSelector
              sourceType={ResourceSourceType.Image}
              src={currentHeaderBannerUrl}
              fileName={`${currentName}-banner`}
              origin={ResourceOrigin.Publications}
              onChange={setCurrentHeaderBannerUrl}
            />
          </div>
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
            {publication && (
              <Button
                type="button"
                secondary
                disabled={loading}
                onClick={handleClickNumeros}
              >
                Ver Números
              </Button>
            )}
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

export default PublicationForm
