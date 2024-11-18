'use server'

import { iResponseOne } from "@/app/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { ArticleType } from "@/app/types/articles"

const articlesApi = process.env.CONTENT_SERVER_URL + '/articles'

const editArticle = async function (data:ArticleType):Promise<iResponseOne<ArticleType>> {
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
}

export default editArticle