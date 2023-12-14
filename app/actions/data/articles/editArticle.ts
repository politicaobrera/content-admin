'use server'

import { iResponseOne } from "@/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Article } from "@/types/articles"

const articlesApi = process.env.CONTENT_SERVER_URL + '/articles'

const editArticle = async function (data:Article):Promise<iResponseOne<Article>> {
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
    console.log(`Error al editar la sección (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al crear las secciones (${response.status}): ${response.statusText}`,
      },
    }
  }
  
  return {
    data: await response.json()
  }
}

export default editArticle