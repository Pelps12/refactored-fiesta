import React from 'react';
import PaymentButton from "./PaymentButton";
import dashboardStyle from '../styles/SellerDashboard.module.css';


const SellerListing = () => {
    return (

        <div className="drop-shadow-xl m-4 px-2 py-4 bg-cyan-200 rounded-md">
            <div >

                <div className="text-center">
                    <h2 className="text-3xl px-2 py-4">Hello</h2>
                    <h3 className="text-2xl px-1 py-3">₦10000</h3>
                </div>


            </div>


            <div className="text-center">
                <div className='inline-flex' >
                    <button className="ml-8 inline p-4 py-1.5 mx-auto bg-orange-500 rounded-md"><h2>Edit</h2></button>
                    <button className="ml-8 inline p-4 py-1.5 mx-auto bg-orange-500 rounded-md"><h2>Delete</h2></button>
                </div>
            </div>

        </div>

    )
}

export default SellerListing