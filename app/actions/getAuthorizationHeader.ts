'use server'

import getCurrentUser from "./getCurrentUser"

// sin esta sesión, cada server action que llama a esto seguía ejecutando su fetch a
// content-server igual, solo que sin el header Authorization -- la única razón por la
// que eso no exponía nada es que content-server rechaza requests sin token válido. Pero
// dependía 100% de esa segunda capa: un cambio futuro ahí, o una action nueva que no
// reenvíe el header correctamente, se queda sin ninguna protección del lado del admin.
// Lanzar acá corta la action ANTES del fetch, así cada caller solo necesita su try/catch
// ya existente (ver deleteArticle.ts y el resto de app/actions/data/**) para que el
// error se propague como cualquier otro fallo de red, sin tocar archivo por archivo.
export default async function getAuthorizationHeader(){
  const user = await getCurrentUser()
  if (!user?.sessionToken) {
    throw new Error('No autenticado')
  }
  return {
    'Authorization': `Bearer ${user.sessionToken}`,
  } as HeadersInit
}