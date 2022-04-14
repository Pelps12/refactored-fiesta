import Link from 'next/link';
import navStyles from '../styles/Navbar.module.css';
import { FaBars } from "react-icons/fa";
import { MdOutlineAccountCircle } from "react-icons/md";
import Navigation from './Navigation';
import MobileNavigation from './MobileNavigation';


const Navbar = () => {
  return (
    <header>
      <Navigation/>
      <MobileNavigation/>

    </header>
  )
}

export default Navbar