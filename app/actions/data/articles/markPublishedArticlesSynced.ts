'use server'

import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const articlesApi = process.env.CONTENT_SERVER_URL + '/articles'

const markPublishedArticlesSynced = async function ():Promise<iResponseOne<{ modifiedCount: number }>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${articlesApi}/sync-published`, {
      headers,
      cache: 'no-store',
      method: 'POST',
    })

    if (!response.ok) {
      console.log(`Error al sincronizar articulos publicados (${response.status}): ${response.statusText}`)
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al sincronizar articulos publicados (${response.status}): ${response.statusText}`,
        },
      }
    }

    return {
      data: await response.json()
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

export default markPublishedArticlesSynced
