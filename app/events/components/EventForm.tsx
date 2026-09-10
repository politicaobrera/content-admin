'use client'

import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { toast } from "react-hot-toast"
import Button from "@/app/components/Button"
import Input from "@/app/components/inputs/Input"
import TextArea from "@/app/components/inputs/TextArea"
import Separator from "@/app/components/layout/Separator"
import ActionButtonsContainer from "@/app/components/layout/ActionButtonsContainer"
import { EventType } from "@/app/types/event"
import { ResourceSourceType } from "@/app/types/resource"
import ResourceSelector, { ResourceSelectorHandle } from "@/app/resources/components/ResourceSelector"
import useEvent from "../hooks/useEvent"

interface EventFormProps {
  event?: EventType
}

const toDateInputValue = (date?: string) => date ? date.substring(0, 10) : ""

const EventForm:React.FC<EventFormProps> = ({event}) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [currentImage, setCurrentImage] = useState<string>(event?.image || "")
  const imageRef = useRef<ResourceSelectorHandle>(null)
  const {edit, create} = useEvent();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<FieldValues | EventType>({
    defaultValues:{
      title: event?.title || "",
      description: event?.description || "",
      date: toDateInputValue(event?.date),
      place: event?.place || "",
      schedule: event?.schedule || "",
    },
  })

  const onSubmit:SubmitHandler<FieldValues | EventType> = async (payload) => {
    setLoading(true)
    const initialImage = event?.image || ""
    const resolvedImage = await imageRef.current?.resolveUrl()
    const merged: Partial<EventType> = Object.assign(
      {},
      payload,
      {
        image: resolvedImage || initialImage
      }
    )

    if (event) {
      const merged_event:Partial<EventType> = Object.assign({}, event, merged, {_id: event._id})
      edit(merged_event).then(result => {
        if (result.error){
          toast.error(result.error.message)
        }
        if(result.data){
          toast.success("Evento editado correctamente")
          router.refresh()
        }
      })
      setLoading(false)
      return
    }

    create(merged as EventType).then(result => {
      if (result.error){
        toast.error(result.error.message)
      }
      if(result.data){
        toast.success("Evento creado correctamente")
        router.push('/events')
      }
    })
    setLoading(false)
  }

  const handleCancel = () => {
    router.push(`/events`);
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
            label="Título"
            id="title"
            type="text"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="Título del evento"
          />

          <TextArea
            label="Descripción"
            id="description"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="Descripción del evento"
          />

          <Input
            label="Fecha"
            id="date"
            type="date"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
          />

          <Input
            label="Lugar"
            id="place"
            type="text"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="Lugar del evento"
          />

          <Input
            label="Horario"
            id="schedule"
            type="text"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="Ej: 18:00hs"
          />

          <div className="flex flex-col gap-2">
            <label className="block text-sm text-gray-900 font-medium leading-6">
              Imágen
            </label>
            <ResourceSelector
              ref={imageRef}
              sourceType={ResourceSourceType.Image}
              src={currentImage}
              fileName={event?.title || "evento"}
              onChange={setCurrentImage}
              deferUpload
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
        </form>
      </div>
    </div>
  )
}

export default EventForm
