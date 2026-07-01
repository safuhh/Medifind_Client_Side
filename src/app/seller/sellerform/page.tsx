"use client";
import NavbarPage from "@/app/navbar/page";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { applySeller } from "@/services/apis/seller.api";
import Footer from "@/app/footer/page";

export default function BecomeSellerPage() {
  const { user, isLoading } = useSelector((state: any) => state.auth);
  const router = useRouter();

  const [form, setForm] = useState({
    shopName: "",
    licenseNumber: "",
    address: "",
    phone: "",
    lat: null as number | null,
    lng: null as number | null,
  });

  const [locationName, setLocationName] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        console.log("LOCATION:", lat, lng);

        setForm((prev) => ({
          ...prev,
          lat,
          lng,
        }));

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://medifindapiii.duckdns.org/api";
          const res = await fetch(`${apiUrl}/locations/reverse?lat=${lat}&lng=${lng}`);
          const data = await res.json();

          console.log("ADDRESS PREVIEW:", data.address);

          setLocationName(data.address);
        } catch (err) {
          console.log("ADDRESS FETCH ERROR:", err);
        }

        setLocating(false);
        toast.success("Location added ");
      },
      (error) => {
        setLocating(false);

        if (error.code === 1) {
          toast.error("Allow location permission ");
        } else {
          toast.error("Location error");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

const handleSubmit = async () => {
  try {
    const shopNameRegex = /^[a-zA-Z0-9\s]{3,50}$/;
    const licenseRegex = /^[A-Z0-9-]{5,20}$/i;
    const phoneRegex = /^[6-9]\d{9}$/; // Indian numbers
    const addressRegex = /^.{5,100}$/;

    if (!shopNameRegex.test(form.shopName)) {
      toast.error("Enter valid shop name (min 3 chars)");
      return;
    }

    if (!licenseRegex.test(form.licenseNumber)) {
      toast.error("Invalid license number");
      return;
    }

    if (!addressRegex.test(form.address)) {
      toast.error("Enter proper address");
      return;
    }

    if (!phoneRegex.test(form.phone)) {
      toast.error("Enter valid Indian phone number");
      return;
    }

    if (form.lat === null || form.lng === null) {
      toast.error("Please click 'Use My Location' first ðŸ“");
      return;
    }

    setLoading(true);

    const payload = {
      shopName: form.shopName.trim(),
      licenseNumber: form.licenseNumber.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      lat: form.lat,
      lng: form.lng,
    };

    console.log("SENDING:", payload);

    const res = await applySeller(payload);

    console.log("BACKEND RESPONSE:", res.data);

    toast.success("Application submitted ðŸš€");
    setSuccess(true);

  } catch (err: any) {
    toast.error(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  if (success) {
 return (
  <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
    
    {/* Decorative Background Elements */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[120px] -z-10 opacity-60" />
    <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-50 rounded-full blur-[100px] -z-10 opacity-60" />

    <div className="w-full max-w-md text-center">
      {/* SUCCESS ICON ANIMATION BOX */}
      <div className="relative mb-10 inline-block">
        <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20" />
        <div className="relative w-24 h-24 bg-white border border-emerald-100 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/10">
          <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {/* Floating sparkles */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-bounce" />
      </div>

      {/* TEXT CONTENT */}
      <div className="space-y-3 mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Application Received!
        </h2>
        <p className="text-slate-500 leading-relaxed px-4">
          Your request to join the <span className="font-semibold text-slate-800">MediFind Seller Network</span> is currently being processed by our compliance team.
        </p>
      </div>

      {/* WHAT HAPPENS NEXT SECTION */}
      <div className="bg-slate-50/80 border border-slate-100 rounded-[28px] p-6 mb-10 text-left">
        <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-4 ml-1">
          Next Steps
        </h4>
        <div className="space-y-5">
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
            <p className="text-sm text-slate-600 leading-tight">Our team will verify your medical license and storefront address.</p>
          </div>
          <div className="flex gap-4">
            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
            <p className="text-sm text-slate-400 leading-tight">You'll receive an email invitation to set up your digital medicine catalog.</p>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => router.push("/")}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-xl shadow-slate-200 hover:bg-black active:scale-[0.98] transition-all"
        >
          Return to Dashboard
        </button>
        
        <button
          onClick={() => window.open('mailto:pcsajitha87@gmail.com')}
          className="w-full py-4 bg-transparent text-slate-500 font-semibold text-sm hover:text-slate-800 transition-colors"
        >
          Contact Support
        </button>
      </div>

      {/* FOOTER LOGO */}
      <div className="mt-12 flex items-center justify-center gap-2 opacity-30">
        <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center text-[10px] text-white font-bold">M</div>
        <span className="text-xs font-bold tracking-tighter text-slate-900">MediFind</span>
      </div>
    </div>
  </div>
);
  }

  return (
    <div>
      <NavbarPage />

        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 relative">
    {/* Subtle texture */}
    <div className="absolute inset-0 z-0 opacity-[0.02]" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>

    {/* Reduced Max-Width from 4xl to 2xl */}
    <div className="w-full max-w-2xl relative z-10">
      
      <div className="bg-white border border-slate-100 rounded-[32px] shadow-[0_15px_50px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* COMPACT SIDEBAR */}
          <div className="md:w-[35%] bg-slate-50 p-7 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">M</div>
                <span className="font-bold text-lg text-slate-900 tracking-tighter">Medi<span className="text-emerald-600">Find</span></span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-slate-950 leading-tight">
                Partner<br />Portal
              </h1>
              
              <div className="h-1 w-10 bg-emerald-500 my-5 rounded-full"></div>

              <p className="text-slate-500 text-xs leading-relaxed">
                Connect your storefront to patients in your local area.
              </p>
            </div>

            <div className="hidden md:block space-y-2 mt-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="text-emerald-500 text-base">âœ“</span> Secure
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="text-emerald-500 text-base">âœ“</span> Verified
              </div>
            </div>
          </div>

          {/* COMPACT FORM */}
          <div className="md:w-[65%] p-7 lg:p-9">
            <div className="space-y-4">
              
              <div className="pb-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Become a Seller</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                
                {/* Shop & License in one row on larger screens to save height */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([
                    { id: 'shopName', label: 'Shop Name', placeholder: 'Heart Pharmacy' },
                    { id: 'licenseNumber', label: 'License', placeholder: 'MED-12345' }
                  ] as const).map((input) => (
                    <div key={input.id} className="relative">
                      <label className="absolute left-3.5 top-2 text-[9px] font-bold text-emerald-700 uppercase tracking-widest">
                        {input.label}
                      </label>
                      <input
                        type="text"
                        placeholder={input.placeholder}
                        value={form[input.id]}
                        onChange={(e) => setForm({ ...form, [input.id]: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 pt-7 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      />
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <label className="absolute left-3.5 top-2 text-[9px] font-bold text-emerald-700 uppercase tracking-widest">
                    Business Address
                  </label>
                  <textarea
                    placeholder="Enter full street address..."
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 pt-7 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all min-h-[70px] resize-none"
                  />
                </div>

                <div className="relative">
                  <label className="absolute left-3.5 top-2 text-[9px] font-bold text-emerald-700 uppercase tracking-widest">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 pt-7 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* COMPACT LOCATION WIDGET */}
              <button
                onClick={handleGetLocation}
                disabled={locating}
                className="w-full mt-2 p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between group hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Geo-Tag</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {locationName || "Enable GPS"}
                    </p>
                  </div>
                </div>
                {form.lat && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">SET</span>}
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-4 py-3.5 rounded-xl bg-green-700 text-white font-bold text-sm hover:bg-green-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
              >
                {loading ? "Registering..." : "Submit Application"}
              </button>

            </div>
          </div>
        </div>
      </div>
      
      <p className="text-center text-[10px] text-slate-400 mt-5">
        By joining, you agree to our <span className="underline cursor-pointer">Verification Terms</span>.
      </p>
    </div>
    
  </div>
    <Footer />
    </div>

);
}