import Ably from "ably"
const Chat = () => {
    const ably = new Ably.Realtime('xVLyHw.ON_aWw:NTpTN9BLuDotz0Mo6AoBKY8mjk_PEsZOOZcyDXJo_OA');
    ably.connection.on('connected', () => {
    alert('Connected to Ably!');
    });
    return ( <h1>Chat</h1> );
}
 
export default Chat;