import navStyle from "../styles/NavLinks.module.css";
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from "next/link";

const NavLinks = (props) => {
  const { data: session, status } = useSession();
  const [auth, setAuth] = useState(false);
  const [sellerAuth, setSellerAuth] = useState(false);
  useEffect(() => {
    if (status === 'authenticated') {
      //Linklert(session?.roles)
      console.log("Ini "+session?.roles)
      setAuth(true);
      if(session?.roles === 'seller'){
        //Linklert("hello")
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
    <li className={navStyle.navList} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="/">Home</Link></li>
    <li className={navStyle.navList} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="/about">About</Link></li>
    <li className={navStyle.navList} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="/contact">Contact</Link></li>
    {auth ? null :     <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="/register">Sign Up</Link></li>}
    {auth ?     <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="/dashboard">Account</Link></li> :     <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="/login">Log In</Link></li>}
    {sellerAuth ? <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="/dashboard">Seller</Link></li> : <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="/register/seller">Become Link Seller</Link></li>}
  </ul>
  )
}

export default NavLinks