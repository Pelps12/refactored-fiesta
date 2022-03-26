import { useEffect } from "react";
import SellerDashboard from "../components/SellerDashboard";
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
    return ( <SellerDashboard/> );
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