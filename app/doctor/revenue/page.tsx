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
            icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
            bg: "bg-emerald-50/50",
            border: "border-emerald-100",
            label: "Daily Audit"
        },
        {
            title: "Monthly Revenue",
            value: totals.month,
            icon: <Calendar className="w-5 h-5 text-sky-500" />,
            bg: "bg-sky-50/50",
            border: "border-sky-100",
            label: "Fiscal Period"
        },
        {
            title: "Annual Earnings",
            value: totals.year,
            icon: <Wallet className="w-5 h-5 text-purple-500" />,
            bg: "bg-purple-50/50",
            border: "border-purple-100",
            label: "Total Revenue"
        }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                    <div 
                        key={index}
                        className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">{stat.title}</h3>
                            </div>
                            <div className={`w-14 h-14 rounded-3xl ${stat.bg} border ${stat.border} flex items-center justify-center group-hover:scale-110 transition-all duration-500`}>
                                {stat.icon}
                            </div>
                        </div>
                        
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-slate-900 tracking-tighter">
                                {formatCurrency(stat.value)}
                            </span>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Live Ledger
                            </span>
                            <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Revenue;
