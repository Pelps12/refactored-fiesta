import {NextApiRequest, NextApiResponse}from 'next'
//import Cookies from 'cookies'
import jwt from 'jsonwebtoken'
import {users} from "../../../data/data"


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
    

    const {username, password} = req.body
    console.log(username);

    /*Search for user */
    const user = users.find(user => user.username === username)
    console.log(user)

    /*If the user doesn't exist in the database */
    if(!user){
        res.statusCode = 404
        res.json({
            success: false,
            error: "User not found"
        })
        return
    }

    /*If the user's password was incorrect */
    if (password != user.password){
        res.statusCode = 403
        res.json({
            success:false,
            error: "Password incorrect"
        })
    }

    /*If successful, return a JWT */
    res.json({
        success: true,
        token: jwt.sign(
            {
            username,
            admin: username === 'admin' && password === 'admin'
        },
        KEY, {
            expiresIn: '30d'
        })
    })
}