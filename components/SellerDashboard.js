import React from 'react';
import dashboardStyle from '../styles/SellerDashboard.module.css';

const SellerDashboard = () => {
    return (
        <div className={dashboardStyle.container}>
            {/* <div className={dashboardStyle.addListing}>
                HH
            </div> */}
            <div className={dashboardStyle.card}>
                <div className={dashboardStyle.img}>
                    <img src="https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-800x825.jpg" alt="" />
                </div>
                <div className={dashboardStyle.infoBox}>
                    <div className={dashboardStyle.title}>
                        Tomato
                    </div>
                    <div className={dashboardStyle.price}>
                        $125
                    </div>
                    <div className={dashboardStyle.buttons}>
                        <button className={dashboardStyle.edit}>Edit</button>
                        <button className={dashboardStyle.delete}>Delete</button>
                    </div>
                </div>
            </div>


        </div>

    )
}

export default SellerDashboard