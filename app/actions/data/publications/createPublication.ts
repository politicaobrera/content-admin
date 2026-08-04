'use server'

import { PublicationType } from "@/app/types/publication"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const publicationApi = process.env.CONTENT_SERVER_URL + '/publications'

const createPublication = async function (data:Partial<PublicationType>):Promise<iResponseOne<PublicationType>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(publicationApi, {
      headers: {...headers, 'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(data)
    })
    if(!response.ok) {
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al crear la publicación (${response.status}): ${response.statusText}`,
        },
      }
    }
    const res = await response.json()
    return { data: res }
  } catch (error) {
    return { error: { status: 500, statusText: "Server Error", message: error as string } }
  }
}

export default createPublication
