'use server'

import { WorkType } from "@/app/types/work"
import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const worksApi = process.env.CONTENT_SERVER_URL + '/works'

// a diferencia de createArticle (solo title -- el resto se completa editando), acá el
// backend exige title + authors + sourceUrl + sourceLabel + license en el create mismo
// (ver works.controller.ts), así que el payload mínimo viable incluye esos campos
export type CreateWorkPayload = Pick<WorkType, 'title' | 'sourceUrl' | 'sourceLabel' | 'license'> & {
  authors: string[]
}

const createWork = async function (payload: CreateWorkPayload): Promise<iResponseOne<WorkType>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(worksApi, {
      headers: { ...headers, 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      console.log(`Error al crear la obra (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al crear la obra (${response.status}): ${response.statusText}`,
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

export default createWork
