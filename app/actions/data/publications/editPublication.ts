'use server'

import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { PublicationType } from "@/app/types/publication"

const publicationApi = process.env.CONTENT_SERVER_URL + '/publications'

const editPublication = async function (data:Partial<PublicationType>):Promise<iResponseOne<PublicationType>> {
  const auth = await getAuthorizationHeader()
  const headers = {...auth, 'Content-Type': 'application/json'}
  const response = await fetch(`${publicationApi}/${data._id}`, {
    headers: headers,
    cache: 'no-store',
    method: 'PATCH',
    body: JSON.stringify(data)
  })

  if(!response.ok) {
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al editar la publicación ${data._id}(${response.status}): ${response.statusText}`,
      },
    }
  }

  return { data: await response.json() }
}

export default editPublication
