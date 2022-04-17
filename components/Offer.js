import { useEffect, useState } from "react";
import PaymentButton from "./PaymentButton";
import {useRecoilState} from "recoil"
import { paymentState } from "../atoms/modalAtom";


const Offer = ({offer, sendMessage, author}) => {
    const INITIAL_PRICE = price;
    const [accOrCounter, setaccOrCounter] = useState("ACCEPT");

    const [paymentOpen, setPaymentOpen] = useRecoilState(paymentState)
    const [sent, setSent] = useState(false)
    const [iprice, setIPrice] = useState(offer.volume)
    const [volume, setVolume] = useState(offer.volume)
    const [price, setPrice] = useState(offer.price)
    

    useEffect(() =>{
        setIPrice(offer.price)
        console.log(author);
    }, [])

    const handleDecline = (e) =>{
        e.preventDefault()
        setaccOrCounter("COUNTER")
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        console.log(offer);
        const message = {
            listing: offer.listing,
            price: price,
            volume: volume,
            product: offer.product,
            sameSeller: offer.sameSeller
          }
        if(accOrCounter === "COUNTER"){
            console.log(offer);

            sendMessage(message, "offer")
            setPrice(offer.price)
            setSent(true)
        }else{
            console.log("NOICE");
            sendMessage(message, "accepted")
            setSent(true)
            if(!offer.sameSeller){
                setPaymentOpen(true)
            }
            
        }
    }
    
    return ( 
    <div className="p-3 mx-auto ">
        <div className="mx-auto">
            <h2 className="text-3xl font-medium text-center">OFFER</h2>
            <h3 className="text-xl font-normal text-center">{offer.product}</h3>
            <div className="mr-0 justify-center flex flex-col ">
                <input size="4" className="mx-auto relative text-center rounded-md" type="text" 
                        onChange={(e) => {setPrice(e.target.value); console.log(price); (e.target.value !== iprice)? setaccOrCounter("COUNTER"): setaccOrCounter("ACCEPT")}}
                        value={price}></input>
            </div>
            
        </div>

        <div className="my-auto grid grid-cols-2  justify-end col-span-1">
                    <div className="px-3  my-auto mx-auto   flex justify-end">
                    <button className="p-4 py-2 mx-auto bg-red-600 rounded-md text-sm md:text-md" 
                    disabled={author === "me" || sent}
                        onClick={handleDecline}>
                            DECLINE</button>
                    </div>

                    <div className=" my-2 mx-auto flex justify-end" disabled={author === "me"}>
                        <button className="p-4 py-2 mx-auto bg-green-600 rounded-md text-sm md:text-md" disabled={author === "me" || sent} onClick={handleSubmit}>
                            {accOrCounter}</button>
                    </div>
                    
                </div>

    </div>);
}
 
export default Offer;