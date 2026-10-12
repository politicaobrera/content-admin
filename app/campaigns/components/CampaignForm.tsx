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
import TextArea from "@/app/components/inputs/TextArea"
import Separator from "@/app/components/layout/Separator"
import ActionButtonsContainer from "@/app/components/layout/ActionButtonsContainer"
import Toggle from "@/app/components/inputs/Toggle"
import ImportantMessage from "@/app/components/ImportantMessage"
import { CampaignStatus, CampaignType } from "@/app/types/campaign"
import { ArticleType } from "@/app/types/article"
import { ResourceType } from "@/app/types/resource"
import { EventType } from "@/app/types/event"
import CampaignLookupPanel from "./CampaignLookupPanel"
import useCampaign from "../hooks/useCampaign"

interface CampaignFormProps {
  campaign?: CampaignType
}

const CampaignForm: React.FC<CampaignFormProps> = ({ campaign }) => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [currentStatus, setCurrentStatus] = useState<boolean>(campaign?.status === CampaignStatus.Published)
  const [currentIsActive, setCurrentIsActive] = useState<boolean>(campaign?.isActive ?? false)
  const [currentRelatedArticles, setCurrentRelatedArticles] = useState<Partial<ArticleType>[]>(campaign?.relatedArticles || [])
  const [currentRelatedResources, setCurrentRelatedResources] = useState<Partial<ResourceType>[]>(campaign?.relatedResources || [])
  const [currentRelatedEvents, setCurrentRelatedEvents] = useState<Partial<EventType>[]>(campaign?.relatedEvents || [])
  const { edit, create } = useCampaign()

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm<FieldValues | CampaignType>({
    defaultValues: {
      title: campaign?.title || "",
      description: campaign?.description || "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues | CampaignType> = async (payload) => {
    setLoading(true)
    const merged: Partial<CampaignType> = Object.assign(
      {},
      payload,
      {
        relatedArticles: currentRelatedArticles,
        relatedResources: currentRelatedResources,
        relatedEvents: currentRelatedEvents,
        status: currentStatus ? CampaignStatus.Published : CampaignStatus.Draft,
        // una campaña en borrador nunca puede quedar activa — mismo resguardo que ya
        // aplica el backend, reflejado acá para que el toggle no mienta en pantalla
        isActive: currentStatus ? currentIsActive : false,
      }
    )

    if (campaign) {
      const merged_campaign: Partial<CampaignType> = Object.assign({}, campaign, merged, { _id: campaign._id })
      edit(merged_campaign).then(result => {
        if (result.error) {
          toast.error(result.error.message)
        }
        if (result.data) {
          toast.success("Campaña editada correctamente")
          router.refresh()
        }
      })
      setLoading(false)
      return
    }

    create(merged as CampaignType).then(result => {
      if (result.error) {
        toast.error(result.error.message)
      }
      if (result.data) {
        toast.success("Campaña creada correctamente")
        router.push('/campaigns')
      }
    })
    setLoading(false)
  }

  const handleCancel = () => {
    router.push(`/campaigns`);
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
            placeHolder="Título de la campaña"
          />

          <TextArea
            label="Descripción"
            id="description"
            register={register}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="Descripción de la campaña"
            rows={4}
          />

          <Separator />

          {campaign ? (
            <CampaignLookupPanel
              relatedArticles={currentRelatedArticles}
              relatedResources={currentRelatedResources}
              relatedEvents={currentRelatedEvents}
              onChangeRelatedArticles={setCurrentRelatedArticles}
              onChangeRelatedResources={setCurrentRelatedResources}
              onChangeRelatedEvents={setCurrentRelatedEvents}
            />
          ) : (
            <ImportantMessage message="Guardá la campaña primero para poder vincular notas, recursos y eventos relacionados." />
          )}

          <Separator />
          <div className="my-5 flex flex-col gap-4 items-start flex-wrap">
            <div className="flex flex-col gap-2 items-start">
              <h5>Estado</h5>
              <div className="flex gap-3">
                <Toggle
                  labelConfig={{ isChecked: 'Publicada', isNotChecked: 'Borrador' }}
                  value={currentStatus}
                  disabled={false}
                  onChange={(val) => {
                    setCurrentStatus(val)
                    // al volver a borrador, se desactiva junto con el status — no tiene
                    // sentido una campaña activa que no está publicada
                    if (!val) setCurrentIsActive(false)
                  }}
                />
                <ImportantMessage message="Recordá revisar bien la campaña antes de publicarla." />
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start">
              <h5>Actividad</h5>
              <div className="flex gap-3">
                <Toggle
                  labelConfig={{ isChecked: 'Activa', isNotChecked: 'Finalizada' }}
                  value={currentIsActive}
                  disabled={!currentStatus}
                  onChange={setCurrentIsActive}
                />
                {!currentStatus && (
                  <ImportantMessage message="Publicá la campaña para poder marcarla como activa." />
                )}
              </div>
            </div>
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

export default CampaignForm
