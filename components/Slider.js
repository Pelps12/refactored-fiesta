import sliderStyles from "../styles/Slider.module.css";
import Navbar from "./Navbar";
import Navigation from "./Navigation";
import MobileNavigation from "./MobileNavigation";
import Header from "./Header";

const Slider = () => {
  return (
    <div className= {sliderStyles.wrapper}>
          <Header/>
            <div className={sliderStyles.text}>
                <h1>Headline Text</h1>
                <p>Paragraph Text</p>
                <a className={sliderStyles.btn} href="">Register</a>
                <a className={sliderStyles.btn} href="">Login</a>
        </div>
        </div>
  )
}

export default Slider