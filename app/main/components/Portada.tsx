import { iResponseMany } from "@/app/types/Responses"
import { PageType } from "@/app/types/page"
import getPageByName from "@/app/actions/data/pages/getPageByName"
import ArticlesSorter from "./ArticlesSorter"
import getArticles from "@/app/actions/data/articles/getArticles"
import { Params } from "@/app/types/Requests"
import { ArticleType } from "@/app/types/article"
import { isInArray } from "@/app/utils/arrays"
import BannersSelector from "./BannersSelector"
import Separator from "@/app/components/layout/Separator"

interface PortadaProps {
  searchParams: Params;
}

const Portada = async ({searchParams}: PortadaProps) => {
  const { data: homePageData, error: homePageError }:iResponseMany<PageType> = await getPageByName("portada")
  const { data: ultimas, error:ultimasError, meta:ultimasMeta }:iResponseMany<ArticleType> = await getArticles(searchParams)
  // TODO posibility for searching an article and add it to newtoadd
  //const { data: searchedArticles, error:searchedArticlesError, total:searchedArticlesTotal }:iResponseMany<ArticleType> = await getArticles(searchParams)
  const {
    _id: id,
    articles: currentArticles,
    banners: currentBanners,
    videos: currentVideos,
    name
  } = homePageData as PageType;
  
  const ultimasCleaned = ultimas.filter((item:ArticleType) => !isInArray(currentArticles, "_id", item._id))
  // IMPORTANT TODO FOR DEV PORPOSE REMOVE LATER 
  if(currentArticles.length === 0) {
    currentArticles.push(ultimasCleaned.pop())
  }
  //console.log("ultima cleaned", ultimasCleaned.map((i:ArticleType) => i.articleId))
  return (
    <section id="portada" className="flex flex-col gap-5 mt-5">
      <ArticlesSorter
        current={currentArticles}
        newToAdd={ultimasCleaned}
        id={id}
      />
      <Separator />
      <BannersSelector
        id={id}
        pageName={name}
        current={currentBanners}
      />
    </section>
  )
}

export default Portada