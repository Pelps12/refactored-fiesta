import navStyle from "../styles/NavLinks.module.css";
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

const NavLinks = (props) => {
  const { data: session, status } = useSession();
  const [auth, setAuth] = useState(false);
  const [sellerAuth, setSellerAuth] = useState(false);
  useEffect(() => {
    if (status === 'authenticated') {
      //alert(session?.roles)
      console.log("Ini "+session?.roles)
      setAuth(true);
      if(session?.roles === 'seller'){
        //alert("hello")
        setSellerAuth(true)
      }
    }
  }, [session])
  function handleSubmit(e) {
    e.preventDefault();
    signOut({callbackUrl: "http://localhost:3000"});
  }
  return (
    <ul className={navStyle.navLink}>
    <li className={navStyle.navList} onClick={()=> props.isMobile && props.closeMobileMenu()}><a className={navStyle.navAnchor} href="">Home</a></li>
    <li className={navStyle.navList} onClick={()=> props.isMobile && props.closeMobileMenu()}><a className={navStyle.navAnchor} href="">About</a></li>
    <li className={navStyle.navList} onClick={()=> props.isMobile && props.closeMobileMenu()}><a className={navStyle.navAnchor} href="">Contact</a></li>
    {auth ? null :     <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><a className={navStyle.navAnchor} href="">Sign Up</a></li>}
    {auth ?     <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><a className={navStyle.navAnchor} href="">Account</a></li> :     <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><a className={navStyle.navAnchor} href="/login">Log In</a></li>}
    {sellerAuth ? <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><a className={navStyle.navAnchor} href="">Seller</a></li> : <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><a className={navStyle.navAnchor} href="/register/seller">Become a Seller</a></li>}
  </ul>
  )
}

export default NavLinks