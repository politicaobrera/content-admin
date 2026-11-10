// Route Handler (no Server Action) a propósito: el heartbeat de presencia de edición
// se llama desde un setInterval en el cliente cada 15s. Una Server Action para esto
// hace que Next re-renderice el árbol de Server Components en cada llamada, lo cual
// terminaba re-montando el formulario de edición entero (ver conversación). Un Route
// Handler es un fetch HTTP puro, sin ese efecto secundario.
import { NextRequest, NextResponse } from "next/server"
import getAuthorizationHeader from "@/app/actions/getAuthorizationHeader"

const articlesApi = process.env.CONTENT_SERVER_URL + '/articles'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const headers = await getAuthorizationHeader()
  await fetch(`${articlesApi}/${id}/editing-session`, {
    headers,
    cache: 'no-store',
    method: 'POST',
  })
  return new NextResponse(null, { status: 204 })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const headers = await getAuthorizationHeader()
  const response = await fetch(`${articlesApi}/${id}/editing-session`, {
    headers: { ...headers, 'Accept': 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    return NextResponse.json(null, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json(data)
}
