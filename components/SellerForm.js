import formStyle from "../styles/SellerForm.module.css";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

const SellerForm = () => {
    const [sellerDetails, setSellerDetails] = useState({
        accountBank: "",
        accountNumber: "",
        storeName: "",
        startTime: "",
        closingTime: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSellerDetails({ ...sellerDetails, [name]: value });
    };
    const {accountBank, accountNumber, storeName, startTime, closingTime} =
        sellerDetails;
    const [permission, setPermission] = useState("")
    const watch = false;
    const [lat, setLat] = useState()
    const [long, setLong] = useState()
    useEffect(async () =>{
        if(navigator.geolocation){
            const permission = await navigator.permissions
                .query({name: "geolocation"})
                
            if(permission.state === "granted"){
                setPermission(permission.state)
                navigator.geolocation.getCurrentPosition((pos) =>{
                    console.log(pos);
                    setLat(pos.coords.latitude);
                    setLong(pos.coords.longitude)
                });
            }
            else if(permission.state === "prompt"){
                setPermission(permission.state)
                navigator.geolocation.getCurrentPosition((pos) =>{
                    console.log(pos);
                    setLat(pos.coords.latitude);
                    setLong(pos.coords.longitude)
                }, (err) => {
                    console.warn(`ERROR(${err.code}): ${err.message}`);
                  }, options
                  );
                
            }
            else if (permission.state === "denied"){
                setPermission(permission.state)
                //Show intrusctins to enable location
            }
            permission.onchange = () =>{
                console.log(this);
            }
        }else{
            alert("Contact the developers")
        }
    }, [])

   const handleSubmit = async (e) =>{
       e.preventDefault()
        console.log(sellerDetails);
        console.log(lat, long)
        const response = await fetch('/api/seller/register', {
            body: JSON.stringify({
                accountBank: accountBank,
                accountNumber: accountNumber,
                storename: storeName,
                startTime: startTime,
                closingTime: closingTime,
                lat: lat,
                long: long
            }),
            headers: {
                "content-Type": "application/json"
            },
            method: "POST"
        })
        
        if(response.ok){
            const result = await response.json()
            console.log(result);
            signOut({callbackUrl: "http://localhost:3000"})
        }
        else{
            alert("Error")
        }
        
   }
    return (
        <div className={formStyle.wrapper}>
            <div className={formStyle.imageBox}>

            </div>
            <div className={formStyle.content}>
            <div className={formStyle.formBox}>
                <form onSubmit={handleSubmit}>
                <h2>Become a Seller</h2>
                <div className={formStyle.inputBox}>
                            <label htmlFor="accountbank">Account Bank:</label>
                            <input
                                className="input"
                                type="text"
                                placeholder="Account Bank"
                                name="accountBank"
                                value={accountBank}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={formStyle.inputBox}>
                            <label htmlFor="accountnumber">Account Number:</label>
                            <input
                                className="input"
                                type="number"
                                placeholder="Account Number"
                                value={accountNumber}
                                name="accountNumber"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={formStyle.inputBox}>
                            <label htmlFor="storename">Store Name:</label>
                            <input
                                className="input"
                                type="text"
                                placeholder="Store Name"
                                value={storeName}
                                name="storeName"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={formStyle.inputBox}>
                            <label htmlFor="starttime">Start Time:</label>
                            <input
                                className="input"
                                type="time"
                                placeholder="Start Time"
                                value={startTime}
                                name="startTime"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={formStyle.inputBox}>
                            <label htmlFor="closingtime">Closing Time:</label>
                            <input
                                className="input"
                                type="time"
                                placeholder="Closing Time"
                                value={closingTime}
                                name="closingTime"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={formStyle.inputBox}>
                            <input type="submit" value="REGISTER" />

                        </div>
                        
                </form>
                </div>
            </div>
        </div>
    )
}

export default SellerForm