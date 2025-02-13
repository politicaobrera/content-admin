'use server'

import { ArticleType } from "@/app/types/article"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const articlesApi = process.env.CONTENT_SERVER_URL + '/articles'

const getArticle = async function (id:string):Promise<iResponseOne<ArticleType>> {
  // await setAuthCookie()
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(
        `${articlesApi}/${id}`,
        {
          headers: {...headers, 'Accept': 'application/json'},
          cache: 'no-store'
        }
      )
  
    if(!response.ok) {
      console.log(`Error al obtener el articulo (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al obtener el articulo (${response.status}): ${response.statusText}`,
        },
      }
    }
    const res = await response.json()
    return {
      data: res
    }    
  } catch (error) {
    console.log(error)
    return {
      error: {
        status: 500,
        statusText: "Server Error",
        message: error as string,
      },
    }
  }
}

export default getArticle