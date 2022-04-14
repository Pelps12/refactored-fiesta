import sliderStyles from "../styles/SecondHeader.module.css";
import Navbar from "./Navbar";
import Navigation from "./Navigation";
import MobileNavigation from "./MobileNavigation";

const SecondHeader = () => {
  return (
    <div className={sliderStyles.header}>
    <h1 className={sliderStyles.logo}>LasPrice</h1>
    <Navigation/>
    <MobileNavigation/>
    <a className={sliderStyles.navAnchor} href=""><button className={sliderStyles.navBtn}>Become a Seller</button></a>
    </div>
  )
}

export default SecondHeader