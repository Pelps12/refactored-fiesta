import Layout from '../components/Layout'
import {getSession, SessionProvider} from "next-auth/react"
import '../styles/globals.css'
import { useEffect } from 'react';
import {MixPanelTracking} from "../util/Mixpanel"
import {RecoilRoot} from "recoil"
import Head from "next/head"


function MyApp({ Component, pageProps:{session, ...pageProps} }) {
  useEffect(() =>{
    
    MixPanelTracking.getInstance().pageViewed();
    
    console.log(Component);
  }, [])
  useEffect(async () =>{
    //await startAbly()
  }, [])
  


  return (
    <SessionProvider session={session}>
      <RecoilRoot> 
        <Head>
          <link
            href='https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
            rel="stylesheet"/>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
          <Layout>
            <Component {...pageProps} />
          </Layout>
       </RecoilRoot> 
      
    </SessionProvider>

  )
}

export default MyApp
