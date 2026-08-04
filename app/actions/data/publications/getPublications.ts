'use server'

import { PublicationType } from "@/app/types/publication"
import { iResponseMany } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Params } from "@/app/types/requests"
import { buildQueryString } from "@/app/utils/query"

const publicationsApi = process.env.CONTENT_SERVER_URL + '/publications'

const getPublications = async function (searchParams:Params):Promise<iResponseMany<PublicationType>> {
  const query = buildQueryString(searchParams)
  const headers = await getAuthorizationHeader()
  const response = await fetch(`${publicationsApi}?${query}`, {headers: headers, cache: 'no-store'})

  if(!response.ok) {
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al obtener las publicaciones (${response.status}): ${response.statusText}`,
      },
    }
  }
  const res = await response.json()
  return res
}

export default getPublications
