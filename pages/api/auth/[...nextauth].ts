import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../util/mongodb";
import bcrypt from "bcrypt"
var Mixpanel = require('mixpanel');
import {v4 as uuidv4} from "uuid"
const mixpanel = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);


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
                const client = await clientPromise;
                const db = client.db(process.env.MONGODB_DB)
                const user = await db.collection("users").findOne({
                    email: credentials.email,
                });
                console.log(user)
                
                if(!user){
                    return null
                }
                
                const match = await bcrypt.compare(credentials.password, user.password)
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
    FacebookProvider({
        clientId: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET
    })
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
        //console.log(user.id)

        
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
        //console.log(token)


        return token
    },
    async session({session, token, user}){
        session.accessToken = token.accessToken
        session.id = token.id
        session.roles = token.roles
        //console.log(session)
        return session
    }
},
events:{
    signIn({user, isNewUser}){
        console.log("ONE")
        if(isNewUser){
            const [first_name, last_name]: string[] = user.name.split(" ")
            console.log(user)
            console.log("TWO")
            mixpanel.people.set(user.id, {
                $first_name: first_name,
                $last_name: last_name,
                $email: user.email
            })
            mixpanel.track("Sign Up", {
                distinct_id: user.id,
                $insert_id: uuidv4(),                
              })
        }
        else{
            console.log("Hello")
            mixpanel.track("Login", {
                distinct_id: user.id,
                $insert_id: uuidv4(),               
          
              })
        }
        
    },
    signOut({token}){
        mixpanel.track("Logout", {
            distinct_id: token.id,
            $insert_id: uuidv4(),                
      
          })
    }
}
});