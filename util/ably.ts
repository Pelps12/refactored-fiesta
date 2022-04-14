import {configureAbly} from "@ably-labs/react-hooks"
import { Types } from "ably";
import { getSession } from "next-auth/react"
interface chHook {
    channel: Types.RealtimePromise |Types.RealtimeChannelPromise,
    ably: Types.RealtimePromise |Types.RealtimeChannelPromise
}

let ably =false
export async function startAbly() {
    const session:any=await getSession();
    
    
    if(ably && session){
        configureAbly({key: process.env.ABLY_API_KEY, clientId: session.id})
        ably= true
    }
    else{
        ably=false
    }
}