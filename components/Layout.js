import Navbar from "./Navbar";
import Slider from "./Slider";
import Footer from "./Footer";
import styles from "../styles/Layout.module.css";
import Header from "./Header";
import { useRouter } from "next/router";
import SecondHeader from "./SecondHeader";
import formStyle from "../styles/Layout.module.css";




const Layout = ( { children } ) => {
  const router = useRouter();
  const showHeader = router.pathname === "/" ? false : true;
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