'use server'

import { ArticleType } from "@/app/types/articles"
import { iResponseMany } from "@/app/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Params } from "@/app/types/Requests"
import { buildQueryString } from "@/app/utils/query"

const articlesApi = process.env.CONTENT_SERVER_URL + '/articles'

const getArticles = async function (searchParams:Params):Promise<iResponseMany<ArticleType>> {
  console.log("searchParams", searchParams)
  const query = buildQueryString(searchParams)
  console.log("query", query)
  const headers = await getAuthorizationHeader()
  const response = await fetch(`${articlesApi}?${query}`, {headers: headers, cache: 'no-store'})

  if(!response.ok) {
    console.log(`Error al obtener los articulos (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al obtener los articulos (${response.status}): ${response.statusText}`,
      },
    }
  }
  const res = await response.json()
  return res
}

export default getArticles