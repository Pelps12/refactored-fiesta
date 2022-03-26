import footerStyle from "../styles/Footer.module.css";
import {TiSocialFacebook, TiSocialTwitter, TiSocialInstagram} from 'react-icons/ti'
import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
const CustomFacebook = React.forwardRef(({onClick, href}, ref) => {
  return(
    <TiSocialFacebook size='30px' />
  )
})

const Footer = () => {

  return (
    <footer><div className={footerStyle.container}>
      <div className="grid grid-cols-3">
        <Link href="/">
          <CustomFacebook/>
        </Link>
      <TiSocialTwitter size='30px' />
      <TiSocialInstagram size='30px' />

    </div>
    <div className={footerStyle.text}>
        <p>LASLAS All Rights Reserved</p>
      </div>
    </div></footer>
  )
}

export default Footer