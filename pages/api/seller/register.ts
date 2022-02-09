import {NextApiRequest, NextApiResponse}from 'next'
import DOMPurify from 'isomorphic-dompurify'
//import Cookies from 'cookies'
import jwt from 'jsonwebtoken'
import {sellers} from "../../../data/data"


interface Seller{
    id: number,
    storename: string,
    location: number[]
    owner: string,
    password: string,
    createdAt: Date

}
/*!!!!!DO NOT FORGET TO CHANGE THIS */
const KEY = 'gfyrfu8gfibwe979r39r;[[pe]rgm3=jgo3[gk3=-'
export default function (req: NextApiRequest, res:NextApiResponse){

    /*If no request body provided */
    if(!req.body){
        res.statusCode = 404
        res.json({
            success: false
        })
        res.end("Error!")
        return
    }
    

    let {storename,long, lat, alt, owner, password} = req.body

    //NEVER TRUST THE CLIENT
    storename = DOMPurify.sanitize(storename)
    long = DOMPurify.sanitize(long)
    lat = DOMPurify.sanitize(lat)
    alt = DOMPurify.sanitize(alt)
    owner = DOMPurify.sanitize(owner)
    password = DOMPurify.sanitize(password)

    /*Search for user */
    const seller = sellers.find(seller => seller.storename === storename)
    console.log(seller)

    /*If the user already exist in the database */
    if(seller){
        res.statusCode = 409
        res.json({
            success: false,
            error: "Seller already exists"
        })
        return
    }

    //PLACEHOLDER FOR DATABASE
    const newSeller : Seller ={
        id: 2,
        storename,
        location: [parseFloat(lat), parseFloat(long), parseFloat(alt)],
        owner,
        password,
        createdAt: new Date(Date.now())
    }
    console.log(newSeller)
    sellers.push(newSeller)
    

    enum Description {
        Seller = "Seller",
        Buyer = "Buyer"
    }
    /*If successful, return a JWT */
    res.json({
        success: true,
        token: jwt.sign(
        {
            name: storename,
            description: Description.Seller
        },
        KEY, {
            expiresIn: '30d'
        })
    })
}