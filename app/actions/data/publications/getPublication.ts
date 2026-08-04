'use server'

import { PublicationType } from "@/app/types/publication"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const publicationApi = process.env.CONTENT_SERVER_URL + '/publications'

const getPublication = async function (id:string):Promise<iResponseOne<PublicationType>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(
        `${publicationApi}/${id}`,
        { headers: {...headers, 'Accept': 'application/json'}, cache: 'no-store' }
      )
    if(!response.ok) {
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al obtener la publicación (${response.status}): ${response.statusText}`,
        },
      }
    }
    const res = await response.json()
    return { data: res }
  } catch (error) {
    return { error: { status: 500, statusText: "Server Error", message: error as string } }
  }
}

export default getPublication
