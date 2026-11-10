// Batch de /api/articles/[id]/editing-session: la tabla de artículos pide la presencia
// de todas las filas visibles en un solo request, no uno por fila (con 50 filas por
// página, 50 requests individuales en paralelo tiraban 503 -- ver conversación).
import { NextRequest, NextResponse } from "next/server"
import getAuthorizationHeader from "@/app/actions/getAuthorizationHeader"

const articlesApi = process.env.CONTENT_SERVER_URL + '/articles'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const headers = await getAuthorizationHeader()
  const response = await fetch(`${articlesApi}/editing-sessions`, {
    headers: { ...headers, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    cache: 'no-store',
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    return NextResponse.json({}, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json(data)
}
