import LoginForm from "../components/LoginForm";
import {getCsrfToken, getProviders} from "next-auth/react"

const Login = ({providers}) => {
    console.log(providers)
    return ( 
        <LoginForm providers={providers}/>
     );
}

export async function getServerSideProps(context){
    const providers = await getProviders()
    console.log("Hello")
    console.log(providers)
    return {
        props:{providers, csrfToken: await getCsrfToken(context)},
        
    }
}
 
export default Login;