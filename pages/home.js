import { useEffect } from "react";
import { useSession, getCsrfToken, getSession } from "next-auth/react";
import { MixPanelTracking } from "../util/Mixpanel";

const Home = ({origin}) => {
    console.log(origin);
    const { data: session, status } = useSession()
    if (status === "authenticated") {
        
        console.log(session.user)
      }
    
    
    
    useEffect(() => async () =>{
        //Test localization        
        if(origin === "cross-site"){
            const session = await getSession();
            MixPanelTracking.getInstance().loggedIn(session);
        }
               
      }, [])
    return ( <h1>DASHBOARD</h1> );
}

export async function getServerSideProps(context){
    console.log(context.req.headers);
    return {
        props:{
                origin: context.req.headers["sec-fetch-site"]

            },
        
    }
}
export default Home;