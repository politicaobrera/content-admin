import getCurrentUser from "./getCurrentUser"

export default async function getAuthorizationHeader(){
  const user = await getCurrentUser()
  if (user?.sessionToken) {
    return  {
      'Authorization': `Bearer ${user.sessionToken}`,
    } as HeadersInit
  } else {
    return {}
  }
}