<<<<<<< HEAD
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
    <li className={navStyle.navList} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="">Home</Link></li>
    <li className={navStyle.navList} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="">About</Link></li>
    <li className={navStyle.navList} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="">Contact</Link></li>
    {auth ? null :     <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="">Sign Up</Link></li>}
    {auth ?     <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="">Account</Link></li> :     <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="/login">Log In</Link></li>}
    {sellerAuth ? <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="">Seller</Link></li> : <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><Link className={navStyle.navAnchor} href="/register/seller">Become Link Seller</Link></li>}
  </ul>
  )
}

=======
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
    {sellerAuth ? <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><a className={navStyle.navAnchor} href="/dashboard">Dashboard</a></li> : <li className={`${navStyle.navList} ${navStyle.hideMenu}`} onClick={()=> props.isMobile && props.closeMobileMenu()}><a className={navStyle.navAnchor} href="/register/seller">Become a Seller</a></li>}
  </ul>
  )
}

>>>>>>> 268e705aaa17b085317e004f7161fe552b4bc7be
export default NavLinks