import { JWT } from "next-auth/jwt"
import withAuth from "next-auth/middleware"
import { NextRequest } from "next/server"


export default withAuth({
  callbacks: {
    authorized ({ token }){
        console.log(token)
        if(!token){
            return true
        }
    }
  },
  
})