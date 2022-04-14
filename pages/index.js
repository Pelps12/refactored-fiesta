import {getAvailable} from "./api/test"
import Head from 'next/head';
import Body from '../components/Body';

//export const config = {amp: true}
export default function Home({locations, products}) {
  return (
    <>
    <Head>
      <title>Las Price</title>
      <meta name='description' content='An online grocery market with bargaining'/>
    </Head>
      <Body locations={locations} products={products}></Body>
    </>
   
  )
}


export async function getServerSideProps(){
  console.log(21);
  const result = await getAvailable()
  console.log(result);
  
  console.log("207");
  console.log(result);
  return{
      props: {
          locations: result.location,
          products: result.product
      }
  }
  
}

