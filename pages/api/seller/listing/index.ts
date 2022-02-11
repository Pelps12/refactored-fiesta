import {NextApiRequest, NextApiResponse}from 'next'
import { PrismaClient, Prisma } from '@prisma/client'
import Redis from 'ioredis'
import getCookies from '../../cookies'
import jwt from 'jsonwebtoken'
import { checkToken } from '../../token'

const redis = new Redis(process.env.REDIS_URL)


const KEY = process.env.JWT_SECRET
const prisma = new PrismaClient() 
export default async function sellerListing(req: NextApiRequest, res: NextApiResponse){
    const jwtVal = getCookies(req, 'jwt')

    if(!jwtVal){
        res.statusCode = 403,
        res.json({
            message: "Not authorized"
        })
        return
    }
    let decoded: string|jwt.JwtPayload;
    try{
        decoded = jwt.verify(jwtVal, KEY)
        console.log(decoded)
    }
    catch(err){
        res.statusCode = 403,
        res.json({
            message: "Invalid Token"
        })
        return
    }
    const value: string|null = await checkToken(jwtVal)

    if(value === "false"){
        res.statusCode = 403,
        res.json({
            message: "Invalid Token"
        })
        return
    }
    else if(!value){
        res.statusCode = 403,
        res.json({
            message: "Invalid Token"
        })
        return
    }

    switch(req.method){
        case "GET":
            const listings = await prisma.listing.findMany({
                where:{

                    //If the JWT was not a string then check for listings
                    sellerId: typeof decoded != 'string'? decoded.id: null
                },
                select:{
                    id: true,
                    startingPrice: true,
                    expiresAt: true,
                    sellerId:true,
                    product:{
                        select:{
                            image: true,
                            perishable: true,
                            name: true
                        }
                    },
                    
                }
            })

            res.statusCode = 200
            res.json({
                listing: listings
            })
            return
        break;
        
        case "POST":
            if(!req.body){
                res.statusCode = 404
                res.json({
                    success: false
                })
                res.end("Error!")
                return
            }
    }
}