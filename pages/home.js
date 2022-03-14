import { useEffect } from "react";
import { useSession, getCsrfToken, getSession } from "next-auth/react";
import { MixPanelTracking } from "../util/Mixpanel";

const Home = ({origin}) => {
    console.log(origin);
    
    
    useEffect(async () =>{
        
        if(origin === "cross-site"){
            console.log("Heyo");
            const session = await getSession();
            console.log(session);
            MixPanelTracking.getInstance().loggedIn(session);
        }       
      }, [])
    return ( <h1>DASHBOARD</h1> );
}

export async function getServerSideProps(context){
    console.log(context.req.headers["sec-fetch-site"])
    const sess = await getSession(context)
   console.log(sess);
    return {
        props:{
                origin: context.req.headers["sec-fetch-site"]
            },
        
    }
}
export default Home;