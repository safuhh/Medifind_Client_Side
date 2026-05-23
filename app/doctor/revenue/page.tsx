"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../redux/hooks";
import { getDoctorRevenueDashboard } from "../../apis/doctor.revenu.api";
import { 
    TrendingUp, 
    Calendar, 
    Wallet, 
    ArrowUpRight, 
    Activity
} from "lucide-react";

const Revenue = () => {
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);
    const [totals, setTotals] = useState({ today: 0, month: 0, year: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role !== "doctor") {
            router.push("/");
        } else if (!user) {
            router.push("/login");
        } else {
            fetchDashboardData();
        }
    }, [user, router]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const res = await getDoctorRevenueDashboard();
            if (res && res.success) {
                setTotals(res.totals || { today: 0, month: 0, year: 0 });
            }
        } catch (error) {
            console.error("Error fetching revenue dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const stats = [
        {
            title: "Today's Yield",
            value: totals.today,
            icon: <TrendingUp className="w-4 h-4" />,
            colorClass: "text-emerald-600 bg-emerald-50 border-emerald-100",
            glowClass: "from-emerald-500/10 to-transparent",
            label: "Daily Audit"
        },
        {
            title: "Monthly Revenue",
            value: totals.month,
            icon: <Calendar className="w-4 h-4" />,
            colorClass: "text-sky-600 bg-sky-50 border-sky-100",
            glowClass: "from-sky-500/10 to-transparent",
            label: "Fiscal Period"
        },
        {
            title: "Annual Earnings",
            value: totals.year,
            icon: <Wallet className="w-4 h-4" />,
            colorClass: "text-indigo-600 bg-indigo-50 border-indigo-100",
            glowClass: "from-indigo-500/10 to-transparent",
            label: "Total Revenue"
        }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-44 bg-white rounded-2xl border border-slate-100 animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div 
                        key={index}
                        className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
                    >
                        {/* Radial Hover Glow Effect */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.glowClass} rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none -mr-4 -mt-4 mix-blend-multiply filter blur-xl`}></div>
                        
                        <div className="relative">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${stat.colorClass}`}>
                                    {stat.icon}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
                                <p className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                                    {formatCurrency(stat.value)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                            <span className="flex items-center gap-1.5">
                                <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                                Live Ledger
                            </span>
                            <span className="text-slate-400 group-hover:text-slate-600 transition-colors flex items-center gap-0.5 cursor-pointer">
                                View ledger <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Revenue;
