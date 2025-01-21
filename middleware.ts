import { withAuth } from "next-auth/middleware"
import { NextRequest, NextResponse } from "next/server";

const authMiddleware = withAuth({
  pages:{
    signIn: '/',
  },
})

const FilterUnwantedRequestsMiddleware = (req: NextRequest) => {
  const { pathname } = req.nextUrl;
  console.log("pathname --------------------", pathname)
  // Detectar rutas dinámicas y bloquear IDs inválidos
  const match = pathname.match(/^\/(articles|sections)\/([^/]+)$/);
  if (match) {
    const id = match[2];
    console.log("id", id)
    if (id === "installHook.js.map") {
      console.warn(`Blocked invalid request with ID: ${id}`);
      return NextResponse.error(); // Silenciosamente ignora la solicitud
    }
  }

  return null;
};

export default function middleware(req: NextRequest) {
  const filtered = FilterUnwantedRequestsMiddleware(req)
  if (filtered) {
    return filtered
  }
  return (authMiddleware as any)(req);
}

export const config = {
  matcher:[
    '/main/:path*',
    '/sections/:path*',
    '/articles/:path*',
  ],
}