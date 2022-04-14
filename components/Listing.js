import PaymentButton from "./PaymentButton";
import Image from "next/image"
import {useRouter} from "next/router"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const Listing = ({listing}) => {
    const [sameSeller, setSameSeller] = useState(false)
    const router = useRouter()
    console.log(listing.seller.profilePic);
    
    const {data:session, status} = useSession()

    useEffect(() =>{
        //console.log(session.id)
        if(session?.id === listing.seller._id){
            setSameSeller(true)
        }
    }, [session])
    console.log(sameSeller);

    const handleRedirect = (e) =>{
        e.preventDefault() 
        router.push(`/chat/${listing.seller._id}`)
    }
    return ( 
        <div className="grid grid-cols-4 md:grid-cols-1 sm:undo:grid drop-shadow-xl m-4 px-2 py-4 bg-slate-100 rounded-md">
            <div className="col-span-3 grid grid-cols-3 md:grid-cols-1">
                <div className="flex justify-center px-2 py-4">
                    <Image 
                    className="rounded-full col-span-1"
                    src={listing.seller.image}
                    alt="Profile Pic"
                    width={100}
                    height={100}/>
                </div>

                <div className="text-center col-span-2 my-auto">
                    <h2 className="text-xl md:text-3xl px-2 md:py-4">{listing.seller.storename}</h2>
                    <h3 className="text-lg md:text-2xl px-1 md:py-3">₦{listing.startingPrice}</h3>
                </div>
                
            </div>

            
            
                <div className="my-auto xl:grid xl:grid-cols-2  justify-end col-span-1">
                    <div className="  my-auto mx-auto md:my-2  flex justify-end">
                        <PaymentButton listingId={listing._id}
                                    amount={listing.startingPrice} 
                                    sameSeller={sameSeller}
                                    bargain={"false"}/>
                    </div>

                    <div className=" my-2 mx-auto flex justify-end">
                        <button className="p-4 py-1.5 mx-auto bg-[#ffa500] rounded-md text-sm md:text-md" disabled={sameSeller } onClick={handleRedirect}>BARGAIN</button>
                    </div>
                    
                </div>
                
        </div>
        

     );
}
 
export default Listing;