import footerStyle from "../styles/Footer.module.css";
import {TiSocialFacebook, TiSocialTwitter, TiSocialInstagram} from 'react-icons/ti'
import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
const CustomFacebook = React.forwardRef(({onClick, href}, ref) => {
  return(
    <div className="mx-auto">
       <TiSocialFacebook size='30px' />
    </div>
   
  )
})

const CustomTwitter = React.forwardRef(({onClick, href}, ref) => {
  return(
    <div className="mx-auto">
       <TiSocialTwitter size='30px' />
    </div>
   
  )
})

const CustomInstagram = React.forwardRef(({onClick, href}, ref) => {
  return(
    <div className="mx-auto">
       <TiSocialInstagram size='30px' />
    </div>
   
  )
})

const Footer = () => {

  return (
    <footer className="p-4 align-items-center content-center mx-auto bg-[#ff8243] w-full "> 
    
      <div className="grid grid-cols-3 content-center mx-auto">
        <Link href="/">
          <CustomFacebook/>
        </Link>
        <Link href="/">
          <CustomTwitter/>
        </Link>
        <Link href="/">
          <CustomInstagram/>
        </Link>

    </div>
    <div className={footerStyle.text}>
        <p>LASLAS All Rights Reserved</p>
      </div>
    </footer>
  )
}
Footer.displayName = "footer"
CustomFacebook.displayName = "facebook"
CustomInstagram.displayName="instagram"
CustomTwitter.displayName="twitter"
export default Footer