import { useSession} from "next-auth/react";


const Home = () => {
    console.log(origin);
    const { data: session, status } = useSession()
    if (status === "authenticated") {
        
        console.log(session.user)
      }
    return ( <h1>DASHBOARD</h1> );
}

export default Home;