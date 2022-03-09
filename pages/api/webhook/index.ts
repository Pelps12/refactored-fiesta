import {NextApiRequest, NextApiResponse} from "next"
import {Server} from "socket.io"

export const config={
    api:{
        bodyParser: false
    }
}

export default function handler(req: NextApiRequest, res: any){
    if(!res.socket.server.io){
        console.log("*First use, starting socket.io")

        const io = new Server(res.socket.server)
        console.log(io)
        io.on("connection", socket=>{
            socket.broadcast.emit("a user connected")
            socket.on("hello", msg=>{
                socket.emit("Hello", "World!")
            })
        })

        res.socket.server.io = io

    }else{
        console.log("socket.io already running")
    }
    res.end()
}