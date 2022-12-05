import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ChatSideBar from "../../components/ChatSideBar"
import Layout from "../../components/Layout";
import dynamic from "next/dynamic";
import Head from "next/head";

const ChatBox = dynamic(() => import ("../../components/ChatBox"), {ssr: false})

const ChatById = () => {
    const router = useRouter()
    const {id} = router.query
    const {data: session, status} = useSession()
    if(status === "authenticated"){
        return ( 
                <div className="lg:grid lg:grid-cols-4 lg:m-3 w-auto">
                    <Head>
                        <title>Las Price | Chat</title>
                    </Head>
                    <div className="lg:col-span-1 py-4 px-6">
                        <ChatSideBar/>
                    </div>
                    <div className="drop-shadow-md lg:col-span-3 py-4 h-[75vh]  px-2 lg:px-6">
                        <ChatBox rId={id} sId={id}/>
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

ChatById.getLayout = function getLayout(page) {
    return(
        <Layout chatComponent={true}>
            {page}
        </Layout>
    )
}