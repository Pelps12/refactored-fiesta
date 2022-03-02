import {NextApiRequest, NextApiResponse} from "next"
import * as jose from 'jose'

export default async function test(req:NextApiRequest, res:NextApiResponse){
    const {publicKey, privateKey} = await jose.generateKeyPair("ES256")
    console.log(privateKey);
    const jwtClaims = {
        "sub": "I really sunno",
        "name": "Oluwapelumi Adegoke"
    }
    
    const jwt = await new jose.SignJWT(jwtClaims)
    .setProtectedHeader({ alg: 'ES256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(privateKey)
    console.log("Yes")
    const secret2 = await jose.generateSecret("HS256")
    console.log(await jose.exportSPKI(publicKey))
    const jwe = await new jose.EncryptJWT({jwt}).setExpirationTime('2h').setProtectedHeader({ alg: 'dir', enc: 'A256GCM' }).encrypt(secret2)
    console.log(await jose.exportJWK(secret2))
    console.log(jwe) 
    return res.status(200).json({token: jwe})
}