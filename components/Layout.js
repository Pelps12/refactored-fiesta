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
    <body className="flex flex-col min-h-screen">
    
    <Header></Header>
    <main className = {styles.container} > {children} </main>
    <Footer/>
    </body>
  )
}

export default Layout