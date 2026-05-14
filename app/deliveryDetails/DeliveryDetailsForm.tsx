"use client";

import React, { useState } from "react";
import { useDeliveryDetails } from "./useDeliveryDetails";
import { MapPin, Loader2, CheckCircle2, AlertCircle, Navigation, Trash2, ArrowRight, Plus } from "lucide-react";

const DeliveryDetailsForm = () => {
    const {
        deliveryDetails,
        loading,
        locating,
        success,
        error,
        fieldErrors,
        savedAddresses,
        handleInputChange,
        handleDetectLocation,
        handleCreateDeliveryDetails,
        handleSelectAddress,
        handleDeleteAddress,
        handleProceedToPayment,
        handleClearForm,
    } = useDeliveryDetails();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [addressIdToDelete, setAddressIdToDelete] = useState<string | null>(null);

    return (
        <div className="relative">
            {success && (
                <div className="mb-6 bg-emerald-50/80 backdrop-blur-sm border border-emerald-100 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium">Details processed successfully!</span>
                </div>
            )}

            {error && (
                <div className="mb-6 bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-800 px-4 py-3 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-5">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <form onSubmit={handleCreateDeliveryDetails} className="grid grid-cols-1 lg:grid-cols-5 gap-6" noValidate>
                {/* Card 1: Form Inputs (3/5 width) */}
                <div className="lg:col-span-3 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 p-6 md:p-8 relative overflow-hidden flex flex-col justify-between">
                    {/* Removed decorative blobs to remove "green shade" */}

                    <div className="space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block ml-1">Delivery Address</h2>
                        
                        {/* Personal Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="space-y-1">
                                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500 block ml-1">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={deliveryDetails.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-5 py-2.5 rounded-xl bg-slate-50 border ${fieldErrors.name ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"} focus:bg-white outline-none transition-all duration-200 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-slate-100`}
                                    required
                                />
                                {fieldErrors.name && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.name}</p>}
                            </div>

                            {/* Email (Read Only) */}
                            <div className="space-y-1">
                                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500 block ml-1">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="email@gmail.com"
                                    value={deliveryDetails.email}
                                    className="w-full px-5 py-2.5 rounded-xl border border-slate-100 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-sm shadow-sm shadow-slate-100"
                                    readOnly
                                    required
                                />
                                {fieldErrors.email && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.email}</p>}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1">
                            <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-500 block ml-1">Phone Number</label>
                            <input
                                id="phone"
                                type="tel"
                                placeholder="10-15 digit phone number"
                                value={deliveryDetails.phone}
                                onChange={handleInputChange}
                                className={`w-full px-5 py-2.5 rounded-xl bg-slate-50 border ${fieldErrors.phone ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"} focus:bg-white outline-none transition-all duration-200 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-slate-100`}
                                required
                            />
                            {fieldErrors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.phone}</p>}
                        </div>

                        {/* Auto-detect Location Button */}
                        <div>
                            <button
                                type="button"
                                onClick={handleDetectLocation}
                                disabled={locating}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-700 font-semibold py-2.5 px-4 rounded-2xl border border-emerald-100 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm shadow-sm"
                            >
                                {locating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Pinpointing location...
                                    </>
                                ) : (
                                    <>
                                        <Navigation className="w-4 h-4" />
                                        Auto-detect My Location
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Address */}
                        <div className="space-y-1">
                            <label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-slate-500 block ml-1">Street Address</label>
                            <input
                                id="address"
                                type="text"
                                placeholder="Full street address, apartment, etc."
                                value={deliveryDetails.address}
                                onChange={handleInputChange}
                                className={`w-full px-5 py-2.5 rounded-xl bg-slate-50 border ${fieldErrors.address ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"} focus:bg-white outline-none transition-all duration-200 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-slate-100`}
                                required
                            />
                            {fieldErrors.address && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.address}</p>}
                        </div>

                        {/* Landmark */}
                        <div className="space-y-1">
                            <label htmlFor="landmark" className="text-xs font-bold uppercase tracking-wider text-slate-500 block ml-1">Landmark (Optional)</label>
                            <input
                                id="landmark"
                                type="text"
                                placeholder="Near hospital, school, etc."
                                value={deliveryDetails.landmark}
                                onChange={handleInputChange}
                                className="w-full px-5 py-2.5 rounded-xl border border-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white outline-none transition-all duration-200 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-slate-100"
                            />
                        </div>

                        {/* City, State, Zip Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* City */}
                            <div className="space-y-1">
                                <label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-slate-500 block ml-1">City</label>
                                <input
                                    id="city"
                                    type="text"
                                    placeholder="City"
                                    value={deliveryDetails.city}
                                    onChange={handleInputChange}
                                    className={`w-full px-5 py-2.5 rounded-xl bg-slate-50 border ${fieldErrors.city ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"} focus:bg-white outline-none transition-all duration-200 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-slate-100`}
                                    required
                                />
                                {fieldErrors.city && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.city}</p>}
                            </div>

                            {/* State */}
                            <div className="space-y-1">
                                <label htmlFor="state" className="text-xs font-bold uppercase tracking-wider text-slate-500 block ml-1">State</label>
                                <input
                                    id="state"
                                    type="text"
                                    placeholder="State"
                                    value={deliveryDetails.state}
                                    onChange={handleInputChange}
                                    className={`w-full px-5 py-2.5 rounded-xl bg-slate-50 border ${fieldErrors.state ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"} focus:bg-white outline-none transition-all duration-200 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-slate-100`}
                                    required
                                />
                                {fieldErrors.state && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.state}</p>}
                            </div>

                            {/* Zip */}
                            <div className="space-y-1">
                                <label htmlFor="zip" className="text-xs font-bold uppercase tracking-wider text-slate-500 block ml-1">ZIP Code</label>
                                <input
                                    id="zip"
                                    type="text"
                                    placeholder="Postal Code"
                                    value={deliveryDetails.zip}
                                    onChange={handleInputChange}
                                    className={`w-full px-5 py-2.5 rounded-xl bg-slate-50 border ${fieldErrors.zip ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"} focus:bg-white outline-none transition-all duration-200 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-slate-100`}
                                    required
                                />
                                {fieldErrors.zip && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.zip}</p>}
                            </div>
                        </div>

                        {/* Country */}
                        <div className="space-y-1">
                            <label htmlFor="country" className="text-xs font-bold uppercase tracking-wider text-slate-500 block ml-1">Country</label>
                            <input
                                id="country"
                                type="text"
                                placeholder="Country"
                                value={deliveryDetails.country}
                                onChange={handleInputChange}
                                className={`w-full px-5 py-2.5 rounded-xl bg-slate-50 border ${fieldErrors.country ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"} focus:bg-white outline-none transition-all duration-200 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-slate-100`}
                                required
                            />
                            {fieldErrors.country && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.country}</p>}
                        </div>
                    </div>
                </div>

                {/* Card 2: Saved Addresses & Actions (2/5 width) */}
                <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 p-6 md:p-8 relative overflow-hidden flex flex-col justify-between">
                    {/* Removed decorative blobs to remove "green shade" */}

                    {/* Saved Addresses Section */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-emerald-500" />
                                Quick Select
                            </h2>
                            <button
                                type="button"
                                onClick={handleClearForm}
                                className="text-xs font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                title="Clear form to create new address"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add New
                            </button>
                        </div>
                        
                        {savedAddresses.length > 0 ? (
                            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent flex-1">
                                {savedAddresses.map((addr) => (
                                    <div 
                                        key={addr._id}
                                        className="bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-2xl p-4 cursor-pointer hover:border-emerald-500 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between relative"
                                        onClick={() => handleSelectAddress(addr)}
                                    >
                                        <button 
                                            className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent selecting the address
                                                setAddressIdToDelete(addr._id);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            title="Delete address"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <div>
                                            <p className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors pr-5 text-sm">{addr.name}</p>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-1 leading-relaxed">{addr.address}</p>
                                            <p className="text-xs text-slate-500">{addr.city}, {addr.state}</p>
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-slate-50 flex justify-between items-center">
                                            <span className="text-xs font-medium text-slate-400 group-hover:text-emerald-600 transition-colors">Click to use</span>
                                            <span className="w-4 h-4 rounded-full border-2 border-slate-200 group-hover:border-emerald-500 group-hover:bg-emerald-500 flex items-center justify-center transition-all duration-200">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-50/50 rounded-2xl p-6 text-center border border-dashed border-slate-200 flex-1 flex items-center justify-center">
                                <p className="text-xs text-slate-400">No saved addresses yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="space-y-3 mt-6">
                        <button
                            type="submit"
                            disabled={loading || locating}
                            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>Save Address</>
                            )}
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleProceedToPayment}
                            className="w-full py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-bold rounded-2xl shadow-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                        >
                            Proceed to Payment
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </form>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-6 max-sm w-full mx-4 shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Delete Address?</h3>
                        </div>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">Are you sure you want to delete this address? This action cannot be undone.</p>
                        <div className="flex gap-3 justify-end">
                            <button 
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setAddressIdToDelete(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 font-medium text-sm transition-colors flex items-center gap-2 shadow-lg"
                                onClick={() => {
                                    if (addressIdToDelete) {
                                        handleDeleteAddress(addressIdToDelete);
                                    }
                                    setIsDeleteModalOpen(false);
                                    setAddressIdToDelete(null);
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryDetailsForm;
