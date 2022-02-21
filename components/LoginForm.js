import formStyle from "../styles/Form.module.css";
import {getProviders, signIn} from "next-auth/react"

const LoginForm = ({providers}) => {
    
  return (
      <div className={formStyle.wrapper}>
          {Object.values(providers).map((provider) =>(
              <div key ={provider.name}>
                  <button onClick={() => signIn(provider.id, {callbackUrl: "/"})}>
                      Sign in with {provider.name}
                  </button>
              </div>
          ))}
      </div>
   
  )
}


export default LoginForm