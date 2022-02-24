import RegisterForm from "../components/RegisterForm";
import {getProviders} from "next-auth/react"
const Register = ({providers}) => {
    return ( 
        <RegisterForm providers ={providers}/>
     );
}
 export async function getServerSideProps(context){
    const providers = await getProviders()
    console.log("Hello")
    return {
        props:{providers},
    }
}
export default Register;