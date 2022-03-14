import {getToken} from "next-auth/jwt"
import {NextResponse, NextRequest} from "next/server"

export async function middleware(req:any){
    //console.log(req)
    const session = await getToken({req})
    if(req.nextUrl.pathname.includes("/login") || 
    req.nextUrl.pathname.includes("/register") &&
     !req.nextUrl.pathname.includes("/api")){
        console.log("LOGIN OR REGISTER")
        
        //console.log(session)
        if(session) return NextResponse.redirect("/home")
    }
    if(req.nextUrl.pathname.includes("/home")){
        if(!session){
            return NextResponse.redirect("/")
        }
    }
    if(req.nextUrl.pathname === "/"){
        if(session){
            return NextResponse.redirect("/home")
        }
    }
    
}