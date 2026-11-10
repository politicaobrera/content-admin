'use server'

import getAuthorizationHeader from "../../getAuthorizationHeader"

const articlesApi = process.env.CONTENT_SERVER_URL + '/articles'

const touchArticleEditingSession = async function (id: string): Promise<void> {
  try {
    const headers = await getAuthorizationHeader()
    await fetch(`${articlesApi}/${id}/editing-session`, {
      headers,
      cache: 'no-store',
      method: 'POST',
    })
  } catch (error) {
    console.log(error)
  }
}

export default touchArticleEditingSession
