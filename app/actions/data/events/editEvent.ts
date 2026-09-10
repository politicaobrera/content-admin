'use server'

import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { EventType } from "@/app/types/event"

const eventApi = process.env.CONTENT_SERVER_URL + '/events'

const editEvent = async function (data:Partial<EventType>):Promise<iResponseOne<EventType>> {
  const auth = await getAuthorizationHeader()
  const headers = {...auth, 'Content-Type': 'application/json'}
  const response = await fetch(`${eventApi}/${data._id}`,
   {
    headers: headers,
    cache: 'no-store',
    method: 'PATCH',
    body: JSON.stringify(data)
  })

  if(!response.ok) {
    console.log(`Error al editar el evento ${data._id} (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al editar el evento ${data._id} (${response.status}): ${response.statusText}`,
      },
    }
  }

  return {
    data: await response.json()
  }
}

export default editEvent
