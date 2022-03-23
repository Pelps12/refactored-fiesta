import PaymentButton from "./PaymentButton";
import Image from "next/image"
import listingStyles from "../styles/Body.module.css"
import { createLanguageServiceSourceFile } from "typescript";

const Listing = ({listing}) => {
    console.log(listing.seller.profilePic);
    return ( 
        <div className="drop-shadow-xl m-4 p-4 bg-white">
            <div className="grid grid-cols-3">
                <div>
                    <Image 
                    className="profile-pic"
                    src={listing.seller.image}
                    alt="Profile Pic"
                    width={100}
                    height={100}/>
                    <style jsx global>{`
                        .profile-pic {
                            border-radius: 100%;
                        }
                    `}</style>
                </div>
                <div className="col-span-2 self-center">
                    <h2 className="text-3xl">{listing.seller.storename}</h2>
                    <h3>₦{listing.startingPrice}</h3>
                </div>
                
                
            </div>
            
            
            
                <PaymentButton listingId={listing._id}
                            amount={listing.startingPrice} 
                            bargain={"false"}/>
        </div>
        

     );
}
 
export default Listing;