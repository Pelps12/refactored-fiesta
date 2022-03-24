import React from 'react';
import iconStyles from '../styles/IconLink.module.css';
import Link from 'next/link';

const IconLinks = () => {
  return (
    <div className={iconStyles.action}>
        <div className={iconStyles.menu}>
           <h3>First Last</h3>
            <ul>
                <li><a href="/register">Sign Upp</a></li>
                <li><a href="/login">Log In</a></li>
                <li><a href="">My Profile</a></li>
            </ul>
        </div>
        
    </div>
  )
}

export default IconLinks