import NextAuth, {DefaultSession} from "next-auth"
import {JWT} from "next-auth/jwt"

interface iUser extends DefaultSession["user"] {}

export interface ExtendedUser extends iUser {
  email:string
  name: string
  sessionToken?: string
}

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