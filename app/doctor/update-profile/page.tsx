"use client";

import { useState, useEffect } from "react";
import { getApplicationStatus, updateDoctorProfile } from "@/app/apis/doctor.api";
import Navbar from "@/app/doctor/navbar/page";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, FiMail, FiPhone, FiMapPin, 
  FiAward, FiCheckCircle, 
  FiUpload, FiCamera, FiCheck, FiSave, FiEdit2, FiX
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getImageUrl } from "@/app/utils/imageUrl";

export default function DoctorUpdateProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

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
      university: "",
    },
    experienceYears: 0,
    specialization: "",
    consultationFee: 0,
    profileImage: "",
    registrationNumber: "",
    medicalCouncil: "",
  });

  const fetchDoctorData = async () => {
    try {
      const res = await getApplicationStatus();
      if (res.data.success && res.data.application) {
        const app = res.data.application;
        setFormData({
          fullName: app.fullName || "",
          phone: app.phone || "",
          email: app.email || "",
          address: app.address || "",
          lat: app.location?.coordinates[1] || null,
          lng: app.location?.coordinates[0] || null,
          qualification: {
            degree: app.qualification?.degree || "",
            collegeName: app.qualification?.collegeName || "",
            university: app.qualification?.university || "",
          },
          experienceYears: app.experienceYears || 0,
          specialization: app.specialization || "",
          consultationFee: app.consultationFee || 0,
          profileImage: app.profileImage || "",
          registrationNumber: app.registrationNumber || "",
          medicalCouncil: app.medicalCouncil || "",
        });
      }
    } catch (err) {
      toast.error("Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: any) => ({ ...prev, [parent]: { ...prev[parent as keyof typeof prev] as any, [child]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      toast.success("Profile photo selected");
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      toast.info("Fetching your current location...");
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));
        
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.display_name) {
            setFormData(prev => ({ ...prev, address: data.display_name }));
            toast.success("Location updated successfully! ✨");
          }
        } catch (error) {
          toast.info("Location coordinates saved. Could not fetch exact address name.");
        }
      }, (error) => {
        toast.error("Failed to get location: " + error.message);
      });
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(formData.experienceYears) > 50) {
      toast.error("Experience cannot exceed 50 years");
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      data.append("address", formData.address);
      data.append("experienceYears", String(formData.experienceYears));
      data.append("specialization", formData.specialization);
      data.append("consultationFee", String(formData.consultationFee));
      
      if (formData.lat && formData.lng) {
        data.append("location", JSON.stringify({
          type: "Point",
          coordinates: [formData.lng, formData.lat]
        }));
      }
      
      data.append("qualification", JSON.stringify(formData.qualification));
      data.append("registrationNumber", formData.registrationNumber);
      data.append("medicalCouncil", formData.medicalCouncil);

      if (profileImageFile) {
        data.append("profileImageFile", profileImageFile);
      }

      const res = await updateDoctorProfile(data);
      if (res.data.success) {
        toast.success("Profile updated successfully! ✨");
        setIsEditing(false);
        setProfileImageFile(null);
        await fetchDoctorData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600 border-r-2 border-emerald-600/30"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex relative">
      <Navbar />
      
      <main className="flex-1 max-w-5xl mx-auto pt-32 pb-20 px-6 ml-0 md:ml-64">
        <div className="mb-12 flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-black text-slate-900 leading-[1.1] mb-2">
                    Professional <span className="text-emerald-600">Profile</span>
                </h1>
                <p className="text-slate-500">
                    {isEditing ? "Modify your profile information below." : "View your current verified professional profile."}
                </p>
            </div>
            {!isEditing && (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg"
                >
                    <FiEdit2 /> Edit Profile
                </button>
            )}
        </div>

        <AnimatePresence mode="wait">
            {!isEditing ? (
                <motion.div 
                    key="view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                >
                    {/* Hero Profile Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-col md:flex-row gap-10 items-center md:items-start">
                        <div className="relative shrink-0">
                            <img 
                                src={formData.profileImage ? getImageUrl(formData.profileImage) : undefined} 
                                className="w-48 h-48 rounded-[3rem] object-cover border-8 border-slate-50 shadow-xl"
                                alt="Profile"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-3 rounded-2xl shadow-lg border-4 border-white">
                                <FiCheckCircle size={24} />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                                    {formData.specialization}
                                </span>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Dr. {formData.fullName}</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                                    <p className="font-bold text-slate-800">{formData.experienceYears} Years</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultation Fee</p>
                                    <p className="font-black text-emerald-600 text-xl">₹{formData.consultationFee}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100 space-y-6">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><FiMail /></div>
                                    <div className="flex-1"><p className="text-[10px] font-bold text-slate-400 uppercase">Email</p><p className="font-semibold">{formData.email}</p></div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><FiPhone /></div>
                                    <div className="flex-1"><p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p><p className="font-semibold">{formData.phone}</p></div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><FiMapPin /></div>
                                    <div className="flex-1"><p className="text-[10px] font-bold text-slate-400 uppercase">Clinical Address</p><p className="font-semibold line-clamp-2">{formData.address}</p></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100 space-y-6">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-4">Professional Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><FiAward /></div>
                                    <div className="flex-1"><p className="text-[10px] font-bold text-slate-400 uppercase">Degree</p><p className="font-semibold">{formData.qualification.degree}</p></div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><FiCheck /></div>
                                    <div className="flex-1"><p className="text-[10px] font-bold text-slate-400 uppercase">Registration No.</p><p className="font-semibold">{formData.registrationNumber}</p></div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><FiUser /></div>
                                    <div className="flex-1"><p className="text-[10px] font-bold text-slate-400 uppercase">Medical Council</p><p className="font-semibold">{formData.medicalCouncil}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.form 
                    key="edit"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSubmit} 
                    className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
                >
                    <div className="p-8 md:p-12 space-y-10">
                        
                        {/* Profile Photo Section */}
                        <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-slate-100">
                            <div className="relative group">
                                <img 
                                    src={profileImageFile ? URL.createObjectURL(profileImageFile) : (formData.profileImage ? getImageUrl(formData.profileImage) : undefined)} 
                                    className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white shadow-xl group-hover:opacity-90 transition-all"
                                    alt="Profile"
                                />
                                <label className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-3 rounded-2xl shadow-lg cursor-pointer hover:bg-emerald-700 transition-colors border-2 border-white">
                                    <FiCamera size={18} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <h3 className="text-xl font-black text-slate-900">Update Profile Photo</h3>
                                <p className="text-sm text-slate-400 max-w-xs">Upload a clear professional photo to build trust with patients.</p>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold transition-colors"
                            >
                                <FiX /> Cancel
                            </button>
                        </div>

                        {/* Personal Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input 
                                    name="fullName" 
                                    value={formData.fullName} 
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address (Read-only)</label>
                                <input 
                                    name="email" 
                                    value={formData.email} 
                                    readOnly
                                    className="w-full bg-slate-100 border border-slate-200 cursor-not-allowed rounded-2xl px-6 py-4 outline-none text-slate-500 font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <input 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specialization</label>
                                <select 
                                    name="specialization" 
                                    value={formData.specialization} 
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold appearance-none"
                                >
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
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience (Years) - Max 50</label>
                                <input 
                                    type="number"
                                    name="experienceYears" 
                                    value={formData.experienceYears} 
                                    onChange={handleChange}
                                    max="50"
                                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Consultation Fee (₹)</label>
                                <input 
                                    type="number"
                                    name="consultationFee" 
                                    value={formData.consultationFee} 
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registration Number</label>
                                <input 
                                    name="registrationNumber" 
                                    value={formData.registrationNumber} 
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medical Council</label>
                                <input 
                                    name="medicalCouncil" 
                                    value={formData.medicalCouncil} 
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Degree</label>
                                <input 
                                    name="qualification.degree" 
                                    value={formData.qualification.degree} 
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">College/Hospital Name</label>
                                <input 
                                    name="qualification.collegeName" 
                                    value={formData.qualification.collegeName} 
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">University</label>
                                <input 
                                    name="qualification.university" 
                                    value={formData.qualification.university} 
                                    onChange={handleChange}
                                    className="w-full bg-slate-50/50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 rounded-2xl px-6 py-4 outline-none transition-all text-black font-semibold"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Address</label>
                                    <button 
                                        type="button"
                                        onClick={getCurrentLocation}
                                        className="text-[10px] font-bold text-emerald-600 flex items-center gap-1.5 hover:text-emerald-700 transition-colors bg-emerald-50 px-3 py-1 rounded-full"
                                    >
                                        <FiMapPin size={12} /> Use My Current Location
                                    </button>
                                </div>
                                <textarea 
                                    name="address" 
                                    value={formData.address} 
                                    readOnly
                                    placeholder="Click 'Use My Current Location' to populate this field"
                                    rows={3}
                                    className="w-full bg-slate-100 border border-slate-200 cursor-not-allowed rounded-2xl px-6 py-4 outline-none text-slate-500 font-semibold resize-none"
                                />
                                {formData.lat && formData.lng && (
                                    <p className="text-[10px] font-medium text-slate-400 ml-1 italic">
                                        📍 Coordinates saved: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                            <button 
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-8 py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-900 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                            >
                                {saving ? "Saving Changes..." : <><FiSave /> Save Changes</>}
                            </button>
                        </div>
                    </div>
                </motion.form>
            )}
        </AnimatePresence>
      </main>
    </div>
  );
}
