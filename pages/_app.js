import Layout from '../components/Layout'
import mixpanel from "mixpanel-browser";
import {SessionProvider} from "next-auth/react"
import '../styles/globals.css'
import { useEffect } from 'react';
import {MixPanelTracking} from "../util/Mixpanel"
import {io} from "socket.io-client"
import {useSession} from "next-auth/react"
import Cookies from 'js-cookie'


function MyApp({ Component, pageProps:{session, ...pageProps} }) {
  useEffect(() =>{
    MixPanelTracking.getInstance().pageViewed();
  }, [])
  


  return (
    <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
    </SessionProvider>

  )
}

export default MyApp
