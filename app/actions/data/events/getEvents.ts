'use server'

import { EventType } from "@/app/types/event"
import { iResponseMany } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { Params } from "@/app/types/requests"
import { buildQueryString } from "@/app/utils/query"

const eventsApi = process.env.CONTENT_SERVER_URL + '/events'

const getEvents = async function (searchParams:Params):Promise<iResponseMany<EventType>> {
  const query = buildQueryString(searchParams)
  const headers = await getAuthorizationHeader()
  const response = await fetch(`${eventsApi}?${query}`, {headers: headers, cache: 'no-store'})

  if(!response.ok) {
    console.log(`Error al obtener los eventos (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al obtener los eventos (${response.status}): ${response.statusText}`,
      },
    }
  }
  const res = await response.json()
  return res
}

export default getEvents
