import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import useSWRInfinite from "swr/infinite"
import {useChannel} from "../hooks/AblyReactEffect"
import Offer from "./Offer";
import {useRecoilState} from "recoil"
import { paymentState } from "../atoms/modalAtom";
import PaymentButton from "./PaymentButton";

const fetcher = (url) => fetch(url).then((res) =>res.json())
const PAGE_SIZE = 10;
const ChatBox = ({rId}) => {

  
  const [paymentOpen, setPaymentOpen] = useRecoilState(paymentState)
  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [volume, setVolume] = useState("")
  const [product, setProduct] = useState("")
  const [price, setPrice] = useState("")
  const[listings, setListings] = useState(null)
  const router = useRouter();
  console.log(`RRRRRRRRRIIIIIIIIIIIIIIDDDDDDDDDDD ${rId}`);
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
      console.log(session);
      
      if(session.roles === "seller"){
        console.log("SELLA");
      }
      console.log(rId);
      const [res1, res2] = await Promise.all([
        fetch(`/api/user/${rId}`),
        session.roles === "seller"? fetch(`/api/listing?seller=${session.id}`):
         fetch(`/api/listing?seller=${rId}`)
      ]) 
      if(res1.ok && res2.ok){
        const [data3, data4]= await  Promise.all([res1.json(), res2.json()])
        console.log(data3)
        setReceiver(data3)
        console.log(data4);
        if(data4.length > 0){
          setListings(data4)
          setProduct(data4[0].product.name)
        }
        
      }
      if(router.query.product !== undefined){
        setProduct(router.query.product)
        
        setOffer(true)
      }

      if(router.query.volume !== undefined){
        setVolume(router.query.volume)
        
        setOffer(true)
      }

      if(router.query.price !== undefined){
        setPrice(router.query.price)
        
        setOffer(true)
      }
    },[])
    

    const [messageText, setMessageText] = useState("");
    const [offer, setOffer] = useState(false);
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
      console.log(ably.channels);
        const receiver = ably.channels.get(`chat:${rId}`)
        console.log(receiver);
        let message = "";
        if(type === "text"){
          receiver.publish({ name: `message_sent`, data: {text: messageText} });
          message = {name: "message_sent", data: {text: messageText, r: rId}, connectionId: "me"}
        }
        else if(type=== "link"){
          receiver.publish({ name: `image_sent`, data: {link: messageText} });
          message = {name: "image_sent", data: {link: messageText, r: rId}, connectionId: "me"}
        }
        else if(type === "offer"){
          receiver.publish({ name: `offer_sent`, data: {offer: messageText} });
          message = {name: "offer_sent", data: {offer: messageText, r: rId}, connectionId: "me"}
          setOffer(false)
          
        }
        else{
          console.log("object");
          receiver.publish({ name: `offer_accepted`, data: {offer: messageText}});
          message ={name: "offer_accepted", data: {offer: messageText, r: rId}, connectionId: "me"}
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
        setOffer(!offer)
        console.log("Discount")
      }

      const sendOffer = (message) =>{
        console.log(product);
        

        sendMessage(message, "offer")
      }
      

    const handleSubmit = (e) =>{
        e.preventDefault();
        console.log("Hello");
        if(isFilePicked){
          fileUpload(selectedFile)
        }
        console.log(messageText);
        if(messageText !== "" && messageText !== undefined ){
          sendMessage(messageText, "text");
        }
        if(offer){
          const listing = listings.find(listing => listing.product.name === product)
        console.log(listing);
        const message = {
          listing: listing._id,
          price: price,
          volume: volume,
          product: product,
          sameSeller: listing.seller._id === session.id
        }
          sendOffer(message)
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
        const getListingInfo = ( name) =>{
          
          console.log(name);
        }

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
                        <li key={message._id} className={`flex ${author !== "me"? "justify-start" : "justify-end" }`}>
                            <div className={`inline-block w-fit max-w-sm lg:max-w-xl px-4 py-2 text-gray-700 rounded shadow ${author === "me"? "bg-[#FFA500] text-right": "bg-gray-100 text-left"}`}>
                            {message.message.data?.text !== undefined &&<span className="block" data-author={author}>{message.message.data.text}</span>}
                                {message.message.data?.link !== undefined && <img className="object-cover rounded-md" src={message.message.data?.link} />}
                                {message.message.name === "offer_sent" && 
                                <Offer 
                                  offer = {message.message.data.offer}
                                  sendMessage = {sendMessage}
                                  author={author}
                                />}
                                {message.message.name === "offer_accepted" &&
                                <div>
                                    <PaymentButton
                                      listingId={message.message.data.offer.listing}
                                      amount={message.message.data.offer.price}
                                      bargain= {"true"}
                                      sameSeller={listings.find(listing => listing.seller._id === session.id)?._id === message.message.data.offer.listing}
                                    />
                                </div> }
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
                        const isSeller = message.name === "offer_accepted" && listings?.find(listing => listing?.seller._id === session.id)?._id === message.data.offer.listing
                        return(
                        <li key={index} className={`flex ${message.name === "offer_accepted"? "justify-center": author !== "me"? "justify-start" : "justify-end"} ${message.name === "offer_accepted" &&  
                        isSeller && "hidden"} mb-1`}>
                            <div className={`object-scale-down relative max-w-sm  lg:max-w-xl px-4 py-2 text-gray-700 rounded shadow ${author === "me"? "bg-[#FFA500]": "bg-gray-100"}`}>
                            {message.data?.text !== undefined &&<span className="block" data-author={author}>{message.data.text}</span>}
                                {message.data?.link !== undefined && <img className="object-cover rounded-md" src={message.data?.link} />}
                                {message.name === "offer_sent" && 
                                <Offer 
                                  offer = {message.data.offer}
                                  sendMessage = {sendMessage}
                                  author={author}
                                />}
                                {message.name === "offer_accepted" &&
                                <div>
                                    <PaymentButton
                                      listingId={message.data.offer.listing}
                                      amount={message.data.offer.price}
                                      bargain= {"true"}
                                      sameSeller={isSeller}
                                    />
                                </div> }
                                
                            </div>

                            
                        </li>)
                    })
                }
                </ul>
                <div ref={(element) => { messageEnd = element; }}></div>
            </div>

            <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
              
                
              
                <input type="file" className="hidden" id="fileUploadInput" onChange={addFile}/>
              <button onClick={openInput} disabled={isFilePicked}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 mx-2" fill="currentColor" viewBox="0 0 487 487"
                  >
                  <g>
                    <path d="M308.1,277.95c0,35.7-28.9,64.6-64.6,64.6s-64.6-28.9-64.6-64.6s28.9-64.6,64.6-64.6S308.1,242.25,308.1,277.95z
                      M440.3,116.05c25.8,0,46.7,20.9,46.7,46.7v122.4v103.8c0,27.5-22.3,49.8-49.8,49.8H49.8c-27.5,0-49.8-22.3-49.8-49.8v-103.9
                      v-122.3l0,0c0-25.8,20.9-46.7,46.7-46.7h93.4l4.4-18.6c6.7-28.8,32.4-49.2,62-49.2h74.1c29.6,0,55.3,20.4,62,49.2l4.3,18.6H440.3z
                      M97.4,183.45c0-12.9-10.5-23.4-23.4-23.4c-13,0-23.5,10.5-23.5,23.4s10.5,23.4,23.4,23.4C86.9,206.95,97.4,196.45,97.4,183.45z
                      M358.7,277.95c0-63.6-51.6-115.2-115.2-115.2s-115.2,51.6-115.2,115.2s51.6,115.2,115.2,115.2S358.7,341.55,358.7,277.95z"/>
                  </g>
                </svg>
              </button>


              <div className={` w-full mx-auto`}>
               
              {isFilePicked && <div><img className="object-cover max-w-sm w-full max-h-xs rounded-lg mx-auto" src={image}/></div>}
              
              
              {offer && <div className=" bg-gray-100 py-2 pl-4 mx-3 mb-3">
                <div className={`p-2 mx-auto w-full`}>
                  <div className={` ${session.roles === "buyer" && "hidden"} ${receiver?.data.roles === "buyer"&& "hidden"}`}>
                  <button className={`px-4 `} onClick={ (e) =>{e.preventDefault(); getListingInfo("BUY")}}>
                  BUY
                </button>
                <button className="px-4" onClick={ (e) =>{e.preventDefault(); getListingInfo("SELL")}}>SELL</button>
                  </div>
                
                    <form>
                      <div className="body-form">
                      <label htmlFor="product">Product:</label>
                            <select
                                className="ml-4 form-select text-base"
                                
                                placeholder="Product Name"
                                required
                                value={product}
                                onChange={(e) => setProduct(e.target.value=== "Select an Option" ? "": e.target.value)}
            
                                name="product"
                            >
                              <option defaultValue="none" selected disabled hidden>Select Product</option>
                              {
                                listings?.map((listing) => {
                                  return <option key = {listing._id} >{listing.product.name}</option>
                                })
                              }
                            </select>
                            
                      </div>
                      <div className="body-form">
                      <label htmlFor="volume">Volume:</label>
                      <input size="4" className="ml-4" type="text" 
                      onChange={(e) => setVolume(e.target.value=== "Select an Option" ? "": e.target.value)}
                      value={volume}></input>
                            <select
                                className="ml-4 form-select text-base"
                                
                                placeholder="Product Name"
                                required
                                value={messageText}
                                
                                name="email"
                                autoComplete="email"
                            >
                              <option defaultValue="none">pt</option>
                            </select>
                      </div>

                      <div className="body-form">
                      <label htmlFor="product">Price:</label>
                      <input 
                      onChange={(e) => setPrice(e.target.value=== "Select an Option" ? "": e.target.value)}
                      size="4" className="ml-8" type="text" value={price}></input>
                      </div>

                      
                         <button type="submit" onClick={handleSubmit} className=" bg-[#FFA500] m-2 py-3 px-3 rounded-md">
                          SEND OFFER
                        
                      </button>
                  </form></div>
                
                </div>}
              
                
                {<div><input type="text" placeholder="Message" value={messageText}
                onKeyPress={handleKeyPress}
                ref={(element) => { inputBox = element; }}
                onChange={e => setMessageText(e.target.value)}
                  className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                  name="message" required /></div>}
                
                
              </div>
                
              
      
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
              {console.log(isFilePicked)}
              <button type="submit" onClick={ handleSubmit} disabled={messageText === "" && !isFilePicked}>
                <svg className="w-5 h-5 text-gray-500 origin-center transform rotate-90 mx-2" xmlns="http://www.w3.org/2000/svg"
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