import React from "react";
import NavbarPage from "../navbar/page";
import DeliveryDetailsForm from "./DeliveryDetailsForm";

const DeliveryDetailsPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <NavbarPage />
            <br />
            <br/>
            <br/>
            
            
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Delivery Details</h1>
                    <p className="text-slate-500">Please provide your shipping information for future orders.</p>
                </div>

                <React.Suspense fallback={<div className="text-center py-10"><p className="text-slate-500">Loading delivery form...</p></div>}>
                    <DeliveryDetailsForm />
                </React.Suspense>
            </div>
        </div>
    );
};

export default DeliveryDetailsPage;
