'use server'

import { Article } from "@/app/types/articles"
import { iResponseMany } from "@/app/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const articlesApi = process.env.CONTENT_SERVER_URL + '/articles'

const getArticles = async function ():Promise<iResponseMany<Article>> {
  // await setAuthCookie()
  const headers = await getAuthorizationHeader()
  const response = await fetch(articlesApi, {headers: headers, cache: 'no-store'})

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
  return {
    data: res
  }
}

export default getArticles