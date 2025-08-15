import { BannerType } from "@/app/types/sitepage"
import useBanner from "../hooks/useBanner"
import Button from "@/app/components/Button"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Input from "@/app/components/inputs/Input"

interface BannerProps {
  item: BannerType | null
  pageName?: string
  onChange: (banner: BannerType) => void
}

const Banner = ({item, onChange, pageName}: BannerProps) => {
  const bannerItem = useBanner(item, pageName)
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    } 
  } = useForm<FieldValues>({
    defaultValues:{
      caption: item?.caption || null,
      link: item?.link || '',
    }
  })

  const onSubmit:SubmitHandler<FieldValues> = async (payload) => {
    console.log(payload)
    let bannerImageUrl = ""
    if (bannerItem.state.banner) {
      bannerImageUrl = bannerItem.state.banner.src
    }
    if (bannerItem.state.isImageReadyForUpload) {
      bannerImageUrl = await bannerItem.actions.onUploadImage()
    }
    if (bannerImageUrl !== "") {
      const newBanner: BannerType = {
        caption: payload.caption,
        link: payload.link,
        src: bannerImageUrl,
        _id: item?._id || undefined,
      }
      onChange(newBanner)
      bannerItem.actions.setCurrentBanner(newBanner)
      bannerItem.actions.setIsEditing(false)
    }
  }

  // factor out con un bannerView
  if (bannerItem.state.banner && !bannerItem.state.isEditing) {
    return (
      <div className="flex flex-col gap-3 border-2 shadow-md w-max p-2">
        <a href={bannerItem.state.banner.link}>
          <img src={bannerItem.state.banner.src} alt={bannerItem.state.banner.caption} className="w-96 h-auto"/>
        </a>
        <div>
          Caption: {bannerItem.state.banner.caption}
        </div>
        <div>
          Link: {bannerItem.state.banner.link}
        </div>
        <div>
          <Button
            onClick={() => bannerItem.actions.setIsEditing(true)}
          >
            Modificar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-3">
        <h6>Imagen</h6>
        <div className="flex flex-col gap-2">
          {bannerItem.state.preview && (
            <div className='mb-2'>
              <img src={bannerItem.state.preview} className="w-96 h-auto"/>
            </div>
          )}
          {!bannerItem.state.preview && bannerItem.state.banner && (
            <div className='mb-2'>
              <img src={bannerItem.state.banner.src} className="w-96 h-auto"/>
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={event => bannerItem.actions.onFileChange(event.target.files?.[0] ?? null)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              danger
              disabled={bannerItem.state.loading || !bannerItem.state.file}
              onClick={() => {
                bannerItem.actions.cleanUploadTemp()
              }}
            >
              {
                bannerItem.state.loading ? 'Cargando' : 'Cancelar'
              }
            </Button>
          </div>
        </div>
        <Input
          label="Leyenda"
          id="caption"
          type="text"
          register={register}
          required={true}
          disabled={bannerItem.state.loading}
          errors={errors}
          placeHolder="Descripción"
        />
        <Input
          label="Link"
          id="link"
          type="text"
          register={register}
          required={false}
          disabled={bannerItem.state.loading}
          errors={errors}
          placeHolder="link al que se dirige al cliquear"
        />
        <div className="flex align-middle justify-start gap-2">
          <Button
            type="submit"
            disabled={bannerItem.state.loading}
          >
            Guardar
          </Button>
          <Button
            danger
            onClick={() => bannerItem.actions.setIsEditing(false)}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </form>
  )

}

export default Banner
