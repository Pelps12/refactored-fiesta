import {NextApiRequest, NextApiResponse}from 'next'
//import Cookies from 'cookies'
import jwt from 'jsonwebtoken'
import {sellers} from "../../../data/data"


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
    

    const {storename, password} = req.body
    console.log(storename);

    /*Search for user */
    const seller = sellers.find(seller => seller.storename === storename)
    console.log(seller)

    /*If the user doesn't exist in the database */
    if(!seller){
        res.statusCode = 404
        res.json({
            success: false,
            error: "Seller not found"
        })
        return
    }

    /*If the user's password was incorrect */
    if (password != seller.password){
        res.statusCode = 403
        res.json({
            success:false,
            error: "Password incorrect"
        })
    }

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