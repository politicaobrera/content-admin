import { iResponseMany } from "@/app/types/Responses"
import { PageType } from "@/app/types/page"
import getPageByName from "@/app/actions/data/pages/getPageByName"
import ArticlesSorter from "./ArticlesSorter"
import getArticles from "@/app/actions/data/articles/getArticles"
import { Params } from "@/app/types/Requests"
import { ArticleType } from "@/app/types/article"
import MainContainer from "@/app/components/MainContainer"

interface PortadaProps {
  searchParams: Params;
}

const Portada = async ({searchParams}: PortadaProps) => {
  const { data: homePageData, error: homePageError }:iResponseMany<PageType> = await getPageByName("portada")
  const { data: searchedArticles, error:searchedArticlesError, total:searchedArticlesTotal }:iResponseMany<ArticleType> = await getArticles(searchParams)
  // const { data: ultimas, error:searchedArticlesError, total:searchedArticlesTotal }:iResponseMany<ArticleType> = await getArticles(searchParams)

  console.log("homePageData", homePageData)
  const currentArticles = ((homePageData) as PageType).articles

  if(currentArticles.length === 0){
    console.log("we are here", searchedArticles)
    currentArticles.push(searchedArticles.pop())
    currentArticles.push(searchedArticles.pop())
  }
  
  return (
    <MainContainer>
      <ArticlesSorter current={currentArticles} newToAdd={searchedArticles} />
    </MainContainer>
  )
}

export default Portada