import formStyle from "../styles/SellerForm.module.css";
const SellerForm = () => {
    return (
        <div className={formStyle.wrapper}>
            <div className={formStyle.imageBox}>

            </div>
            <div className={formStyle.content}>
            <div className={formStyle.formBox}>
                <form action="">
                <h2>Become a Seller</h2>
                <div className={formStyle.inputBox}>
                            <label htmlFor="accountbank">Account Bank:</label>
                            <input
                                className="input"
                                type="text"
                                placeholder="Account Bank"
                                required
                            />
                        </div>
                        <div className={formStyle.inputBox}>
                            <label htmlFor="accountnumber">Account Number:</label>
                            <input
                                className="input"
                                type="number"
                                placeholder="Account Number"
                                required
                            />
                        </div>
                        <div className={formStyle.inputBox}>
                            <label htmlFor="storename">Store Name:</label>
                            <input
                                className="input"
                                type="text"
                                placeholder="Store Name"
                                required
                            />
                        </div>
                        <div className={formStyle.inputBox}>
                            <label htmlFor="starttime">Start Time:</label>
                            <input
                                className="input"
                                type="time"
                                placeholder="Start Time"
                                required
                            />
                        </div>
                        <div className={formStyle.inputBox}>
                            <label htmlFor="closingtime">Closing Time:</label>
                            <input
                                className="input"
                                type="time"
                                placeholder="Closing Time"
                                required
                            />
                        </div>
                        <div className={formStyle.inputBox}>
                            <label htmlFor="latitude">Latitude:</label>
                            <input
                                className="input"
                                type="text"
                                placeholder="Latitude"
                                required
                            />
                        </div>
                        <div className={formStyle.inputBox}>
                            <label htmlFor="longitude">Longitude:</label>
                            <input
                                className="input"
                                type="text"
                                placeholder="Longitude"
                                required
                            />
                        </div>
                        
                </form>
                </div>
            </div>
        </div>
    )
}

export default SellerForm