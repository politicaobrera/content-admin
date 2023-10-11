import axios from 'axios'
import NextAuth, {AuthOptions} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions:AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {label: 'email', type: 'text'},
        password: {label: 'password', type: 'password'}
      },
      async authorize(credentials) {
        if(!credentials?.email || !credentials.password) {
          throw new Error('invalid credentials')
        }
        let user = await axios.post(process.env.CONTENT_SERVER_URL+'/auth/login', credentials)
        console.log("user", user.data)
        user.data.name = user.data.username
        user.data.sessionToken = user.data.authentication.sessionToken
        return user.data
      }
    })
  ],
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.sessionToken) {
        token.sessionToken = user.sessionToken
      }      
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.sessionToken = token.sessionToken;
      }
      return session;
    },
  },
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}