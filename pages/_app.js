import Layout from '../components/Layout'
import mixpanel from "mixpanel-browser";
import {SessionProvider} from "next-auth/react"
import '../styles/globals.css'
import { useEffect } from 'react';
import {MixPanelTracking} from "../util/Mixpanel"
import Head from "next/head"
import {io} from "socket.io-client"
import {useSession} from "next-auth/react"
import Cookies from 'js-cookie'


function MyApp({ Component, pageProps:{session, ...pageProps} }) {
  useEffect(() =>{
    
    MixPanelTracking.getInstance().pageViewed();
  }, [])
  


  return (
    <SessionProvider session={session}>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
          rel="stylesheet"/>
      </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
    </SessionProvider>

  )
}

export default MyApp
