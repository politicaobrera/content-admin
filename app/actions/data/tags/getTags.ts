'use server'

import { Tag } from "@/types/tags"
import { iResponse } from "@/types/Responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const tagsApi = process.env.CONTENT_SERVER_URL + '/tags'

const getTags = async function ():Promise<iResponse<Tag>> {
  // await setAuthCookie()
  const headers = await getAuthorizationHeader()
  const response = await fetch(tagsApi, {headers: headers, cache: 'no-store'})

  if(!response.ok) {
    console.log(`Error al obtener las secciones (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al obtener los tags (${response.status}): ${response.statusText}`,
      },
      data: []
    }
  }
  
  return {
    data: await response.json()
  }
}

export default getTags