import { JWT } from "next-auth/jwt"
import withAuth from "next-auth/middleware"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req:any){
    console.log(req.ip)
    NextResponse.next()
}