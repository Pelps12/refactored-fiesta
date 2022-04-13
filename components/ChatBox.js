import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import useSWRInfinite from "swr/infinite"
import {useChannel} from "../hooks/AblyReactEffect"

const fetcher = (url) => fetch(url).then((res) =>res.json())
const PAGE_SIZE = 10;
const ChatBox = ({rId}) => {

  

  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [image, setImage] = useState(null)
    const [receiver, setReceiver] = useState(null)
    const {data: session, status} = useSession()
    let inputBox = null;
    let messageEnd = null;
    const [time, setTime] = useState("")
    useEffect(() =>{
      
      setTime(Date.now())
      messageEnd.scrollIntoView({ behaviour: "smooth" });
      return(() => ably.close())
    }, [])
    useEffect(async () =>{
      const res = await fetch(`/api/user/${rId}`)
      if(res.ok){
        const data3 = await res.json()
        console.log(data3)
        setReceiver(data3)
      }
    },[])
    

    const [messageText, setMessageText] = useState("");
    const [receivedMessages, setMessages] = useState([]);
    const messageTextIsEmpty = messageText.trim().length === 0;
    useEffect(()=>{
        console.log(session);
        
    }, [session])

    
  const {data, error, mutate, size, setSize, isValidating} = useSWRInfinite(
    (index) =>
        `/api/user/message?with=${rId}&per_page=${PAGE_SIZE}&page=${index+1}&start=${time}`, fetcher, {revalidateOnFocus: false}
)

const oldMessages = data ? [].concat(...data) : [];
console.log(oldMessages)
const isLoadingInitialData = !data && !error
const isLoadingMore =
isLoadingInitialData ||
(size > 0 && data && typeof data[size - 1] === "undefined");
const isEmpty = data?.[0]?.length === 0;
const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
//const isRefreshing = isValidating && data && data.length === size;


    


    
    
    
        
    const [channel, ably] = useChannel(`chat:${session.id}`, (message) =>{
        console.log(message)
        const history = receivedMessages.slice(-199);
        setMessages((prev) =>[...prev, message])
        console.log(message);

        
    })
    
    

    const sendMessage =  (messageText, type) => {
        const receiver = ably.channels.get(`chat:${rId}`)
        let message = "";
        if(type === "text"){
          receiver.publish({ name: `message_sent`, data: {text: messageText} });
          message = {data: {text: messageText, r: rId}, connectionId: ably.connection.id}
        }
        else{
          receiver.publish({ name: `message_sent`, data: {link: messageText} });
          message = {data: {link: messageText, r: rId}, connectionId: ably.connection.id}
        }
         
        setMessages((prev) =>[...prev, message])
        setMessageText("");
        inputBox?.focus();
      }

      

      const fileUpload = async (selectedFile) =>{
        const formData = new FormData();
        console.log(selectedFile);
        formData.append("UPLOADCARE_PUB_KEY", process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY)
        formData.append("UPLOADCARE_STORE", "auto")
        formData.append(`my_file.jpg`, selectedFile, selectedFile.name)
        
    
        const response = await fetch("https://upload.uploadcare.com/base/", {
          method: "POST",
          body: formData
        })
        if(response.ok){
          console.log(response);
          const result = await response.json()
          console.log(result);
          const cdnUrl = `https://ucarecdn.com/${result["my_file.jpg"]}/${selectedFile.name}`
          sendMessage(cdnUrl, "link")
          setIsFilePicked(false)
          setSelectedFile(null)
          setImage(null)

        }
        else{
          console.log(response)
        }
      }

    const handleSubmit = (e) =>{
        e.preventDefault();
        
        if(isFilePicked){
          fileUpload(selectedFile)
        }
        else{
          sendMessage(messageText, "text");
        }
        
        //console.log(receivedMessages);
    }
    const handleKeyPress = (event) => {
        if (event.charCode !== 13 || messageTextIsEmpty) {
          return;
        }
        sendMessage(messageText, "text");
        event.preventDefault();
      }
    

      const messages = "";
    
      useEffect(() => {
        console.log(messageEnd);
        messageEnd.scrollIntoView({ behaviour: "smooth" });
      }, [receivedMessages])
    if(receiver && !error){
      console.log(receiver);
    }

    const addFile = (e) =>{

        console.log(e.target.files[0]);
        setSelectedFile(e.target.files[0]);
        setIsFilePicked(true);
    
        if (e.target.files && e.target.files[0]) {
          setImage(URL.createObjectURL(e.target.files[0]));
        }

        

      
    }

    const listInnerRef = useRef();
        const onScroll = (e) => {
          if (listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
            //console.log(scrollTop, scrollHeight, clientHeight);
            if (scrollTop  === 0) {
              if(!isLoadingMore && !isReachingEnd){
                setSize(size+1)
              }

              
              console.log("reached top");
            }
            if(scrollTop + clientHeight === scrollHeight){
              console.log(document.querySelector("#chat2").scrollHeight);
              console.log(scrollHeight,document.querySelector("#chat2").scrollHeight);
              window.scrollTo({top: document.documentElement.scrollHeight, behaviour: "auto"})
            }
          }
        };


    const openInput = (e) =>{
      e.preventDefault()
      document.getElementById("fileUploadInput").click()
    }
    
    return ( 
    <div id="chat2">
        <div className=" lg:col-span-2 lg:block">
          <div className="w-full">
            <div className="relative flex items-center p-3 border-b border-gray-300">
              <img className=" w-10 h-10 rounded-full"
              src={receiver?.data.image}
              alt="Profile Pic"
                 />
              <span className="block ml-2 font-bold text-gray-600">{receiver?.data.roles === "seller"? receiver?.data.storename: receiver?.data.name}</span>
              <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3">
              </span>
            </div>
            
            <div className="relative w-full lg:p-6 overflow-y-auto h-[40rem]" id="chat" onScroll={onScroll} ref={listInnerRef}>
              {/* <div className={`mx-auto content-center w-full ${isReachingEnd? "hidden": null}`}>
                <button className="bg-[#ff8243] px-4 py-3 mt-1 rounded-md" onClick={() => setSize(size +1)}>
                {isLoadingMore
                              ? "loading..."
                              : isReachingEnd
                              ? null
                              : "More"}
                </button>
              </div> */}
              <ul className="space-y-2">
                {
                    oldMessages.slice(0).reverse().map((message) =>{
                      const author = message.sender === session.id ? "me" : "other"
                      console.log(message)
                      return(
                        <li key={message._id} className={`flex ${author !== "me"? "justify-start" : "justify-end"}`}>
                            <div className={`inline-block w-fit max-w-sm lg:max-w-xl px-4 py-2 text-gray-700 rounded shadow ${author === "me"? "bg-[#FFA500] text-right": "bg-gray-100 text-left"}`}>
                                {typeof message.message?.text === "string"? message.message?.text: <img className="object-cover rounded-md" src={message.message?.link} />}
                            </div>
                        </li>)
                    })
                }
                {
                    receivedMessages.filter(message => message.clientId === rId || message.data?.r === rId).map((message, index) =>{
                      console.log(message);
                        const author = message?.connectionId === ably.connection.id ? "me" : "other";
                        console.log(message.data?.link);
                        return(
                        <li key={index} className={`flex ${author !== "me"? "justify-start" : "justify-end"}`}>
                            <div className={`object-scale-down relative max-w-sm  lg:max-w-xl px-4 py-2 text-gray-700 rounded shadow ${author === "me"? "bg-[#FFA500]": "bg-gray-100"}`}>
                                {message.data?.text !== undefined &&<span className="block" data-author={author}>{message.data.text}</span>}
                                {message.data?.link !== undefined && <img className="object-cover rounded-md" src={message.data?.link} />}
                            </div>
                        </li>)
                    })
                }
                </ul>
                <div ref={(element) => { messageEnd = element; }}></div>
            </div>

            <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
              
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              
                <input type="file" className="hidden" id="fileUploadInput" onChange={addFile}/>
              <button onClick={openInput} disabled={isFilePicked}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              
                {!isFilePicked&& <input type="text" placeholder="Message" value={messageText}
              onKeyPress={handleKeyPress}
              ref={(element) => { inputBox = element; }}
              onChange={e => setMessageText(e.target.value)}
                className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                name="message" required />}
              {isFilePicked && <div><img className="object-cover max-w-full max-h-sm rounded-lg" src={image}/></div>}
                
              
      
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button type="submit" onClick={ handleSubmit}>
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