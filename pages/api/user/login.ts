import {NextApiRequest, NextApiResponse}from 'next'
import getCookies from '../cookies'
import {redis} from "../../redis"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { checkToken } from '../token'
import {prisma} from "../../prisma"



/*!!!!!DO NOT FORGET TO CHANGE THIS */
const KEY = process.env.JWT_SECRET;
console.log(redis.status)

export default async function handle(req: NextApiRequest, res:NextApiResponse){

    switch(req.method){
        case "POST":
            if(!req.body){
                res.statusCode = 404
                res.json({
                    success: false
                })
                res.end("Error!")
                return
            }
            
        
            const {phoneNumber, password} = req.body
            console.log(phoneNumber);
            const jwtVal = getCookies(req, 'jwt')
            console.log("JWT Value: "+ jwtVal)
            const id:string = await checkUser(phoneNumber, password)
            const loggedIn:string = await checkToken(jwtVal)
            console.log(loggedIn)
        
            if(loggedIn === "validBuyer"){
                res.statusCode= 403,
                res.json({
                    error: "Already logged in"
                })
                return
            }
        
            if(id){
                enum Description {
                    Seller = "Seller",
                    Buyer = "Buyer"
                }
        
                const token: string = jwt.sign(
                    {
                        id: id,
                        description: Description.Buyer
                    },
                    KEY, {
                        expiresIn: '14d'
                    })
                /*If successful, return a JWT */
                //WILL BE STORED IN CACHE FOR LOGOUT FEATURE
                //Set the token as valid in Redis cache
                //Expire it after 14 days + 1 hour
                try{
                    redis.set(token, "validBuyer", "EX", 1213200)
                    console.log("hello")
                }
                catch(err){
                    console.log(err.message)
                }
        
            
        
        
                res.json({
                    success: true,
                    token: token
                })

                
            }
            else{
                res.json({
                    success: false,
                    error: "Username or password invalid"
                    
                })
                return
            }
            
        break;

        default:
            res.statusCode = 405
            res.json({
                message: "Only POST requests are allowed"
            })
            return
    }
    /*If no request body provided */
   
}

async function checkUser(phoneNumber:string, password:string): Promise<string | null>{
    
    //Check database if seller exists
    const user = await prisma.user.findUnique({
        where:{
            phoneNumber
        },
    })

    //If non-existent user return false
    if(!user){
        return null
    }
    const match = await bcrypt.compare(password, user.passwordHash)

    //If wrong password return false
    if(!match){
        return null
    }

    return user.id
}

