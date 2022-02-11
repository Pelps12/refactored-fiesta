import {NextApiRequest, NextApiResponse}from 'next'
import {prisma} from "../../prisma"


export default async function(req:NextApiRequest, res:NextApiResponse){
    const url:URL = new URL(req.url, `http://${req.headers.host}`)
    const category:string = url.searchParams.get('category')
    //const limit = parseInt(url.searchParams.get('limit'))

    if(category){
        const products = await prisma.product.findMany({
            where:{
                category
            },
            select:{
                id:true,
                image: true,
                name:true

            }
            
        })
        res.statusCode = 200
        res.json({
            products
        })
    }
    res.statusCode = 404
    res.json({
        error: "Specify your category"
    })

}