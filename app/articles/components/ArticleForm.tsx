'use client'

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { 
  FieldValues,
  SubmitHandler,
  useForm
} from "react-hook-form"


import dynamic from 'next/dynamic';
import type { BlockNoteEditorHandle } from '@/app/components/inputs/BlockNoteEditor';
const BlockNoteEditor = dynamic(() => import('@/app//components/inputs/BlockNoteEditor'), { ssr: false });
const SectionSelector = dynamic(
  () => import('@/app/components/sections/SectionSelector'),
  { ssr: false }
);
const ContentLookupPanel = dynamic(() => import('@/app//articles/components/ContentLookupPanel'), { ssr: false });
import KeyIdeasEditor from "./KeyIdeasEditor"

import Button from "@/app/components/Button"
import Input from "@/app/components/inputs/Input"
import { ArticleStatus, ArticleType } from "@/app/types/article"
import Separator from "@/app/components/layout/Separator"
import useArticle from "../hooks/useArticle"
import MainImage, { MainImageHandle } from "@/app/components/image/MainImage"
//import Wysiwyg from "@/app/components/inputs/Wysiwyg"
import ArticlePreviewIframe from "./Preview/ArticlePreviewIframe"
import TextArea from "@/app/components/inputs/TextArea"
import AuthorSelector from "@/app/components/authors/AuthorSelector"
import { AuthorType } from "@/app/types/author"
//import SectionSelector from "@/app/components/sections/SectionSelector"
import { Section } from "@/app/types/sections"
import { ResourceType } from "@/app/types/resource"
import ActionButtonsContainer from "@/app/components/layout/ActionButtonsContainer"
import TagSelector from "@/app/components/tags/TagSelector"
import { TagType } from "@/app/types/tag"
import Toggle from "@/app/components/inputs/Toggle"
import ImportantMessage from "@/app/components/ImportantMessage"
import { formatArgDate } from "@/app/utils/dates"
import useArticleDraft, { ArticleDraftFields } from "../hooks/useArticleDraft"
import useDebouncedValue from "@/app/hooks/useDebouncedValue"
//import BlockNoteEditor from "@/app/components/inputs/BlockNoteEditor"

interface ArticleFormProps {
  article: ArticleType
}

const ArticleForm:React.FC<ArticleFormProps> = ({article}) => {
  console.log("articulo con data", article)
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const mainImageRef = useRef<MainImageHandle>(null)
  const editorRef = useRef<BlockNoteEditorHandle>(null)
  const [currentAuthors, setCurrentAuthors] = useState<AuthorType[]>(article.authors)
  const [currentDescriptions, setCurrentDescriptions] = useState<string[]>(article.authorsDescriptions)
  const [currentSection, setCurrentSection] = useState<Section|null>(article.section)
  const [currentTags, setCurrentTags] = useState<TagType[]>(article.tags)
  const [currentStatus, setCurrentStatus] = useState<boolean>(article.status === ArticleStatus.Published)
  const [currentContent, setCurrentContent] = useState<string>(article.content)
  const [currentRelatedArticles, setCurrentRelatedArticles] = useState<Partial<ArticleType>[]>(article.relatedArticles || [])
  const [currentRelatedResources, setCurrentRelatedResources] = useState<Partial<ResourceType>[]>(article.relatedResources || [])
  const [currentKeyIdeas, setCurrentKeyIdeas] = useState<string[]>(article.keyIdeas || [])
  const [previewImage, setPreviewImage] = useState(article.image)
  const {edit} = useArticle();
  const { pendingDraft, savedAt, save: saveDraft, discardDraft, clearAfterSave } = useArticleDraft(article._id, article.updatedAt)
  const [draftRestored, setDraftRestored] = useState(false)
  // fuerza el remount de BlockNoteEditor al restaurar un draft: el editor solo lee
  // `initialHTML` una vez al montarse, no reacciona a cambios posteriores del prop
  const [editorInstanceKey, setEditorInstanceKey] = useState(0)

  const handleBeforePreview = async () => {
    const resolvedImage = await mainImageRef.current?.resolveImage()
    if (resolvedImage) setPreviewImage(resolvedImage)
  }

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
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
    // una nota publicada no puede quedar sin título/sección/contenido -- el server
    // también lo valida, pero se corta aquí para no esperar el roundtrip
    const isPublished = article.status === ArticleStatus.Published
    const missingRequiredFields = !currentSection?._id || payload.title.trim() === "" || currentContent.trim() === ""
    if (isPublished && missingRequiredFields) {
      toast.error("Esta nota está publicada: no se le puede quitar título, sección o contenido")
      return
    }

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
        relatedArticles: currentRelatedArticles,
        relatedResources: currentRelatedResources
      },
      {
        // se descartan las ideas vacias (el editor pudo agregar un item y dejarlo sin
        // completar antes de guardar) para no publicar bullets en blanco en el sitio
        keyIdeas: currentKeyIdeas.map((idea) => idea.trim()).filter(Boolean)
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
      clearAfterSave()
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
  const isNotReadyForPublish = !currentSection?._id || currentValues.title.trim() === "" || currentContent.trim() === ""

  const draftSnapshot: ArticleDraftFields = {
    title: currentValues.title ?? "",
    volanta: currentValues.volanta ?? "",
    subhead: currentValues.subhead ?? "",
    content: currentContent,
    section: currentSection,
    authors: currentAuthors,
    authorsDescriptions: currentDescriptions,
    tags: currentTags,
    keyIdeas: currentKeyIdeas,
    relatedArticles: currentRelatedArticles,
    relatedResources: currentRelatedResources,
    status: currentStatus,
  }
  const debouncedDraftSnapshot = useDebouncedValue(draftSnapshot, 2000)

  useEffect(() => {
    // no autoguardamos hasta que el editor resuelva el banner de "restaurar
    // borrador" (si no, pisaríamos el draft viejo con los defaults del server)
    if (pendingDraft) return
    saveDraft(debouncedDraftSnapshot)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDraftSnapshot, pendingDraft])

  const handleRestoreDraft = () => {
    if (!pendingDraft) return
    const { fields } = pendingDraft
    setCurrentContent(fields.content)
    setCurrentSection(fields.section)
    setCurrentAuthors(fields.authors)
    setCurrentDescriptions(fields.authorsDescriptions)
    setCurrentTags(fields.tags)
    setCurrentKeyIdeas(fields.keyIdeas)
    setCurrentRelatedArticles(fields.relatedArticles)
    setCurrentRelatedResources(fields.relatedResources)
    setCurrentStatus(fields.status)
    setValue("title", fields.title)
    setValue("volanta", fields.volanta)
    setValue("subhead", fields.subhead)
    setDraftRestored(true)
    setEditorInstanceKey((key) => key + 1)
    discardDraft()
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
          sm:rounded-lg
          sm:px-10
          shadow
          max-w-6xl
          xl:max-w-screen-2xl
        "
      >
        {pendingDraft && (
          <div className="mb-6 flex items-center justify-between gap-4">
            <ImportantMessage
              message={`Hay un borrador sin guardar de esta nota (${new Date(pendingDraft.savedAt).toLocaleString("es-AR")}). ¿Querés recuperarlo?`}
            />
            <div className="flex gap-2 shrink-0">
              <Button onClick={handleRestoreDraft}>Recuperar</Button>
              <Button danger onClick={discardDraft}>Descartar</Button>
            </div>
          </div>
        )}
        {draftRestored && (
          <div className="mb-6">
            <ImportantMessage message="Borrador recuperado. Revisá los campos y guardá cuando estés listo." />
          </div>
        )}
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <ActionButtonsContainer>
              <Button
                type="submit"
                loading={loading}
              >
                GUARDAR
              </Button>
              <Button
                danger
                disabled={loading}
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </ActionButtonsContainer>
            {article.createdAt && (
              <p className="mt-2 text-sm text-gray-500">
                Fecha de la nota: <span className="font-semibold text-gray-700">{formatArgDate(article.createdAt)}</span>
              </p>
            )}
            <Separator heading label="Título" />
            <Input
              id="title"
              type="text"
              register={register}
              key={`article-title-${article._id}`}
              required={true}
              disabled={loading}
              errors={errors}
              placeHolder="Título de la nota"
              large
            />
          </div>
          <Separator heading label="Imagen principal" />
          <MainImage
            ref={mainImageRef}
            id="main-image"
            // article.slug ya viene como "{articleId}-{titulo-sluggeado}" (lo arma el
            // backend en articles.controller.ts), así que ya es único por sí solo.
            fileName={article.slug}
            image={article.image}
          />
          <Separator heading label="Sección" />
          <SectionSelector
            onChange={handleSectionChange}
            currentSection={currentSection}
            showLabel={false}
          />
          <Separator heading label="Autores" />
          <AuthorSelector
            authors={article.authors}
            descriptions={article.authorsDescriptions}
            onChange={handleAuthorChange}
          />
          <Separator heading label="Volanta y bajada" />
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
          <Separator heading label="Contenido" />
          {/* <Wysiwyg
            label="Contenido"
            id="content"
            control={control}
            errors={errors}
            required={true}
            placeHolder="Cuerpo de la nota..."
          /> */}
          <BlockNoteEditor
            key={editorInstanceKey}
            ref={editorRef}
            id="content"
            initialHTML={currentContent}
            onChange={(html:string) => setCurrentContent(html)}
          />
          <Separator heading label="Ideas principales" />
          <KeyIdeasEditor
            ideas={currentKeyIdeas}
            onChange={setCurrentKeyIdeas}
          />
          <Separator heading label="Notas y recursos relacionados" />
          <ContentLookupPanel
            excludeArticleId={article._id}
            relatedArticles={currentRelatedArticles}
            relatedResources={currentRelatedResources}
            onChangeRelatedArticles={setCurrentRelatedArticles}
            onChangeRelatedResources={setCurrentRelatedResources}
            editorRef={editorRef}
          />
          <Separator heading label="Tags" />
          <TagSelector
            onChange={(newTags) => setCurrentTags(newTags)}
            currentTags={currentTags}
            showTitle={false}
          />
          <ActionButtonsContainer>
            <Button
              type="submit"
              loading={loading}
            >
              GUARDAR
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
        <ArticlePreviewIframe
          article={{
            ...currentValues,
            section: currentSection!,
            authors: currentAuthors,
            authorsDescriptions: currentDescriptions,
            tags: currentTags,
            content: currentContent,
            keyIdeas: currentKeyIdeas.map((idea) => idea.trim()).filter(Boolean),
            image: previewImage,
          }}
          onBeforeShow={handleBeforePreview}
        />
        <Separator />
        <div className="my-5 flex flex-col gap-2 items-start flex-wrap">
          <h5>Estado</h5>
          <div className="flex gap-3">
            <Toggle
              labelConfig={{isChecked: 'Publicada', isNotChecked: 'Borrador'}}
              value={currentStatus}
              disabled={article.status === ArticleStatus.Published || isNotReadyForPublish}
              onChange={(val) => setCurrentStatus(val)}
            />
            <ImportantMessage
              message={
                article.status === ArticleStatus.Published
                  ? "Esta nota ya está publicada y no se puede volver a borrador. Si está mal, hay que borrarla."
                  : "Recuerda siempre revisar bien la nota antes de publicar!"
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleForm