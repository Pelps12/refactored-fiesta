import {NextApiRequest, NextApiResponse}from 'next'
import DOMPurify from 'isomorphic-dompurify'
import {getSession} from "next-auth/react"
import bcrypt from 'bcrypt'
import clientPromise from '../../../lib/mongodb'
var Mixpanel = require('mixpanel');
import {v4 as uuidv4} from "uuid"
const mixpanel = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);

//SALT FOR PASSWORD HASH
const saltRounds = 10




/*!!!!!DO NOT FORGET TO CHANGE THIS */
const KEY = process.env.JWT_SECRET
console.log(KEY)
export default async function sellerReg(req: NextApiRequest, res:NextApiResponse){
    switch(req.method){
        case "POST":
            const client = await clientPromise;
            const db = client.db(process.env.MONGODB_DB)
            const session:any = await getSession({req})
            if(session){
                return res.status(403).json({error: "Already logged in"})
            }


            /*If no request body provided */
            if(!req.body){
                return res.status(400).json({status: "fail", error:"Body required"})
            }
            

            let {name, password, email} = req.body

            //NEVER TRUST THE CLIENT
            name = DOMPurify.sanitize(name)
            email = DOMPurify.sanitize(email)
            password = DOMPurify.sanitize(password)

            const passwordHash:string = await bcrypt.hash(password, saltRounds)
            console.log(passwordHash)

            /*Search for user */
            //Call checkUser

            /*If the user already exist in the database */
            if(! await checkUser(name, db)){
                console.log("Hello I enterd here")
                 return res.status(409).json({success:false, error: "User already exists"})
            }
            else{
                try{
                    const user = await db.collection("users").insertOne({name: name, email: email, password: passwordHash, roles: "buyer", profilePic: null})
                    res.status(201).json({status: "success", data: user})

                    const [first_name, last_name]: string[] = name.split(" ")
                    mixpanel.people.set(user.insertedId, {
                        $first_name: first_name,
                        $last_name: last_name,
                        $email: email
                    })
                    mixpanel.track("Sign Up", {
                        distinct_id: user.insertedId,
                        $insert_id: uuidv4(),                
                  
                      })
                      
                }catch(error){
                    res.status(500).json({status: "fail", error: error})
                }
                
            }

        break;
        default:
            res.status(405).json({
                 message: "Only POST requests are allowed"
            })
    }
    
    
}


async function checkUser(email: string, db:any){
    const user = await db.collection("users").findOne({email: email})
    console.log("User: " +user)
    //If the storename already exists
    if(user){
        return false
    }
    console.log("False")
    return true
}