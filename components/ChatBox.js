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
          message = {data: {text: messageText, r: rId}, connectionId: "me"}
        }
        else{
          receiver.publish({ name: `message_sent`, data: {link: messageText} });
          message = {data: {link: messageText, r: rId}, connectionId: "me"}
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

      const handleOffer = (e) =>{
        e.preventDefault();
        console.log("Discount")
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
            
            <div className="relative w-full lg:p-6 overflow-y-auto h-[40rem] " id="chat" onScroll={onScroll} ref={listInnerRef}>
              {/* <div className={`mx-auto content-center w-full ${isReachingEnd? "hidden": null}`}>
                <button className="bg-[#ff8243] px-4 py-3 mt-1 rounded-md" onClick={() => setSize(size +1)}>
                {isLoadingMore
                              ? "loading..."
                              : isReachingEnd
                              ? null
                              : "More"}
                </button>
              </div> */}
              <ul className="space-y-2 mb-0">
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
                      console.log(ably.connection.id);
                        const author = message?.connectionId === "me" ? "me" : "other";
                        console.log(message.data?.link)
                        return(
                        <li key={index} className={`flex ${author !== "me"? "justify-start" : "justify-end"} mb-1`}>
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
                
              
      
              <button type="submit" onClick={handleOffer}>
                <svg  className="w-5 h-5 mx-2 text-gray-500 " xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 209.281 209.281" fill="currentColor">
                  <g>
                    <path d="M207.17,99.424l-20.683-21.377l4.168-29.455c0.567-4.006-2.145-7.739-6.131-8.438l-29.298-5.137L141.285,8.739
                      c-1.896-3.575-6.287-4.998-9.919-3.223L104.64,18.582L77.916,5.517c-3.636-1.777-8.023-0.351-9.92,3.223L54.055,35.018
                      l-29.298,5.137c-3.985,0.698-6.698,4.432-6.131,8.438l4.167,29.455L2.11,99.424c-2.813,2.907-2.813,7.522,0,10.43l20.682,21.378
                      l-4.167,29.456c-0.566,4.005,2.146,7.738,6.13,8.438l29.299,5.14l13.942,26.275c1.896,3.574,6.284,5,9.919,3.223l26.724-13.062
                      l26.727,13.062c1.059,0.518,2.181,0.763,3.288,0.763c2.691,0,5.286-1.454,6.63-3.986l13.942-26.275l29.299-5.14
                      c3.984-0.699,6.697-4.433,6.13-8.438l-4.168-29.456l20.684-21.378C209.984,106.946,209.984,102.332,207.17,99.424z
                      M173.158,123.438c-1.608,1.662-2.359,3.975-2.035,6.266l3.665,25.902l-25.764,4.52c-2.278,0.4-4.245,1.829-5.329,3.872
                      l-12.26,23.105l-23.502-11.486c-1.039-0.508-2.166-0.762-3.294-0.762c-1.127,0-2.254,0.254-3.293,0.762l-23.5,11.486l-12.26-23.105
                      c-1.084-2.043-3.051-3.472-5.329-3.872l-25.764-4.52l3.664-25.902c0.324-2.29-0.427-4.603-2.036-6.265l-18.186-18.799
                      l18.186-18.797c1.608-1.662,2.36-3.975,2.036-6.265l-3.664-25.901l25.763-4.517c2.279-0.399,4.246-1.829,5.331-3.872l12.259-23.108
                      l23.499,11.489c2.078,1.017,4.508,1.017,6.588,0l23.501-11.489l12.26,23.108c1.084,2.043,3.051,3.473,5.33,3.872l25.763,4.517
                      l-3.665,25.901c-0.324,2.291,0.427,4.603,2.036,6.266l18.186,18.796L173.158,123.438z"/>
                    <path d="M80.819,98.979c10.014,0,18.16-8.146,18.16-18.158c0-10.016-8.146-18.164-18.16-18.164
                      c-10.015,0-18.162,8.148-18.162,18.164C62.657,90.834,70.805,98.979,80.819,98.979z M80.819,74.657c3.397,0,6.16,2.765,6.16,6.164
                      c0,3.396-2.764,6.158-6.16,6.158c-3.398,0-6.162-2.763-6.162-6.158C74.657,77.422,77.421,74.657,80.819,74.657z"/>
                    <path d="M140.867,68.414c-2.342-2.343-6.143-2.344-8.484,0l-63.968,63.967c-2.343,2.343-2.343,6.142,0,8.485
                      c1.172,1.172,2.707,1.757,4.243,1.757c1.535,0,3.071-0.586,4.243-1.757l63.967-63.967C143.21,74.556,143.21,70.757,140.867,68.414z
                      "/>
                    <path d="M128.46,110.301c-10.013,0-18.158,8.146-18.158,18.158c0,10.016,8.146,18.164,18.158,18.164
                      c10.016,0,18.164-8.148,18.164-18.164C146.624,118.447,138.476,110.301,128.46,110.301z M128.46,134.624
                      c-3.395,0-6.158-2.765-6.158-6.164c0-3.395,2.763-6.158,6.158-6.158c3.398,0,6.164,2.763,6.164,6.158
                      C134.624,131.858,131.859,134.624,128.46,134.624z"/>
                  </g>
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