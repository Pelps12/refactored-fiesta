import PaymentButton from "./PaymentButton";
import Image from "next/image"
import listingStyles from "../styles/Body.module.css"
import { createLanguageServiceSourceFile } from "typescript";

const Listing = ({listing}) => {
    console.log(listing.seller.image);
    return ( 
        <div className="drop-shadow-xl m-4 px-2 py-4 bg-cyan-200 rounded-md">
            <div >
                <div className="flex justify-center px-2 py-4">
                    <Image 
                    className="rounded-full"
                    src={listing.seller.image}
                    alt="Profile Pic"
                    width={100}
                    height={100}/>
                </div>
                <div className="text-center">
                    <h2 className="text-3xl px-2 py-4">{listing.seller.storename}</h2>
                    <h3 className="text-2xl px-1 py-3">₦{listing.startingPrice}</h3>
                </div>
                
                
            </div>
            
            
                <div className="text-center">
                    <PaymentButton listingId={listing._id}
                                amount={listing.startingPrice} 
                                bargain={"false"}/>
                </div>
                
        </div>
        

     );
}
 
export default Listing;