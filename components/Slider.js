import sliderStyles from "../styles/Slider.module.css";
import Navbar from "./Navbar";
import Navigation from "./Navigation";
import MobileNavigation from "./MobileNavigation";
import Header from "./Header";
import Link from "next/link";

const Slider = () => {
  return (
    <div className= {sliderStyles.wrapper}>
          <Header/>
            <div className={sliderStyles.text}>
                <h1>Headline Text</h1>
                <p>Paragraph Text</p>
                <Link  href="/register">
                  <a className={sliderStyles.btn}>Register</a>
                </Link>
                <Link  href="/login">
                  <a className={sliderStyles.btn}>Login</a>
                </Link>
        </div>
        </div>
  )
}

export default Slider