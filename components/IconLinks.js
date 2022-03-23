import React from 'react';
import iconStyles from '../styles/IconLink.module.css';

const IconLinks = () => {
  return (
    <div className={iconStyles.action}>
        <div className={iconStyles.menu}>
           <h3>First Last</h3>
            <ul>
                <li><a href="">Sign Up</a></li>
                <li><a href="">Log In</a></li>
                <li><a href="">My Profile</a></li>
            </ul>
        </div>
        
    </div>
  )
}

export default IconLinks