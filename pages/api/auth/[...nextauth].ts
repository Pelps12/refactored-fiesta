import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../util/mongodb";

export default NextAuth({
    
  // Configure one or more authentication providers
  providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
            email: { label: "Email", type: "email", placeholder: "Oluwapelps Adegbite" },
            password: { label: "Password", type: "password" }
        },
        authorize: async(credentials: any) =>{
            try{
                console.log("Hello I'm in Credentials")
                const {db} = await connectToDatabase();
                const user = await db.collection("users").findOne({
                    email: credentials.email,
                });
                console.log(user)
                
                if(!user){
                    return null
                }
                
                const match = true
                console.log(match)
                if(!match){
                    return null
                }
                
                const id = user._id.toString()
                .match(/(?:"[^"]*"|^[^"]*$)/)[0]
                .replace(/"/g, "")
                console.log(id)
                console.log(user)
                return {...user, id: id}

            }catch(err){
                console.log(err);
                return null
            }
        }
        }),
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
            console.log("User" + user);
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
        console.log(session)
        return session
    }
},
});