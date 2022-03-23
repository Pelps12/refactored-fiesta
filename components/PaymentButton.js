import {useState} from "react"

const PaymentButton = ({listingId, amount, bargain}) => {
    const [disabled, setDisabled] = useState(false)
    const handlePayment = async () => {
        setDisabled(true)
        const res = await fetch('api/user/pay', {
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
                alert("Error")
                console.log("Error")
            }
            
        }catch(err){
            setDisabled(false)
            alert("Error")
            console.log("Error")
        }
        
      };
    return (
        <div >
            <button className="p-4 py-1.5 mx-auto bg-orange-500 rounded-md"disabled={disabled} onClick={handlePayment}>PAY</button>
        </div>
    );
}
 
export default PaymentButton;