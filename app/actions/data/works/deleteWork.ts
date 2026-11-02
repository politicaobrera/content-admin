'use server'

import { WorkType } from "@/app/types/work"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const worksApi = process.env.CONTENT_SERVER_URL + '/works'

const deleteWork = async function (id: string): Promise<iResponseOne<WorkType>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${worksApi}/${id}`, {
      headers: headers,
      cache: 'no-store',
      method: 'DELETE',
    })
    if (!response.ok) {
      console.log(`Error al eliminar la obra ${id} (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al eliminar la obra ${id} (${response.status}): ${response.statusText}`,
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

export default deleteWork
