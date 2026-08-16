'use client'

import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { 
  FieldValues,
  SubmitHandler,
  useForm
} from "react-hook-form"


import dynamic from 'next/dynamic';
const BlockNoteEditor = dynamic(() => import('@/app//components/inputs/BlockNoteEditor'), { ssr: false });
const SectionSelector = dynamic(
  () => import('@/app/components/sections/SectionSelector'),
  { ssr: false }
);

import Button from "@/app/components/Button"
import Input from "@/app/components/inputs/Input"
import { ArticleStatus, ArticleType } from "@/app/types/article"
import Separator from "@/app/components/layout/Separator"
import useArticle from "../hooks/useArticle"
import MainImage, { MainImageHandle } from "@/app/components/image/MainImage"
//import Wysiwyg from "@/app/components/inputs/Wysiwyg"
import ArticlePreview from "./Preview/ArticlePreview"
import TextArea from "@/app/components/inputs/TextArea"
import AuthorSelector from "@/app/components/authors/AuthorSelector"
import { AuthorType } from "@/app/types/author"
//import SectionSelector from "@/app/components/sections/SectionSelector"
import { Section } from "@/app/types/sections"
import ActionButtonsContainer from "@/app/components/layout/ActionButtonsContainer"
import TagSelector from "@/app/components/tags/TagSelector"
import ContentLookupPanel from "./ContentLookupPanel"
import { TagType } from "@/app/types/tag"
import Toggle from "@/app/components/inputs/Toggle"
import ImportantMessage from "@/app/components/ImportantMessage"
//import BlockNoteEditor from "@/app/components/inputs/BlockNoteEditor"

interface ArticleFormProps {
  article: ArticleType
}

const ArticleForm:React.FC<ArticleFormProps> = ({article}) => {
  console.log("articulo con data", article)
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const mainImageRef = useRef<MainImageHandle>(null)
  const [currentAuthors, setCurrentAuthors] = useState<AuthorType[]>(article.authors)
  const [currentDescriptions, setCurrentDescriptions] = useState<string[]>(article.authorsDescriptions)
  const [currentSection, setCurrentSection] = useState<Section|null>(article.section)
  const [currentTags, setCurrentTags] = useState<TagType[]>(article.tags)
  const [currentStatus, setCurrentStatus] = useState<boolean>(article.status === ArticleStatus.Published)
  const [currentContent, setCurrentContent] = useState<string>(article.content)
  const {edit} = useArticle();

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
      //content: article.content || "",
    }
  })

  const onSubmit:SubmitHandler<FieldValues> = async (payload) => {
    setLoading(true)
    const resolvedImage = await mainImageRef.current?.resolveImage() ?? article.image ?? undefined
    const merged:ArticleType = Object.assign(
      article,
      payload,
      {image: resolvedImage ?? undefined},
      {
        authors: currentAuthors,
        authorsDescriptions: currentDescriptions
      },
      {
        section: currentSection?._id || null
      },
      {
        content: currentContent
      },
      {
        tags: currentTags
      },
      {
        status: currentStatus ? ArticleStatus.Published : ArticleStatus.Draft
      }
    )
    const result = await edit(merged)
    if (result.error){
      toast.error(result.error.message)
    }
    if(result.data){
      toast.success("Nota editada correctamente")
    }
    setLoading(false)
    router.refresh()
  }

  const handleAuthorChange = (authors:AuthorType[], descriptions:string[]) => {
    setCurrentAuthors(authors)
    setCurrentDescriptions(descriptions)
  }

  const handleSectionChange = (section:Section|null) => {
    console.log("section changed", section)
    setCurrentSection(section)
  }

  const handleCancel = () => {
    router.push(`/articles`);
  };

  const currentValues = watch() as ArticleType
  const isNotReadyForPublish = !currentSection?._id || currentValues.title.trim() === "" ? true : false //currentValues.content.trim() === ""

  //console.log("currentContent", currentContent)

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
          sm:rounded-lg
          sm:px-10
          shadow
          max-w-6xl
          xl:max-w-screen-2xl
        "
      >
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <ActionButtonsContainer>
              <Button
                type="submit"
                disabled={loading}
              >
                GUARDAR
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
            <Input
              id="title"
              label="Título"
              type="text"
              register={register}
              key={`article-title-${article._id}`}
              required={true}
              disabled={loading}
              errors={errors}
              placeHolder="Título de la nota"
            />
          </div>
          <Separator />
          <MainImage
            ref={mainImageRef}
            id="main-image"
            label="Imagen principal"
            fileName={article.slug}
            image={article.image}
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
          <Separator />
          {/* <Wysiwyg
            label="Contenido"
            id="content"
            control={control}
            errors={errors}
            required={true}
            placeHolder="Cuerpo de la nota..."
          /> */}
          <BlockNoteEditor 
            label="Contenido"
            id="content"
            initialHTML={currentContent}
            onChange={(html:string) => setCurrentContent(html)}
          />
          <Separator />
          <ContentLookupPanel excludeArticleId={article._id} />
          <Separator />
          <TagSelector
            onChange={(newTags) => setCurrentTags(newTags)}
            currentTags={currentTags}
          />
          <ActionButtonsContainer>
            <Button
              type="submit"
              disabled={loading}
            >
              GUARDAR
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
          article={{...currentValues, section: currentSection!, authors: currentAuthors, authorsDescriptions: currentDescriptions, tags: currentTags, content: currentContent}}
          mainImage={article.image}
        />
        <Separator />
        <div className="my-5 flex flex-col gap-2 items-start flex-wrap">
          <h5>Estado</h5>
          <div className="flex gap-3">
            <Toggle
              labelConfig={{isChecked: 'Publicada', isNotChecked: 'Borrador'}}
              value={article.status === "published"}
              disabled={article.status === ArticleStatus.Published || isNotReadyForPublish}
              onChange={(val) => setCurrentStatus(val)}
            />
            <ImportantMessage message="Recuerda siempre revisar bien la nota antes de publicar!" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleForm