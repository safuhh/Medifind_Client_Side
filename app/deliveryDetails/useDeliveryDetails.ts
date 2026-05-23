import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { deliveryDetailsApi } from "../apis/delivery.details.api";
import { useRouter, useSearchParams } from "next/navigation";

export const useDeliveryDetails = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();
    const searchParams = useSearchParams();
    const buyNowMedicineId = searchParams ? searchParams.get("buyNowMedicineId") : null;
    const buyNowQuantity = searchParams ? searchParams.get("buyNowQuantity") : null;
    const splitFulfillmentId = searchParams ? searchParams.get("splitFulfillmentId") : null;
    const prescribedQty = searchParams ? searchParams.get("prescribedQty") : null;
    
    const [deliveryDetails, setDeliveryDetails] = useState({
        name: "",
        address: "",
        landmark: "",
        city: "",
        state: "",
        zip: "",
        country: "India", 
        phone: "",
        email: "",
    });
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

    // Auto-fill email from logged-in user
    useEffect(() => {
        if (user?.email) {
            setDeliveryDetails(prev => ({ ...prev, email: user.email }));
        }
        if (user?.name) {
            setDeliveryDetails(prev => ({ ...prev, name: user.name }));
        }
    }, [user]);

    // Fetch saved addresses
    const fetchSavedAddresses = async () => {
        try {
            const res = await deliveryDetailsApi.getDeliveryDetails();
            if (res.success) {
                setSavedAddresses(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch saved addresses:", err);
        }
    };

    useEffect(() => {
        fetchSavedAddresses();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setDeliveryDetails(prev => ({ ...prev, [id]: value }));
        // Clear error when user types
        if (fieldErrors[id]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        
        if (!deliveryDetails.name.trim()) errors.name = "Name is required";
        if (!deliveryDetails.address.trim()) errors.address = "Address is required";
        if (!deliveryDetails.city.trim()) errors.city = "City is required";
        if (!deliveryDetails.state.trim()) errors.state = "State is required";
        if (!deliveryDetails.zip.trim()) errors.zip = "Zip code is required";
        if (!deliveryDetails.country.trim()) errors.country = "Country is required";
        
        const phoneRegex = /^\+?\d{10,15}$/;
        if (!deliveryDetails.phone) {
            errors.phone = "Phone number is required";
        } else if (!phoneRegex.test(deliveryDetails.phone)) {
            errors.phone = "Phone number must be between 10 and 15 digits";
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!deliveryDetails.email) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(deliveryDetails.email)) {
            errors.email = "Invalid email format";
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        setLocating(true);
        setError(null);
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                    const res = await fetch(`${apiUrl}/locations/reverse?lat=${latitude}&lng=${longitude}`);
                    const data = await res.json();
                    
                    setDeliveryDetails(prev => ({
                        ...prev,
                        address: data.address || prev.address,
                        city: data.city || prev.city,
                        state: data.state || prev.state,
                        zip: data.zip || prev.zip,
                        country: data.country || prev.country,
                    }));
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 3000); // Hide after 3s
                } catch (err) {
                    console.error("Error fetching address:", err);
                    setError("Failed to fetch address from location");
                } finally {
                    setLocating(false);
                }
            },
            (err) => {
                console.error("Geolocation error:", err);
                setError("Failed to get your location. Please check permissions.");
                setLocating(false);
            }
        );
    };

    const handleCreateDeliveryDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const res = await deliveryDetailsApi.createDeliveryDetails(deliveryDetails);
            setSuccess(true);
            fetchSavedAddresses();
            
            const newId = res.data?._id;
            if (newId) {
                await initiateCheckout(newId);
            } else {
                setError("Could not retrieve new address ID");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || err.message || "Failed to save delivery details");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAddress = (address: any) => {
        setDeliveryDetails({
            name: address.name,
            address: address.address,
            landmark: address.landmark || "",
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country,
            phone: address.phone,
            email: address.email,
        });
        setSelectedAddressId(address._id);
    };

    const handleDeleteAddress = async (id: string) => {
        try {
            await deliveryDetailsApi.deleteDeliveryDetails(id);
            fetchSavedAddresses();
        } catch (err) {
            console.error("Failed to delete address:", err);
            setError("Failed to delete address");
        }
    };

    const initiateCheckout = async (addressId: string) => {
        try {
            setLoading(true);
            const { default: api } = await import("../apis/api");
            
            const res = await api.post("/orders/checkout", { 
                deliveryDetailsId: addressId,
                buyNowMedicineId,
                buyNowQuantity,
                splitFulfillmentId,
                prescribedQty: prescribedQty ? Number(prescribedQty) : undefined,
            });
            
            if (res.data.success && res.data.url) {
                window.location.href = res.data.url;
            } else {
                setError(res.data.message || "Failed to initiate checkout");
            }
        } catch (err: any) {
            console.error("Checkout error:", err);
            setError(err.response?.data?.message || "Failed to initiate checkout");
        } finally {
            setLoading(false);
        }
    };

    const handleProceedToPayment = async () => {
        if (selectedAddressId) {
            await initiateCheckout(selectedAddressId);
        } else {
            setError("Please select a saved address or fill and save a new one");
        }
    };

    const handleClearForm = () => {
        setDeliveryDetails({
            name: user?.name || "",
            address: "",
            landmark: "",
            city: "",
            state: "",
            zip: "",
            country: "India",
            phone: "",
            email: user?.email || "",
        });
        setSelectedAddressId(null);
        setFieldErrors({});
    };

    return {
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
    };
}
