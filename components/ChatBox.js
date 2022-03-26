import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {v4 as uuidv4} from "uuid"
import {configureAbly, useChannel} from "@ably-labs/react-hooks"


configureAbly({key: "NL8toQ.CxidUQ:J9cjXtjPR1u6xGJhgfpVgFF_mP6okvVnppNofiv_WgQ", clientId: uuidv4(), authUrl: "/api/createTokenRequest"})
const ChatBox = ({rId}) => {

    
    const {data: session, status} = useSession()
    let inputBox = null;
    let messageEnd = null;
    const [time, setTime] = useState("")

    const [messageText, setMessageText] = useState("");
    const [receivedMessages, setMessages] = useState([]);
    const messageTextIsEmpty = messageText.trim().length === 0;
    useEffect(()=>{
        console.log(session);
        
    }, [session])
    
    
        
    const [channel, ably] = useChannel(`chat:message`, (message) =>{

        const history = receivedMessages.slice(-199);
        setMessages((prev) =>[...prev, message])
        
    })
    
    

    const sendChatMessage =  (messageText) => {
        
        channel.publish({ name: "chat:message", data: messageText });
        setMessageText("");
        inputBox?.focus();
      }

    const handleSubmit = (e) =>{
        e.preventDefault();
        sendChatMessage(messageText);
        console.log(receivedMessages);
    }
    const handleKeyPress = (event) => {
        if (event.charCode !== 13 || messageTextIsEmpty) {
          return;
        }
        sendChatMessage(messageText);
        event.preventDefault();
      }
    

      const messages = "";
    
      useEffect(() => {
        messageEnd.scrollIntoView({ behaviour: "smooth" });
      })
    
    
    return ( 
    <div>
        <div className="hidden lg:col-span-2 lg:block">
          <div className="w-full">
            <div className="relative flex items-center p-3 border-b border-gray-300">
              <img className="object-cover w-10 h-10 rounded-full"
                src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg" alt="username" />
              <span className="block ml-2 font-bold text-gray-600">Emma</span>
              <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3">
              </span>
            </div>
            <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
              <ul className="space-y-2">
                {
                    receivedMessages.map((message, index) =>{
                        const author = message.connectionId === ably.connection.id ? "me" : "other";
                        console.log(message.data);
                        return(
                        <li key={index} className={`flex ${author !== "me"? "justify-start" : "justify-end"}`}>
                            <div className={`relative max-w-xl px-4 py-2 text-gray-700 rounded shadow ${author === "me"? "bg-gray-100": null}`}>
                                <span className="block" data-author={author}>{message.data}</span>
                            </div>
                        </li>)
                    })
                }
                </ul>
                <div ref={(element) => { messageEnd = element; }}></div>
            </div>

            <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              <input type="text" placeholder="Message" value={messageText}
              onKeyPress={handleKeyPress}
              ref={(element) => { inputBox = element; }}
              onChange={e => setMessageText(e.target.value)}
                className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                name="message" required />
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button type="submit" onClick={handleSubmit}>
                <svg className="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
            
          
     );
}
 
export default ChatBox;