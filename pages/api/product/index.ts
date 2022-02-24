import {NextApiRequest, NextApiResponse}from 'next'
import { getToken } from 'next-auth/jwt';
import { connectToDatabase } from '../../../util/mongodb';
import {prisma} from "../../prisma"


export default async function(req:NextApiRequest, res:NextApiResponse){
    const url:URL = new URL(req.url, `http://${req.headers.host}`)
    const category:string = url.searchParams.get('category')
    //const limit = parseInt(url.searchParams.get('limit'))
    const {db} = await connectToDatabase();

    switch(req.method){
        case "GET":
            if(category){
                console.log(category);
                const products = await db
                                .collection("products")
                                .find({category: category})
                                .project({name: 1, image: 1})
                                .toArray();
        
                 return res.status(200).json({
                    products
                })
            }
            return res.status(404).json({
                error: "Specify your category"
            })
        break;
        case "POST":
            const token = await getToken({req})

            if(token?.roles === "admin"){
                let{productName, imageURL, isPerishable, categori} = req.body

                //Don't forget to sanitize input
                const listing = await db
                    .collection("listings") //Remember to sanitize the body
                    .insertOne({
                                name: productName,
                                createdAt: new Date(),
                                image: imageURL,
                                perishable: isPerishable,
                                category: categori
                                 })
                    res.status(201).json(listing)
            }else{
                return res.status(403).json({error: "Not Authorized"})
            }
    }
    

}