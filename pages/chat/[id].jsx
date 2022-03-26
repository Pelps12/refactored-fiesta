import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ChatSideBar from "../../components/ChatSideBar"
import ChatBox from "../../components/ChatBox";

const ChatById = () => {
    const router = useRouter()
    const {id} = router.query
    const {data: session, status} = useSession()
    if(status === "authenticated"){
        return ( 
            <div className="grid grid-cols-4 m-3 w-auto">
                <div className="col-span-1 py-4 px-6">
                    <ChatSideBar/>
                </div>
                <div className="bg-blue-100 col-span-3 py-4 px-6">
                    <ChatBox rId={session.id} sId={id}/>
                </div>
            </div>
        );

    }
    else if(status === "loading"){
        return(
            <p>Loading...</p>
        ); 
    }
    else{
        return (
            <p>Fuck off</p>
        )
    }
    
}
 
export default ChatById;