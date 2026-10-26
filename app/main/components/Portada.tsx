import { iResponseMany, iResponseOne } from "@/app/types/responses"
import { PageType } from "@/app/types/sitepage"
import getPageByName from "@/app/actions/data/pages/getPageByName"
import ArticlesSorter from "./ArticlesSorter"
import getArticles from "@/app/actions/data/articles/getArticles"
import { Params } from "@/app/types/requests"
import { ArticleStatus, ArticleType } from "@/app/types/article"
import { isInArray } from "@/app/utils/arrays"
import BannersSelector from "./BannersSelector"
import Separator from "@/app/components/layout/Separator"
import VideosSelector from "./VideosSelector"
import LayoutsSorter from "./LayoutsSorter"
import PortadaTabs from "./PortadaTabs"
import FeaturedAgendaPanel from "./FeaturedAgendaPanel"
import { PortadaDraftProvider } from "../context/PortadaDraftContext"
import { normalizeLayoutInstances } from "../layoutCatalog"

interface PortadaProps {
  searchParams: Params;
}

const Portada = async ({searchParams}: PortadaProps) => {
  const { data: homePageData, error: homePageError }:iResponseOne<PageType> = await getPageByName("portada")
  const { data: ultimas, error:ultimasError, meta:ultimasMeta }:iResponseMany<ArticleType> = await getArticles({status: ArticleStatus.Published})
  // TODO posibility for searching an article and add it to newtoadd
  //const { data: searchedArticles, error:searchedArticlesError, total:searchedArticlesTotal }:iResponseMany<ArticleType> = await getArticles(searchParams)

  if(!homePageData) {
    // TODO what to do?
    return (<>No hay datos portada</>)
  }

  const {
    _id: id,
    articles: currentArticles,
    banners: currentBanners,
    videos: currentVideos,
    layouts: currentLayouts,
    featuredEvents: currentFeaturedEvents,
    featuredIssues: currentFeaturedIssues,
    name
  } = homePageData as PageType;
  
  const ultimasCleaned = ultimas && ultimas.filter((item:ArticleType) => !isInArray(currentArticles, "_id", item._id))
  const initialDraftArticles = currentArticles.map((item) => ({ ...item, id: item?.articleId || 0 }))
  const initialDraftLayouts = normalizeLayoutInstances(currentLayouts ?? [])

  return (
    <PortadaDraftProvider initialArticles={initialDraftArticles} initialLayouts={initialDraftLayouts}>
      <section id="portada" className="flex flex-col gap-5 mt-5">
        <PortadaTabs
          articlesTab={
            <div className="flex flex-col gap-5">
              <ArticlesSorter
                newToAdd={ultimasCleaned as Partial<ArticleType>[]}
                id={id}
              />
              <Separator />
              <BannersSelector
                id={id}
                pageName={name}
                current={currentBanners}
              />
              <Separator />
              <VideosSelector
                id={id}
                current={currentVideos}
              />
              <Separator />
              <FeaturedAgendaPanel
                id={id}
                currentFeaturedEvents={currentFeaturedEvents ?? []}
                currentFeaturedIssues={currentFeaturedIssues ?? []}
              />
            </div>
          }
          layoutsTab={
            <LayoutsSorter id={id} />
          }
        />
      </section>
    </PortadaDraftProvider>
  )
}

export default Portada