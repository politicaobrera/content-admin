'use server'

import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { ArticleType } from "@/app/types/article"

const articlesApi = process.env.CONTENT_SERVER_URL + '/articles'

const editArticle = async function (data:Partial<ArticleType>):Promise<iResponseOne<ArticleType>> {
  try {
    const auth = await getAuthorizationHeader()
    const headers = {...auth, 'Content-Type': 'application/json'}
    console.log('data',data);
    const response = await fetch(`${articlesApi}/${data._id}`,
     {
      headers: headers,
      cache: 'no-store',
      method: 'PATCH',
      body: JSON.stringify(data)
    })

    if(!response.ok) {
      console.log(`Error al editar el articulo ${data._id} (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al editar el articulo ${data._id}(${response.status}): ${response.statusText}`,
        },
      }
    }

    return {
      data: await response.json()
    }
  } catch (error) {
    return {
      error: {
        status: 401,
        statusText: "Unauthorized",
        message: error instanceof Error ? error.message : "No autenticado",
      },
    }
  }
}

export default editArticle