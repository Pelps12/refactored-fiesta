import { useRouter } from "next/router";
import {useState} from "react"

const PaymentButton = ({listingId, amount, bargain, sameSeller}) => {
    const [disabled, setDisabled] = useState(false)
    const router = useRouter()
    console.log(sameSeller);
    const handlePayment = async () => {
        setDisabled(true)
        const res = await fetch('http://localhost:3000/api/user/pay', {
            body: JSON.stringify({
                listingId: listingId,
                amount: amount,
                bargain: bargain
            }),
            headers:{
                "content-Type": "application/json"
            },
            method: "POST"
        })
        console.log(res);
        try{
            if(res.ok){
                const result = await res.json()
                if(result.status === "success"){
                    window.open(result.data.link, "_self")
                }
                else{
                    setDisabled(false)
                    alert("Error")
                    console.log("Error")
                }
            }
            else{
                setDisabled(false)
                console.log(await res.json());
                router.push("/login")
                console.log("Error")
            }
            
        }catch(err){
            setDisabled(false)
            alert("Error")
            console.log("Error")
        }
        
      };
    return (
        
            <button className="p-4 py-1.5 mx-auto bg-[#ffa500] rounded-md text-sm md:text-md"disabled={sameSeller || disabled} onClick={handlePayment}>BUY</button>
        
    );
}
 
export default PaymentButton;