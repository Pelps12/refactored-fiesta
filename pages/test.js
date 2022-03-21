import {useState} from "react"

const Test = () => {
    const [disabled, setDisabled] = useState(false)
    const handlePayment = async () => {
        setDisabled(true)
        const res = await fetch('api/user/pay', {
            body: JSON.stringify({
                listingId: "6237b7c596cf5f0de39c108f",
                amount: "30000",
                bargain: "true"
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
        <div>
            <h2>Test Flutterwave</h2>
            <button disabled={disabled} onClick={handlePayment}>Twitter</button>
        </div>
    );
}
 
export default Test;