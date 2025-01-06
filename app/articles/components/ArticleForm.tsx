'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { 
  FieldValues,
  SubmitHandler,
  useForm
} from "react-hook-form"
import Button from "@/app/components/Button"
import Input from "@/app/components/inputs/Input"
import { ArticleType } from "@/app/types/article"
import Separator from "@/app/components/Separator"
import useArticleHook from "../hooks/useArticleHook"
import MainImage from "@/app/components/image/MainImage"
import Wysiwyg from "@/app/components/inputs/Wysiwyg"
import ArticlePreview from "./Preview/ArticlePreview"
import TextArea from "@/app/components/inputs/TextArea"
import { MainImageType } from "@/app/types/image"
import AuthorSelector from "@/app/components/authors/AuthorSelector"
import { AuthorType } from "@/app/types/author"
import SectionSelector from "@/app/components/sections/SectionSelector"
import { Section } from "@/app/types/sections"

interface ArticleFormProps {
  article: ArticleType
}

const ArticleForm:React.FC<ArticleFormProps> = ({article}) => {
  // console.log("articulo con data", article)
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [mainImage, _] = useState<MainImageType|undefined>(article.image ?? undefined)
  const [currentAuthors, setCurrentAuthors] = useState<AuthorType[]>(article.authors)
  const [currentDescriptions, setCurrentDescriptions] = useState<string[]>(article.authorsDescriptions)
  const [currentSection, setCurrentSection] = useState<Section|null>(article.section)

  const {edit} = useArticleHook();

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
      title: article.title,
      volanta: article.volanta || "",
      subhead: article.subhead || "",
      content: article.content || "",
    }
  })

  const handleMainImage = async (img:MainImageType) => {
    console.log("old article", article)
    console.log("voy a updatear imagen", img)
    const merged:ArticleType = Object.assign(article, {image: img})
    edit(merged).then(result => {
      if (result.error){
        toast.error(result.error.message)
      } 
      if(result.data){
        toast.success("Imagen Nota actualizada correctamente")
      }
    })
    router.refresh()
  }

  const onSubmit:SubmitHandler<FieldValues> = (payload) => {
    setLoading(true)
    console.log("voy a guardar", payload)
    console.log("old article", article)
    const merged:ArticleType = Object.assign(
      article,
      payload,
      {image: mainImage},
      {
        authors: currentAuthors,
        authorsDescriptions: currentDescriptions
      },
      {
        section: currentSection?._id || null
      }
    )
    console.log("merged", merged)
    edit(merged).then(result => {
      if (result.error){
        toast.error(result.error.message)
      } 
      if(result.data){
        toast.success("Nota editada correctamente")
        // router.push('/main')
      }
    })
    setLoading(false)
    // push to list todo
    router.refresh()
  }

  const handleAuthorChange = (authors:AuthorType[], descriptions:string[]) => {
    setCurrentAuthors(authors)
    setCurrentDescriptions(descriptions)
  }

  const handleSectionChange = (section:Section) => {
    console.log("section changed", section)
    setCurrentSection(section)
  }

  const handleCancel = () => {
    router.push(`/articles`);
  };

  const currentValues = watch() as ArticleType
  // console.log("currentValues", currentValues)
  return (
    <div
      className="
        mt-8
        sm:mx-auto
      "
    >
      <div
        className="
          bg-white
          px-4
          py-8
          sm:rounded-lg
          sm:px-10
          shadow
          max-w-6xl
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
            key={`article-title-${article._id}`}
            required={true}
            disabled={loading}
            errors={errors}
            placeHolder="Título de la nota"
          />
          <Separator />
          <MainImage 
            id="main-image"
            onUpload={handleMainImage}
            fileName={article.slug}
            image={mainImage}
          />
          <Separator />
          <SectionSelector
            onChange={handleSectionChange}
            currentSection={currentSection}
          />
          <Separator />
          <AuthorSelector
            authors={article.authors}
            descriptions={article.authorsDescriptions}
            onChange={handleAuthorChange}
          />
          <Separator />
          <Input
            label="Volanta"
            id="volanta"
            type="text"
            register={register}
            key={`article-volanta-${article._id}`}
            disabled={loading}
            errors={errors}
            placeHolder="Volanta"
          />
          <TextArea
            label="Bajada"
            id="subhead"
            register={register}
            key={`article-subhead-${article._id}`}
            disabled={loading}
            errors={errors}
            placeHolder="Bajada"
            rows={3}
          />
          <Wysiwyg
            label="Contenido"
            id="content"
            control={control}
            errors={errors}
            required={true}
            placeHolder="Cuerpo de la nota..."
          />
          <Separator />
          <div className="space-y-2">
            <Button
              type="submit"
              fullWidth
              disabled={loading}
            >
              GUARDAR
            </Button>
            <Button
              fullWidth
              danger
              disabled={loading}
              onClick={handleCancel}
            >
              {
                loading ? 'Loading' : 'Cancelar'
              }
            </Button>            
          </div>
        </form>
        <Separator />
        <h2
          className="
            mt-6
            text-center
            text-xl
          text-black
            tracking-tight
            font-bold
            py-2
          "
        >Previsualizacion</h2>
        <ArticlePreview
          article={{...currentValues, section: currentSection!, authors: currentAuthors, authorsDescriptions: currentDescriptions}}
          mainImage={mainImage}
        />
      </div>
    </div>
  )
}

export default ArticleForm