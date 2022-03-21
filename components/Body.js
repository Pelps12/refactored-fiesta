import bodyStyles from "../styles/Body.module.css"

const Body = () => {
    return (
        <div className={bodyStyles.wrapper}>
            <div className={bodyStyles.left}>
                <form className={bodyStyles.bodyForm} action="">
                   <div className={bodyStyles.bodyLocation}>
                   <label for="location">Location</label>
                    <select name="location" id={bodyStyles.location}>
                        <option value="ikotun">Ikotun</option>
                        <option value="igando">Igando</option>
                        <option value="Lekki">Lekki</option>
                    </select>
                   </div>
                    <div className={bodyStyles.bodyProduct}>
                    <label for="product">Product</label>
                    <select name="product" id={bodyStyles.product}>
                        <option value="pepper">Pepper</option>
                        <option value="elubo">Elubo</option>
                        <option value="maggi">Maggi</option>
                    </select>
                    </div>
                    <input className={bodyStyles.bodySubmit} type="submit" value="Submit"/>
                </form>
            
            </div>
            <div className={bodyStyles.right}>
                <div className={bodyStyles.products}>
                    Products
                </div>
                <div className={bodyStyles.products}>
                    Products
                </div>
                <div className={bodyStyles.products}>
                    Products
                </div>
                <div className={bodyStyles.products}>
                    Products
                </div>
                <div className={bodyStyles.products}>
                    Products
                </div>
                <div className={bodyStyles.products}>
                    Products
                </div>
                <div className={bodyStyles.products}>
                    Products
                </div>
            </div>
        </div>
    )
}

export default Body