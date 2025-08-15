import NextAuth, {DefaultSession} from "next-auth"
import {JWT} from "next-auth/jwt"

interface ExtendedUser {
    name?: string | null
    email?: string | null
    image?: string | null
    sessionToken?: string  
}

// export interface ExtendedUser extends iUser {
//   email:string
//   name: string
//   sessionToken?: string
// }

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sessionToken?: string
  }
}