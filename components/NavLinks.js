import navStyle from "../styles/NavLinks.module.css"

const NavLinks = (props) => {
  return (
    <ul className={navStyle.navLink}>
    <li className={navStyle.navList} onClick={()=> props.isMobile && props.closeMobileMenu()}><a className={navStyle.navAnchor} href="">Home</a></li>
    <li className={navStyle.navList} onClick={()=> props.isMobile && props.closeMobileMenu()}><a className={navStyle.navAnchor} href="">About</a></li>
    <li className={navStyle.navList} onClick={()=> props.isMobile && props.closeMobileMenu()}><a className={navStyle.navAnchor} href="">Contact</a></li>
    <li className={navStyle.navList} onClick={()=> props.isMobile && props.closeMobileMenu()}><button className={navStyle.navBtn} href="">Become a Seller</button></li>
  </ul>
  )
}

export default NavLinks