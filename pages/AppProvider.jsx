import {configureAbly} from "@ably-labs/react-hooks"
import {getSession} from "next-auth/react"

const AuthContext = createContext();

const AppProvider = (props) => {
    const { children } = props;
    return <RtProvider>{children}</RtProvider>;
  };

var RtProvider = (props) => {
    const getSesh = async() =>{
        return await getSession()
    }

    if(getSesh() !== null){
        configureAbly({key: process.env.ABLY_API_KEY, 
            useTokenAuth:true, 
            authUrl:"http://localhost:3000/api/createTokenRequest", 
            clientId: "1234"})
    }

    const contextObject = {
        ably: true
    }
    //return <AuthContext.Provider value={contextObject} {...props} />;
}

    
export default AppProvider