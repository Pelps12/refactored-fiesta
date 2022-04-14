import dynamic from "next/dynamic";

const AblyChatComponent = dynamic(() => import ("../../components/AblyChatComponent"), {ssr: false})
const Chat = () => {
    return(<AblyChatComponent/>)
    
}
 
export default Chat;