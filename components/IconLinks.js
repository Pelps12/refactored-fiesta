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
          <li>{auth ? <Link href="/register">Messages</Link> : <Link href="/register">Sign Up</Link>}</li>
          {auth ? null : <li><Link href="/login">Log In</Link></li>}
          {auth ? <li><Link href="">Account</Link></li> : null}
          {auth ? <li><Link onClick={handleSubmit}>Sign Out</Link></li> : null}
        </ul>
      </div>

    </div>
  )
}

export default IconLinks