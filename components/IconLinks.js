import React, { useEffect } from 'react';
import iconStyles from '../styles/IconLink.module.css';
import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';



const IconLinks = () => {
  const { data: session, status } = useSession();
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    if (status === 'authenticated') {
      setAuth(true);
    }
  }, [session])
  function handleSubmit(e) {
    e.preventDefault();
    signOut({callbackUrl: "http://localhost:3000"});
  }
  return (
    <div className={iconStyles.action}>
      <div className={iconStyles.menu}>
        {auth ? <h3>{session.user.name}</h3> : null}
        <ul>
          <li>{auth ? <a href="/register">Messages</a> : <a href="/register">Sign Up</a>}</li>
          {auth ? null : <li><a href="/login">Log In</a></li>}
          {auth ? <li><a href="">Account</a></li> : null}
          {auth ? <li><a onClick={handleSubmit}>Sign Out</a></li> : null}
        </ul>
      </div>

    </div>
  )
}

export default IconLinks