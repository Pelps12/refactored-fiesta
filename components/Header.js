import sliderStyles from "../styles/Slider.module.css";
import Navbar from "./Navbar";
import Navigation from "./Navigation";
import MobileNavigation from "./MobileNavigation";
import { MdOutlineAccountCircle } from "react-icons/md";
import navStyle from "../styles/DesktopNav.module.css";
import {CgCloseO} from "react-icons/cg";
import IconLinks from "./IconLinks";
import { RiUser3Line } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from "next/link";

const Header = () => {
  const { data: session, status } = useSession();
  const [auth, setAuth] = useState(false);
  
    if (status === 'authenticated' && session.role === 'seller') {
      setAuth(true);
    }
  
  const [open, setOpen] = useState(false);
  const hamburgerIcon = <FaRegUser className={navStyle.hamburger} size='30px' color="white" onClick={()=> setOpen(!open)}/>;
  const closeIcon = <CgCloseO className={navStyle.hamburger} size='40px' color="white" onClick={()=> setOpen(!open)}/>;
  const closeMobileMenu = () => setOpen(false);

  return (
    <div className={sliderStyles.header}>
      <h1 className={sliderStyles.logo}><Link href="/">Las Price</Link></h1>
      <Navigation/>
      <MobileNavigation/>
      <div className={sliderStyles.btnIcon}>
      {auth ? <Link className={sliderStyles.navAnchor} href="/seller"><button className={sliderStyles.navBtn}>Become a Seller</button></Link> : <Link className={sliderStyles.navAnchor} href="/seller"><button className={sliderStyles.navBtn}>Become a Seller</button></Link>}
      {/* <a className={sliderStyles.navAnchor} href=""><button className={sliderStyles.navBtn}><MdOutlineAccountCircle size={33}/></button></a> */}
      <nav className={sliderStyles.navIcon}>
        {open ? closeIcon : hamburgerIcon}
        {open && <IconLinks isMobile={true} closeMobileMenu={closeMobileMenu} />}
    </nav>
      </div>
      
      </div>
  )
}

export default Header

