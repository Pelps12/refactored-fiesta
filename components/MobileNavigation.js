import NavLinks from "./NavLinks";
import navStyle from "../styles/DesktopNav.module.css";
import {CgMenuRound} from "react-icons/cg";
import {CgCloseO} from "react-icons/cg";
import { useState } from "react";

const MobileNavigation = () => {
    const [open, setOpen] = useState(false);
    const hamburgerIcon = <CgMenuRound className={navStyle.hamburger} size='40px' color="white" onClick={()=> setOpen(!open)}/>;
    const closeIcon = <CgCloseO className={navStyle.hamburger} size='40px' color="white" onClick={()=> setOpen(!open)}/>;
    const closeMobileMenu = () => setOpen(false);
  return (
    
    <nav className={navStyle.mobileContainer}>
        {open ? closeIcon : hamburgerIcon}
        {open && <NavLinks isMobile={true} closeMobileMenu={closeMobileMenu} />}
    </nav>
    
 
  )
}

export default MobileNavigation