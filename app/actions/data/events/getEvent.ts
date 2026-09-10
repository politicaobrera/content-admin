'use server'

import { EventType } from "@/app/types/event"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const eventApi = process.env.CONTENT_SERVER_URL + '/events'

const getEvent = async function (id:string):Promise<iResponseOne<EventType>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(
        `${eventApi}/${id}`,
        {
          headers: {...headers, 'Accept': 'application/json'},
          cache: 'no-store'
        }
      )

    if(!response.ok) {
      console.log(`Error al obtener el evento (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al obtener el evento (${response.status}): ${response.statusText}`,
        },
      }
    }
    const res = await response.json()
    return {
      data: res
    }
  } catch (error) {
    console.log(error)
    return {
      error: {
        status: 500,
        statusText: "Server Error",
        message: error as string,
      },
    }
  }
}

export default getEvent
