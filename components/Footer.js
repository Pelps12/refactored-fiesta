import footerStyle from "../styles/Footer.module.css";
import {TiSocialTumbler} from 'react-icons/ti'

const Footer = () => {
  return (
    <div className= {footerStyle.container}>
        <div className={footerStyle.socialIcons}>
          <TiSocialTumbler size='30px'/>
          <TiSocialTumbler size='30px'/>
          <TiSocialTumbler size='30px'/>
          <TiSocialTumbler size='30px'/>
          <TiSocialTumbler size='30px'/>
        </div>
        <div className={footerStyle.text}>
          <p>LASLAS All Rights Reserved</p>
        </div>
    </div>
  )
}

export default Footer