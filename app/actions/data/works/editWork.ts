'use server'

import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"
import { WorkType } from "@/app/types/work"

const worksApi = process.env.CONTENT_SERVER_URL + '/works'

const editWork = async function (data: Partial<WorkType>): Promise<iResponseOne<WorkType>> {
  const auth = await getAuthorizationHeader()
  const headers = { ...auth, 'Content-Type': 'application/json' }
  const response = await fetch(`${worksApi}/${data._id}`,
    {
      headers: headers,
      cache: 'no-store',
      method: 'PATCH',
      body: JSON.stringify(data)
    })

  if (!response.ok) {
    console.log(`Error al editar la obra ${data._id} (${response.status}): ${response.statusText}`)
    return {
      error: {
        status: response.status,
        statusText: response.statusText,
        message: `Error al editar la obra ${data._id} (${response.status}): ${response.statusText}`,
      },
    }
  }

  return {
    data: await response.json()
  }
}

export default editWork
