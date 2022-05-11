import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import handler from "./[id]"

export default async function test4(req:NextApiRequest, res: NextApiResponse){
    return res.status(200).json(req.rawHeaders)
}