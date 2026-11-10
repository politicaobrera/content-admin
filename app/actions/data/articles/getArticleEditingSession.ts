'use server'

import { iResponseOne } from "@/app/types/responses"
import getAuthorizationHeader from "../../getAuthorizationHeader"

const articlesApi = process.env.CONTENT_SERVER_URL + '/articles'

export type ArticleEditingSession = {
  username: string
  updatedAt: number
}

const getArticleEditingSession = async function (id: string): Promise<iResponseOne<ArticleEditingSession | null>> {
  try {
    const headers = await getAuthorizationHeader()
    const response = await fetch(`${articlesApi}/${id}/editing-session`, {
      headers: { ...headers, 'Accept': 'application/json' },
      cache: 'no-store',
    })

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          statusText: response.statusText,
          message: `Error al consultar sesión de edición (${response.status}): ${response.statusText}`,
        },
      }
    }

    return { data: await response.json() }
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

export default getArticleEditingSession
