import Link from 'next/link';
import navStyles from '../styles/Navbar.module.css';
import { FaBars } from "react-icons/fa";
import Navigation from './Navigation';
import MobileNavigation from './MobileNavigation';


const Navbar = () => {
  return (
    <header>
      <h1 className={navStyles.logo}>Las-Las</h1>
      <Navigation/>
      <MobileNavigation/>
      <a className={navStyles.navAnchor} href=""><button className={navStyles.navBtn}>Become a Seller</button></a>

    </header>
  )
}

export default Navbar