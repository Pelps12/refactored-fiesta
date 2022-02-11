import {NextApiRequest, NextApiResponse}from 'next'
import DOMPurify from 'isomorphic-dompurify'
//import Cookies from 'cookies'
import {  Prisma} from "@prisma/client"
import {prisma} from "../../prisma"
import bcrypt from 'bcrypt'
import {redis} from "../../redis"
import jwt from 'jsonwebtoken'
import { checkToken } from '../token'
import getCookies from '../cookies'

//SALT FOR PASSWORD HASH
const saltRounds = 10




/*!!!!!DO NOT FORGET TO CHANGE THIS */
const KEY = process.env.JWT_SECRET
console.log(KEY)
export default async function sellerReg(req: NextApiRequest, res:NextApiResponse){
    switch(req.method){
        case "POST":
            const jwtVal = getCookies(req, 'jwt')
            const loggedIn:string = await checkToken(jwtVal)
            console.log("JWT Value: "+ jwtVal)
            if(loggedIn === "validBuyer"){
                res.statusCode= 403,
                res.json({
                    error: "Already logged in"
                })
                return
            }


            /*If no request body provided */
            if(!req.body){
                res.statusCode = 404
                res.json({
                    success: false
                })
                res.end("Error!")
                return
            }
            

            let {name, password, email, phoneNumber} = req.body

            //NEVER TRUST THE CLIENT
            name = DOMPurify.sanitize(name)
            phoneNumber = DOMPurify.sanitize(phoneNumber)
            email = DOMPurify.sanitize(email)
            password = DOMPurify.sanitize(password)

            const passwordHash:string = await bcrypt.hash(password, saltRounds)
            console.log(passwordHash)

            /*Search for user */
            //Call checkUser

            /*If the user already exist in the database */
            if(!checkUser(name)){
                res.statusCode = 409
                res.json({
                    success: false,
                    error: "User already exists"
                })
                return
            }

            //PLACEHOLDER FOR DATABASE
            const user:Prisma.UserCreateInput
             = {
                email,
                passwordHash,
                phoneNumber,
                name,
            }
            let createSeller: any;
            try{
                 createSeller = await prisma.user.create({data: user})
            }
            catch(err){
                res.statusCode = 404
                res.json({
                    error: err.message
                })
                return
                //console.log(err.message)
            }
            

            enum Description {
                Seller = "Seller",
                Buyer = "Buyer"
            }
            const token: string = jwt.sign(
                {
                    id: createSeller.id,
                    description: Description.Buyer
                },
                KEY, {
                    expiresIn: '14d'
                })

            
            //Set the token as valid in Redis cache
            //Expire it after 14 days + 1 hour
            try{
                redis.set(token, "validBuyer", "EX", 1213200)
            }
            catch(err){
                console.log(err.message)
            }


            /*If successful, return a JWT */

            res.json({
                success: true,
                token: token
            })
            try{
                redis.disconnect()
            }
            catch(err){
                console.log(err.message)
            }
            break;
            default:
                res.statusCode = 405
                res.json({
                    message: "Only POST requests are allowed"
                })
    }
    
    
}


async function checkUser(number: string){
    const user = await prisma.user.findUnique({
        where:{
            phoneNumber: number
        },
    })
    console.log(user)
    //If the storename already exists
    if(user){
        return false
    }
    return true
}