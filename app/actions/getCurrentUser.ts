import getSession from "./getSession"

export default async function getCurrentUser(){
  try {
    const session = await getSession()
    if (!session?.user?.email) {
      return null
    }
    return session.user
  } catch (error: any) {
    console.log("error while geting current user")
    return null
  }
}