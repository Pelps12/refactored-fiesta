import Navbar from "./Navbar";
import Slider from "./Slider";
import Footer from "./Footer";
import styles from "../styles/Layout.module.css";
import Header from "./Header";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import SecondHeader from "./SecondHeader";
import formStyle from "../styles/Layout.module.css";
//import { useChannel } from "../hooks/AblyReactEffect";

import { createContext } from "react";


const AblyContext = createContext(null);

const Layout = ( { children } ) => {
  const router = useRouter();
  const showHeader = router.pathname === "/" ? false : true;

  const {data: session, status} = useSession();
  if(status === "authenticated"){
    console.log("authenticated");
  }
  else if (status === "unauthenticated"){
    console.log("unauthenticated")
  }

/*   const [ably] = useChannel("chat:621fb31ac574020064b45528", (msg) =>{
    console.log(msg);
  }) */
  return (
    
        <div className={Layout.container}>
          <div className="flex flex-col h-screen">
            <header >
              <Header/>
            </header>
      
            <main className="flex-grow p-4"> {children} </main>
            <Footer/>
          </div>
        </div>
  
    
    
  )
}

export default Layout