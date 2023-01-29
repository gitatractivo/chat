import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "../../../lib/prismadb"

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        },
      }
      
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks:{
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      console.log("inside of callback");
      return {...session, user:{...session.user, ...user}}
    }
  }
})