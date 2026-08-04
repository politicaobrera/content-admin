'use server'

import { ArticleType } from "@/app/types/article"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const articlesApi = process.env.CONTENT_SERVER_URL + '/articles'

const deleteArticle = async function (id:string):Promise<iResponseOne<ArticleType>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${articlesApi}/${id}`, {
      headers: headers,
      cache: 'no-store',
      method: 'DELETE',
    })
    if(!response.ok) {
      console.log(`Error al eliminar el articulo ${id} (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al eliminar el articulo ${id} (${response.status}): ${response.statusText}`,
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

export default deleteArticle
