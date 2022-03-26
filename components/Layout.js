import Navbar from "./Navbar";
import Slider from "./Slider";
import Footer from "./Footer";
import styles from "../styles/Layout.module.css";
import Header from "./Header";
import { useRouter } from "next/router";
import SecondHeader from "./SecondHeader";




const Layout = ( { children } ) => {
  const router = useRouter();
  const showHeader = router.pathname === "/" ? false : true;
  return (
    <div className="flex flex-col h-screen">
    <header >
       <Header/>
    </header>
    
    <main className="flex-grow"> {children} </main>
    <Footer/>
    </div>
  )
}

export default Layout