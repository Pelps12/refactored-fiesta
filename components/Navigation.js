import NavLinks from "./NavLinks";
import navStyle from "../styles/DesktopNav.module.css";

const Navigation = () => {
  return (
    <nav className={navStyle.desktopContainer}>
        <NavLinks/>
    </nav>
  )
}

export default Navigation