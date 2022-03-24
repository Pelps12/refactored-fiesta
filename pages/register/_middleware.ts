import { getToken, JWT } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req:any){
    const session = await getToken({req})
    if(req.nextUrl.pathname === "/register/seller"){
        console.log(session)
        if(!session){
            return NextResponse.redirect("/register")
        }else if(session.roles !== "buyer"){
            return NextResponse.redirect("/dashboard")
        }
    }
    NextResponse.next()
}