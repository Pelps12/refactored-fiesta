import {NextApiRequest, NextApiResponse}from 'next'
import { PrismaClient, Prisma } from '@prisma/client'
import Redis from 'ioredis'
import getCookies from '../../cookies'
import jwt from 'jsonwebtoken'
import { checkToken } from '../../token'
import DOMPurify from 'dompurify'
import dayjs from 'dayjs'

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

    if(value !== "validSeller"){
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
            if(typeof decoded != "string"){

                /*NOTE WHEN YOU CLICK ON A PRODUCT,
                YOU SHOULD PASS THE PRODUCTID */
                let {expiresAt, startingPrice, product} = req.body
                expiresAt = DOMPurify.sanitize(expiresAt)
                startingPrice = DOMPurify.sanitize(startingPrice)
                product = DOMPurify.sanitize(product)
                try{
                    expiresAt = convertToDateTime(expiresAt)
                }
                catch(error){
                    res.statusCode = 400
                    message: error.message
                    return
                }
                
                
                const newListing:Prisma.ListingCreateInput ={
                    startingPrice,
                    expiresAt,
                    product,
                    seller: typeof decoded != null ? decoded.id: null
                }
                let createListing: any;
                try{
                    createListing = await prisma.listing.create({data: newListing})
                }
                catch(err){
                    res.statusCode = 404
                    res.json({
                        error: err.message
                    })
                    return
                }
            }
        break;
        case "DELETE":
            try{
                await prisma.listing.deleteMany({
                    where:{
                        sellerId: typeof decoded != 'string'? decoded.id: null
                    }
                })
            }
            catch(err){
                res.statusCode = 400,
                res.json({
                    error: err.msg
                })
            }

            
    }
}

function convertToDateTime(expiresAt: string): Date{
    const regex:RegExp = /^([01]\d|2[0-3]):{1}([0-5]\d)$/
    const globalRegex:RegExp = new RegExp(regex, 'g')
    if(!globalRegex.test(expiresAt)){
        throw "Invalid Format"
    }
    const [hours, minutes]:string[] = expiresAt.split(":")

    let time:Date = new Date()
    time.setMinutes(parseInt(minutes))
    time.setHours(parseInt(hours))
    return time

}