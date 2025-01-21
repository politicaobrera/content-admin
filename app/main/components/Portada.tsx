import { iResponseMany } from "@/app/types/Responses"
import { PageType } from "@/app/types/page"
import getPageByName from "@/app/actions/data/pages/getPageByName"
import ArticlesSorter from "./ArticlesSorter"
import getArticles from "@/app/actions/data/articles/getArticles"
import { Params } from "@/app/types/Requests"
import { ArticleType } from "@/app/types/article"
import MainContainer from "@/app/components/MainContainer"
import { isInArray } from "@/app/utils/arrays"

interface PortadaProps {
  searchParams: Params;
}

const Portada = async ({searchParams}: PortadaProps) => {
  const { data: homePageData, error: homePageError }:iResponseMany<PageType> = await getPageByName("portada")
  const { data: ultimas, error:ultimasError, total:ultimasTotal }:iResponseMany<ArticleType> = await getArticles(searchParams)
  //const { data: searchedArticles, error:searchedArticlesError, total:searchedArticlesTotal }:iResponseMany<ArticleType> = await getArticles(searchParams)

  // console.log("homePageData", homePageData)
  const currentArticles = ((homePageData) as PageType).articles
  const id = ((homePageData) as PageType)._id
  
  const ultimasCleaned = ultimas.filter((item:ArticleType) => !isInArray(currentArticles, "_id", item._id))
  console.log("ultima cleaned", ultimasCleaned.map((i:ArticleType) => i.articleId))
  return (
    <section id="portada">
      <div>
        <ArticlesSorter current={currentArticles} newToAdd={ultimasCleaned} id={id}/>
      </div>
    </section>
  )
}

export default Portada