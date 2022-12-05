import Layout from '../components/Layout'
import {getSession, SessionProvider} from "next-auth/react"
import '../styles/globals.css'
import { createContext, useEffect } from 'react';
import {MixPanelTracking} from "../util/Mixpanel"
import { configureAbly } from '@ably-labs/react-hooks';
import {RecoilRoot} from "recoil"
import Head from "next/head"
//import { useChannel } from '../hooks/AblyReactEffect';

configureAbly({
  authUrl: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/createTokenRequest`
});

function MyApp({ Component, pageProps:{session, ...pageProps} }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  useEffect(async() =>{
    //const session = await getSession()
    console.log(session);
    MixPanelTracking.getInstance().pageViewed();
    
    //console.log(Component);
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
            {
              getLayout(<Component {...pageProps}/>)
            }
            

       </RecoilRoot> 
      
    </SessionProvider>

  )
}

export default MyApp
