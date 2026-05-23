"use client";

import { useEffect, useState } from "react";
import { getCart, increaseQuantity, decreaseQuantity, deleteCart } from "../apis/cart.api";
import NavbarPage from "../navbar/page";
import Footer from "../footer/page";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { getImageUrl } from "../utils/imageUrl";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function CartPage() {
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const fetchCart = async (showLoading = false) => {
        try {
            if (showLoading) setLoading(true);
            const res = await getCart();
            if (res.data.success) {
                setCart(res.data.cart);
            }
        } catch (err) {
            console.error("Error fetching cart:", err);
            toast.error("Failed to load cart");
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart(true);
    }, []);

    const handleIncrease = async (medicineId: string) => {
        setCart((prevCart: any) => {
            if (!prevCart) return prevCart;
            const updatedItems = prevCart.items.map((item: any) => {
                const medId = item.medicineId?._id || item.medicineId;
                if (medId === medicineId) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
            return { ...prevCart, items: updatedItems };
        });

        try {
            const res = await increaseQuantity({ medicineId });
            if (res.data.success) {
                setCart(res.data.cart);
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "Failed to increase quantity";
            toast.error(errorMsg);
            fetchCart();
        }
    };

    const handleDecrease = async (medicineId: string) => {
        setCart((prevCart: any) => {
            if (!prevCart) return prevCart;
            const updatedItems = prevCart.items.map((item: any) => {
                const medId = item.medicineId?._id || item.medicineId;
                if (medId === medicineId) {
                    return { ...item, quantity: Math.max(1, item.quantity - 1) };
                }
                return item;
            });
            return { ...prevCart, items: updatedItems };
        });

        try {
            const res = await decreaseQuantity({ medicineId });
            if (res.data.success) {
                setCart(res.data.cart);
            }
        } catch (err) {
            toast.error("Failed to decrease quantity");
            fetchCart();
        }
    };

    const handleDelete = async (medicineId: string) => {
        try {
            const res = await deleteCart({ medicineId });
            if (res.data.success) {
                toast.success("Item removed from cart");
                fetchCart(); // Refresh cart
            }
        } catch (err) {
            toast.error("Failed to remove item");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#0a4d33] border-r-2 border-[#0a4d33]/30"></div>
            </div>
        );
    }

    const items = cart?.items || [];

    // Calculate totals
    let totalGst = 0;
    const subtotal = items.reduce((acc: number, item: any) => {
        const price = item.medicineId?.pricing?.sellingPrice || 0;
        const gstPercentage = item.medicineId?.pricing?.gst || 0;
        totalGst += (price * gstPercentage / 100) * item.quantity;
        return acc + price * item.quantity;
    }, 0);

    return (
        <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <NavbarPage />
            
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">Your Cart</h1>

                {items.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-100 text-center max-w-md mx-auto"
                    >
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiShoppingBag size={24} className="text-slate-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
                        <p className="text-slate-500 text-sm mb-6">Looks like you haven't added any medicines yet.</p>
                        <Link 
                            href="/medicines"
                            className="bg-[#0a4d33] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#083d28] transition-colors inline-flex items-center gap-2"
                        >
                            Browse Medicines <FiArrowRight />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item: any) => {
                                const med = item.medicineId;
                                if (!med) return null;
                                return (
                                    <motion.div 
                                        key={med._id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3 sm:gap-4"
                                    >
                                        <img 
                                            src={med.images?.[0] ? getImageUrl(med.images[0]) : "/no-image.png"} 
                                            alt={med.name}
                                            className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg object-cover bg-slate-50 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-slate-900 truncate text-sm sm:text-base">{med.name}</h3>
                                            <p className="text-xs text-slate-500 truncate">{med.brand}</p>
                                            <p className="text-xs sm:text-sm font-bold text-[#0a4d33] mt-0.5">₹{med.pricing?.sellingPrice} <span className="text-[10px] font-normal text-slate-400"> + {med.pricing?.gst || 0}% GST</span></p>
                                            {item.prescribedQty && (
                                                <p className="text-[10px] font-bold text-emerald-600 uppercase mt-0.5">
                                                    Max: {item.prescribedQty}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-shrink-0">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleDecrease(med._id)}
                                                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <FiMinus size={10} className="sm:hidden" />
                                                    <FiMinus size={12} className="hidden sm:block" />
                                                </button>
                                                <div className="w-6 sm:w-8 text-center font-semibold text-slate-900 text-xs sm:text-sm">
                                                    {item.quantity}
                                                </div>
                                                <button
                                                    onClick={() => handleIncrease(med._id)}
                                                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                    disabled={item.quantity >= (item.prescribedQty ? Math.min(med.stock, item.prescribedQty) : med.stock)}
                                                >
                                                    <FiPlus size={10} className="sm:hidden" />
                                                    <FiPlus size={12} className="hidden sm:block" />
                                                </button>
                                            </div>
                                            <button 
                                                onClick={() => handleDelete(med._id)}
                                                className="text-slate-400 hover:text-red-500 p-1.5 sm:p-2 transition-colors"
                                            >
                                                <FiTrash2 size={16} className="sm:hidden" />
                                                <FiTrash2 size={18} className="hidden sm:block" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xl border border-slate-100 sticky top-24 lg:top-32">
                                <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-slate-500">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>Estimated GST</span>
                                        <span>₹{totalGst.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>Delivery Fee</span>
                                        <span className="text-xs text-slate-400 mt-0.5 text-right max-w-[120px]">Calculated at checkout</span>
                                    </div>
                                    <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-slate-900 text-base">
                                        <span>Estimated Total</span>
                                        <span>₹{(subtotal + totalGst).toFixed(2)}</span>
                                    </div>
                                </div>
                                <Link href="/deliveryDetails" className="w-full bg-[#0a4d33] text-white mt-6 py-3 rounded-xl font-bold text-sm hover:bg-[#083d28] transition-colors shadow-lg shadow-[#0a4d33]/10 flex items-center justify-center gap-2">
                                    Proceed to Checkout <FiArrowRight />
                                </Link>


                            </div>
                        </div>
                    </div>
                )}
            </main>



            <Footer />
        </div>
    );
}
