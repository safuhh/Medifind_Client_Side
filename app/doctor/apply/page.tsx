"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { applyDoctor, getApplicationStatus } from "@/app/apis/doctor.api";
import Navbar from "@/app/navbar/page";
import Footer from "@/app/footer/page";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, FiMail, FiPhone, FiMapPin, 
  FiBookOpen, FiAward, FiCheckCircle, 
  FiUpload, FiCamera, FiCheck 
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function DoctorApplyPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.push("/login");
  }, [user, authLoading, router]);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [appStatus, setAppStatus] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<any>({});
  const [locating, setLocating] = useState(false);
  const [locationName, setLocationName] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    lat: null as number | null,
    lng: null as number | null,
    qualification: {
      degree: "",
      collegeName: "",
      university: "", // User can fill this now
    },
    registrationNumber: "",
    medicalCouncil: "",
    experienceYears: 0,
    specialization: "",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor", 
    consultationFee: 0,
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await getApplicationStatus();
        if (res.data.success && res.data.application) {
          setAppStatus(res.data.application);
        }
      } catch (err) {
        console.log("No application found or error");
      } finally {
        setCheckingStatus(false);
      }
    };
    checkStatus();
  }, []);

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

        setFormData((prev) => ({ ...prev, lat, lng }));

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://newmedifinddeploy-env.eba-pp6njqrd.eu-north-1.elasticbeanstalk.com"}/locations/reverse?lat=${lat}&lng=${lng}`);
          if (!res.ok) throw new Error("Backend failed");
          const data = await res.json();
          setLocationName(data.address);
          setFormData(prev => ({ ...prev, address: data.address }));
        } catch (err) {
          console.log("Backend address fetch failed, trying fallback...", err);
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            setLocationName(address);
            setFormData(prev => ({ ...prev, address: address }));
          } catch (fallbackErr) {
            console.log("Fallback fetch error:", fallbackErr);
            toast.warning("Coordinates captured, but address lookup failed.");
          }
        }
        setLocating(false);
        toast.success("Location added 📍");
      },
      (error) => {
        setLocating(false);
        toast.error(error.code === 1 ? "Allow location permission" : "Location error");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const validate = (currentStep: number) => {
    let newErrors: any = {};
    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!/^[\+]?[0-9\s-]{10,15}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
      if (!formData.lat || !formData.lng) newErrors.location = "Please tag your clinical location";
    }
    if (currentStep === 2) {
      if (!formData.qualification.degree) newErrors.degree = "Degree is required";
      if (!formData.qualification.collegeName) newErrors.college = "College name is required";
      if (!formData.specialization) newErrors.specialization = "Specialization is required";
      if (!formData.registrationNumber) newErrors.regNo = "Registration number is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setErrors((prev: any) => ({ ...prev, [name.split('.').pop() || '']: null }));
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: any) => ({ ...prev, [parent]: { ...prev[parent as keyof typeof prev] as any, [child]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    if (validate(step)) setStep(step + 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cert' | 'selfie' | 'profile') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'cert') setCertificateFile(file);
      else if (type === 'selfie') setSelfieFile(file);
      else setProfileImageFile(file);
      toast.success(`${file.name} selected`);
    }
  };

  const handleSubmit = async () => {
    if (!validate(3)) return;
    
    if (!certificateFile) {
        toast.error("Please upload your medical certificate");
        return;
    }
    
    setLoading(true);
    try {
      const data = new FormData();
      
      // Basic Fields
      data.append("fullName", formData.fullName);
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      data.append("address", formData.address || locationName);
      data.append("registrationNumber", formData.registrationNumber);
      data.append("medicalCouncil", formData.medicalCouncil);
      data.append("experienceYears", String(formData.experienceYears));
      data.append("specialization", formData.specialization);
      if (!profileImageFile) {
        data.append("profileImage", formData.profileImage);
      }
      data.append("consultationFee", String(formData.consultationFee));

      // Complex Objects as JSON strings
      data.append("location", JSON.stringify({
        type: "Point",
        coordinates: [formData.lng, formData.lat]
      }));
      data.append("qualification", JSON.stringify(formData.qualification));

      // Files
      data.append("certificate", certificateFile);
      if (selfieFile) data.append("selfie", selfieFile);
      if (profileImageFile) data.append("profileImageFile", profileImageFile);

      await applyDoctor(data);
      setStep(4);
      toast.success("Application submitted! 🚀");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600 border-r-2 border-emerald-600/30"></div>
      </div>
    );
  }

  if (!user) return null;

  if (appStatus) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-3xl mx-auto pt-32 pb-20 px-6">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 text-center border border-slate-100">
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
              appStatus.status === 'pending' ? 'bg-amber-50 text-amber-500' :
              appStatus.status === 'approved' ? 'bg-emerald-50 text-emerald-500' :
              'bg-red-50 text-red-500'
            }`}>
              {appStatus.status === 'pending' ? <FiCamera size={40} /> :
               appStatus.status === 'approved' ? <FiCheckCircle size={40} /> :
               <FiUser size={40} />}
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Application {appStatus.status.charAt(0).toUpperCase() + appStatus.status.slice(1)}</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              {appStatus.status === 'pending' ? "Our medical board is currently reviewing your credentials. This usually takes 2-3 business days." :
               appStatus.status === 'approved' ? "Congratulations! You are now a verified doctor on MediFind." :
               `Unfortunately, your application was rejected. Reason: ${appStatus.rejectionReason}`}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-lg mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registration</p>
                <p className="text-sm font-semibold text-slate-700">{appStatus.registrationNumber}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialization</p>
                <p className="text-sm font-semibold text-slate-700">{appStatus.specialization}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consultation Fee</p>
                <p className="text-sm font-semibold text-slate-700">₹{appStatus.consultationFee}</p>
              </div>
            </div>

            {appStatus.status === 'approved' && (
              <button 
                onClick={() => router.push('/doctor/dashboard')}
                className="mt-10 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                Go to Doctor Dashboard
              </button>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      
      <main className="max-w-5xl mx-auto pt-32 pb-20 px-6">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar Info */}
          <div className="md:w-1/3">
            <h1 className="text-4xl font-black text-slate-900 leading-[1.1] mb-6">
              Join our <span className="text-emerald-600">Medical Network</span>
            </h1>
            <p className="text-slate-500 mb-10 leading-relaxed">
              Verify your profile to consult patients, issue digital prescriptions, and grow your medical practice.
            </p>

            <div className="space-y-6">
              {[
                { title: "Personal Details", step: 1, icon: <FiUser /> },
                { title: "Professional Info", step: 2, icon: <FiAward /> },
                { title: "Verification", step: 3, icon: <FiCamera /> }
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-4 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    step >= s.step ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white text-slate-400 border border-slate-200'
                  }`}>
                    {step > s.step ? <FiCheck /> : s.icon}
                  </div>
                  <span className={`font-bold text-sm ${step >= s.step ? 'text-slate-900' : 'text-slate-400'}`}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Area */}
          <div className="flex-1 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="p-8 md:p-10">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          name="fullName" 
                          value={formData.fullName} 
                          onChange={handleChange}
                          placeholder="Dr. John Doe"
                          className={`w-full bg-white border ${errors.fullName ? 'border-red-500 ring-4 ring-red-50' : 'border-slate-300 focus:border-[#0a4d33]'} rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold placeholder:text-slate-300 placeholder:font-normal`}
                        />
                        {errors.fullName && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.fullName}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                          name="email" 
                          value={formData.email} 
                          onChange={handleChange}
                          placeholder="john@hospital.com"
                          className={`w-full bg-white border ${errors.email ? 'border-red-500 ring-4 ring-red-50' : 'border-slate-300 focus:border-[#0a4d33]'} rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold placeholder:text-slate-300 placeholder:font-normal`}
                        />
                        {errors.email && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className={`w-full bg-white border ${errors.phone ? 'border-red-500 ring-4 ring-red-50' : 'border-slate-300 focus:border-[#0a4d33]'} rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold placeholder:text-slate-300 placeholder:font-normal`}
                        />
                        {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.phone}</p>}
                      </div>
                      <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clinical Location</label>
                        
                        {!formData.lat ? (
                          <button 
                            type="button"
                            onClick={handleGetLocation}
                            disabled={locating}
                            className="w-full flex items-center justify-center gap-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-10 hover:bg-slate-100/50 hover:border-emerald-300 transition-all group"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:scale-110 transition-all">
                              {locating ? <div className="w-6 h-6 border-3 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div> : <FiMapPin size={24} />}
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-slate-900">Tag My Current Location</p>
                              <p className="text-xs text-slate-400">Click to fetch your clinical coordinates</p>
                            </div>
                          </button>
                        ) : (
                          <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                              <FiCheck size={24} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Location Verified</p>
                                <button 
                                  onClick={() => setFormData(prev => ({ ...prev, lat: null, lng: null }))}
                                  className="text-[10px] font-bold text-slate-400 hover:text-red-500"
                                >
                                  Reset
                                </button>
                              </div>
                              <p className="text-sm font-bold text-slate-900 mt-1 leading-tight">{formData.address || "Coordinates captured successfully"}</p>
                              <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">LAT: {formData.lat?.toFixed(4)} | LNG: {formData.lng?.toFixed(4)}</p>
                            </div>
                          </div>
                        )}
                        {errors.location && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.location}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Highest Degree</label>
                        <input 
                          name="qualification.degree" 
                          value={formData.qualification.degree} 
                          onChange={handleChange}
                          placeholder="MBBS, MD (Cardiology)"
                          className={`w-full bg-white border ${errors.degree ? 'border-red-500 ring-4 ring-red-50' : 'border-slate-300 focus:border-[#0a4d33]'} rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold placeholder:text-slate-300 placeholder:font-normal`}
                        />
                        {errors.degree && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.degree}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">College Name</label>
                        <input 
                          name="qualification.collegeName" 
                          value={formData.qualification.collegeName} 
                          onChange={handleChange}
                          placeholder="e.g. Govt. Medical College"
                          className={`w-full bg-white border ${errors.college ? 'border-red-500 ring-4 ring-red-50' : 'border-slate-300 focus:border-[#0a4d33]'} rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold placeholder:text-slate-300 placeholder:font-normal`}
                        />
                        {errors.college && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.college}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Affiliated University</label>
                        <input 
                          name="qualification.university" 
                          value={formData.qualification.university === "N/A" ? "" : formData.qualification.university} 
                          onChange={handleChange}
                          placeholder="e.g. Kerala University of Health Sciences"
                          className="w-full bg-white border border-slate-300 focus:border-[#0a4d33] rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold placeholder:text-slate-300 placeholder:font-normal"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specialization</label>
                        <select 
                          name="specialization" 
                          value={formData.specialization} 
                          onChange={handleChange}
                          className={`w-full bg-white border ${errors.specialization ? 'border-red-500 ring-4 ring-red-50' : 'border-slate-300 focus:border-[#0a4d33]'} rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold appearance-none`}
                        >
                          <option value="" disabled>Select Specialization</option>
                          <option value="Cardiologist">Cardiologist</option>
                          <option value="Dermatologist">Dermatologist</option>
                          <option value="Neurologist">Neurologist</option>
                          <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                          <option value="Pediatrician">Pediatrician</option>
                          <option value="Gynecologist">Gynecologist</option>
                          <option value="Psychiatrist">Psychiatrist</option>
                          <option value="Oncologist">Oncologist</option>
                          <option value="Endocrinologist">Endocrinologist</option>
                          <option value="Gastroenterologist">Gastroenterologist</option>
                          <option value="General Physician">General Physician</option>
                        </select>
                        {errors.specialization && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.specialization}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience (Years)</label>
                        <input 
                          type="number"
                          name="experienceYears" 
                          value={formData.experienceYears} 
                          onChange={handleChange}
                          className={`w-full bg-white border ${errors.exp ? 'border-red-500 ring-4 ring-red-50' : 'border-slate-300 focus:border-[#0a4d33]'} rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold`}
                        />
                        {errors.exp && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.exp}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medical Council</label>
                        <input 
                          name="medicalCouncil" 
                          value={formData.medicalCouncil} 
                          onChange={handleChange}
                          placeholder="e.g. Kerala Medical Council"
                          className="w-full bg-white border border-slate-300 focus:border-[#0a4d33] rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold placeholder:text-slate-300 placeholder:font-normal"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registration Number</label>
                        <input 
                          name="registrationNumber" 
                          value={formData.registrationNumber} 
                          onChange={handleChange}
                          placeholder="MC-123456"
                          className={`w-full bg-white border ${errors.regNo ? 'border-red-500 ring-4 ring-red-50' : 'border-slate-300 focus:border-[#0a4d33]'} rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold placeholder:text-slate-300 placeholder:font-normal`}
                        />
                        {errors.regNo && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.regNo}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Consultation Fee (₹)</label>
                        <input 
                          type="number"
                          name="consultationFee" 
                          value={formData.consultationFee} 
                          onChange={handleChange}
                          placeholder="e.g. 500"
                          className="w-full bg-white border border-slate-300 focus:border-[#0a4d33] rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold placeholder:text-slate-300 placeholder:font-normal"
                        />
                        <p className="text-[9px] text-slate-400 font-medium ml-1">Set your own custom fee for each consultation</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <FiCamera className="text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">Verification Guidelines</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            Please upload a clear selfie holding your Medical ID card for verification. Ensure your registration number is clearly visible.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <label className="relative border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-50/30 hover:bg-slate-50 transition-all cursor-pointer group">
                          <input 
                            type="file" 
                            className="hidden" 
                            accept=".pdf,image/*" 
                            onChange={(e) => handleFileChange(e, 'cert')}
                          />
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${certificateFile ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-300 group-hover:text-emerald-500'}`}>
                            {certificateFile ? <FiCheck size={24} /> : <FiUpload size={24} />}
                          </div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {certificateFile ? "Certificate Selected" : "Upload Certificate"}
                          </span>
                          {certificateFile && <p className="text-[10px] text-emerald-600 font-bold">{certificateFile.name}</p>}
                       </label>

                       <label className="relative border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-50/30 hover:bg-slate-50 transition-all cursor-pointer group">
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={(e) => handleFileChange(e, 'selfie')}
                          />
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selfieFile ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-300 group-hover:text-emerald-500'}`}>
                            {selfieFile ? <FiCheck size={24} /> : <FiCamera size={24} />}
                          </div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {selfieFile ? "Selfie Selected" : "Selfie with ID"}
                          </span>
                          {selfieFile && <p className="text-[10px] text-emerald-600 font-bold">{selfieFile.name}</p>}
                       </label>

                       <label className="relative border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-50/30 hover:bg-slate-50 transition-all cursor-pointer group md:col-span-2">
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={(e) => handleFileChange(e, 'profile')}
                          />
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${profileImageFile ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-300 group-hover:text-emerald-500'}`}>
                            {profileImageFile ? <FiCheck size={24} /> : <FiUser size={24} />}
                          </div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {profileImageFile ? "Profile Image Selected" : "Professional Profile Photo"}
                          </span>
                          {profileImageFile && (
                            <div className="flex items-center gap-3">
                                <img 
                                    src={URL.createObjectURL(profileImageFile)} 
                                    className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                                    alt="Preview" 
                                />
                                <p className="text-[10px] text-emerald-600 font-bold">{profileImageFile.name}</p>
                            </div>
                          )}
                       </label>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-10"
                  >
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                      <FiCheck size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Application Submitted</h2>
                    <p className="text-slate-500 text-center max-w-sm mb-8">
                      Your documents are being reviewed by our board. You will receive an email once verified.
                    </p>
                    <button 
                      onClick={() => router.push('/')}
                      className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
                    >
                      Return Home
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {step < 4 && (
                <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                  <button 
                    disabled={step === 1}
                    onClick={() => setStep(step - 1)}
                    className="text-slate-400 font-bold hover:text-slate-900 transition-colors disabled:opacity-0"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={step === 3 ? handleSubmit : handleNext}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : step === 3 ? "Submit Application" : "Continue"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
