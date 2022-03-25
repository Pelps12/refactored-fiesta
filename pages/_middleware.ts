import {getToken} from "next-auth/jwt"
import {NextResponse} from "next/server"

export async function middleware(req:any){
    //console.log(req)
    const session = await getToken({req})
    console.log(session)
    if(req.nextUrl.pathname=== "/login" || 
    req.nextUrl.pathname==="/register") 
     {
        console.log("LOGIN OR REGISTER")
        
        //console.log(session)
        if(session) return NextResponse.redirect("/")
    }
    
    if(req.nextUrl.pathname === "/dashboard" && session?.roles === "buyer"){
        return NextResponse.redirect("/")
    }
    NextResponse.next()
    
}