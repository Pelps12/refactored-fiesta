import Ably from "ably/promises";
import { useEffect } from 'react'

const ably = new Ably.Realtime.Promise({ authUrl: '../api/createTokenRequest', autoConnect:true});

export function useChannel(channelName, callbackOnMessage) {
    const channel = ably.channels.get(channelName);

    const onMount = () => {
        //ably.connect()
        console.log(ably.connection.state);
        if(ably.connection.state === "closed" || ably.connection.state === "closing" || ably.connection.state === "disconnected"){
            ably.connect()
        }
        
        channel.subscribe(msg => { callbackOnMessage(msg); });
    }

    const onUnmount = () => {
        channel.unsubscribe();
        console.log(ably.connection.state);
    }

    const useEffectHook = () => {
        onMount();
        return () => { onUnmount(); };
    };

    useEffect(useEffectHook);

    return [channel, ably];
}