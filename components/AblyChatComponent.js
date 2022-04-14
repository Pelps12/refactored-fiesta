import React, {useEffect, useState} from "react"
import {useChannel} from "../hooks/AblyReactEffect"

//configureAbly({key: "NL8toQ.CxidUQ:J9cjXtjPR1u6xGJhgfpVgFF_mP6okvVnppNofiv_WgQ", clientId: uuidv4()})
const AblyChatComponent = ()=>{
    let inputBox = null;
    let messageEnd = null;
    const [time, setTime] = useState("")

    const [messageText, setMessageText] = useState("");
    const [receivedMessages, setMessages] = useState([]);
    const messageTextIsEmpty = messageText.trim().length === 0;
    console.log(messages);
    useEffect(() =>{
      return () =>{
        ably.close()
      }
    }, [])
    const [channel, ably] = useChannel("chat-demo", (message) => {
        // Here we're computing the state that'll be drawn into the message history
        // We do that by slicing the last 199 messages from the receivedMessages buffer
    
        const history = receivedMessages.slice(-199);
        setMessages([...history, message]);
    
        // Then finally, we take the message history, and combine it with the new message
        // This means we'll always have up to 199 message + 1 new message, stored using the
        // setMessages react useState hook
      });
      console.log(ably);
      const sendChatMessage = (messageText) => {
        channel.publish({ name: "chat:message", data: messageText });
        setMessageText("");
        inputBox.focus();
      }

      const handleFormSubmission = (event) => {
        event.preventDefault();
        sendChatMessage(messageText);
        console.log(messages);
      }

      //For Enter Key
      const handleKeyPress = (event) => {
        if (event.charCode !== 13 || messageTextIsEmpty) {
          return;
        }
        sendChatMessage(messageText);
        event.preventDefault();
      }
      const messages = receivedMessages.map((message, index) => {
        console.log(index)
        const author = message.connectionId === ably.connection.id ? "me" : "other";
        return <div key={index}><span key={index} id={index} data-author={author}>{message.data}</span></div>;
      });

      useEffect(() => {
        messageEnd.scrollIntoView({ behaviour: "smooth" });
      })

      useEffect(() =>{
        setTime(new Date().toISOString())
      }, [])
      return (
        <div >
          <h2>Come on</h2>
          <form onSubmit={handleFormSubmission} >
            <textarea
              className="resize rounded-md p-2"
              ref={(element) => { inputBox = element; }}
              value={messageText}
              placeholder="Type a message"
              onChange={e => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              
            ></textarea>
            <div>
              <button className="px-4 bg-orange-300"type="submit"  disabled={messageTextIsEmpty}>Send</button>
            </div>
            
          </form>
        </div>
      )
    }
    
    export default AblyChatComponent;