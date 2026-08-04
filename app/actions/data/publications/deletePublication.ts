'use server'

import { PublicationType } from "@/app/types/publication"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const publicationApi = process.env.CONTENT_SERVER_URL + '/publications'

const deletePublication = async function (id:string):Promise<iResponseOne<PublicationType>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${publicationApi}/${id}`, {
      headers: headers,
      cache: 'no-store',
      method: 'DELETE',
    })
    if(!response.ok) {
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al eliminar la publicación ${id} (${response.status}): ${response.statusText}`,
        },
      }
    }
    const res = await response.json()
    return { data: res }
  } catch (error) {
    return { error: { status: 500, statusText: "Server Error", message: error as string } }
  }
}

export default deletePublication
