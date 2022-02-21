import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks:{
    async signIn({user}){
        if(!user?.roles){
            user.roles = "buyer"
        }
        
        return true
    },
    async jwt({token, account, user, profile}){
        
        if(account){
            token.accessToken = account.access_token
        }
        if(user){
            token.id = user.id
            if(user?.roles){
                token.roles = user.roles
            }
            else{
                token.roles = "buyer"
            }
        }
        console.log(token)


        return token
    },
    async session({session, token, user}){
        session.accessToken = token.accessToken
        session.id = token.id
        return session
    }
},
});