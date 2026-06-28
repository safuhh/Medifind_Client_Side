"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "@/services/apis/api";

export function useHealthReport() {
  const { bookingId } = useParams();
  const router = useRouter();

  // Auth state
  const user = useSelector((state: any) => state.auth.user);
  const isDoctor = user?.role === "doctor";

  // Data states
  const [report, setReport] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Editor states
  const [isEditing, setIsEditing] = useState(false);
  const [reportNotes, setReportNotes] = useState("");
  const [prescribedMedicines, setPrescribedMedicines] = useState<any[]>([]);
  const [medicineSearch, setMedicineSearch] = useState("");
  const [medicineResults, setMedicineResults] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});

  // AI split order states
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitPlan, setSplitPlan] = useState<any>(null);

  // ── Data Fetching ────────────────────────────────────────────────────────────

  const fetchData = async () => {
    setLoading(true);
    try {
      const reportRes = await api.get(`/health-report/booking/${bookingId}`);
      if (reportRes.data.success && reportRes.data.report) {
        setReport(reportRes.data.report);
        setReportNotes(reportRes.data.report.notes || "");
        setPrescribedMedicines(reportRes.data.report.medicines || []);

        const initialQtys: Record<string, number> = {};
        reportRes.data.report.medicines?.forEach((med: any) => {
          if (med.medicineId) {
            initialQtys[med.medicineId.toString()] = med.remainingQty !== undefined ? med.remainingQty : med.quantity;
          }
        });
        setSelectedQuantities(initialQtys);
      } else {
        setReport(null);
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error("Error fetching report:", err);
        toast.error("Failed to load health report");
      }
      setReport(null);
    }

    try {
      const bookingRes = await api.get(`/booking/${bookingId}`);
      if (bookingRes.data.success) {
        setBooking(bookingRes.data.booking);
      }
    } catch (err) {
      console.error("Error fetching booking details:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (bookingId) fetchData();
  }, [bookingId]);

  // Auto-start editing if doctor opens a page with no report yet
  useEffect(() => {
    if (!loading && !report && isDoctor) {
      setIsEditing(true);
    }
  }, [report, isDoctor, loading]);

  // ── Medicine Search ──────────────────────────────────────────────────────────

  const handleSearchMedicine = async (query: string) => {
    setMedicineSearch(query);
    if (query.length < 2) {
      setMedicineResults([]);
      return;
    }
    try {
      const res = await api.get(`/medicines/all?search=${query}`);
      if (res.data.success) {
        setMedicineResults(res.data.medicines);
      }
    } catch (err) {
      console.error("Error searching medicines:", err);
    }
  };

  const handleAddMedicine = (med: any) => {
    setPrescribedMedicines([
      ...prescribedMedicines,
      {
        medicineId: med._id,
        name: med.name,
        dosage: "",
        instructions: "",
        timesPerDay: "",
        quantity: 1,
        stock: med.stock,
      },
    ]);
    setMedicineSearch("");
    setMedicineResults([]);
  };

  // ── Report Save ──────────────────────────────────────────────────────────────

  const handleSaveReport = async () => {
    if (!reportNotes.trim()) {
      toast.error("Please add clinical notes/diagnosis details");
      return;
    }

    if (prescribedMedicines && prescribedMedicines.length > 0) {
      for (const med of prescribedMedicines) {
        if (!med.dosage || !med.dosage.trim()) {
          toast.error(`Dosage schedule is required for ${med.name}`);
          return;
        }
        if (!med.instructions || !med.instructions.trim()) {
          toast.error(`Instructions are required for ${med.name}`);
          return;
        }
        if (med.quantity < 1) {
          toast.error(`Quantity must be at least 1 for ${med.name}`);
          return;
        }
        if (med.quantity > (med.stock || 0)) {
          toast.error(`Quantity for ${med.name} exceeds available stock (${med.stock})`);
          return;
        }
      }
    }

    try {
      setSaving(true);
      const res = await api.post("/health-report", {
        bookingId: booking._id,
        notes: reportNotes,
        medicines: prescribedMedicines.map((med) => ({
          medicineId: med.medicineId,
          name: med.name,
          dosage: med.dosage,
          instructions: med.instructions,
          timesPerDay: med.timesPerDay,
          quantity: med.quantity,
        })),
      });

      if (res.data.success) {
        toast.success("Health report updated successfully!");
        setIsEditing(false);
        fetchData();
      }
    } catch (err: any) {
      console.error("Error saving report:", err);
      toast.error(err.response?.data?.message || "Failed to save health report");
    } finally {
      setSaving(false);
    }
  };

  // ── Quantity Adjustments ──────────────────────────────────────────────────────

  const handleIncreaseQty = (medId: string, maxQty: number, currentQty: number) => {
    setSelectedQuantities((prev) => {
      if (currentQty >= maxQty) return prev;
      return { ...prev, [medId]: currentQty + 1 };
    });
  };

  const handleDecreaseQty = (medId: string, currentQty: number) => {
    setSelectedQuantities((prev) => {
      if (currentQty <= 0) return prev;
      return { ...prev, [medId]: currentQty - 1 };
    });
  };

  // ── AI Split Order ───────────────────────────────────────────────────────────

  const handleFindBuyWithAI = async () => {
    setIsOptimizing(true);
    try {
      const getCoords = (): Promise<[number, number] | undefined> => {
        return new Promise((resolve) => {
          if (!navigator.geolocation) {
            resolve(undefined);
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
            () => resolve(undefined),
            { timeout: 5000 }
          );
        });
      };

      const coords = await getCoords();
      const prescriptionId = report?._id || bookingId;
      const medicines = report?.medicines
        ?.map((m: any) => {
          const selectedQty = m.medicineId ? selectedQuantities[m.medicineId.toString()] : undefined;
          return {
            name: m.name,
            quantity: selectedQty !== undefined ? selectedQty : (m.remainingQty !== undefined ? m.remainingQty : m.quantity),
          };
        })
        ?.filter((m: any) => m.quantity > 0) || [];

      if (medicines.length === 0) {
        toast.info("Please select at least 1 unit of any medicine to purchase.");
        setIsOptimizing(false);
        return;
      }

      const res = await api.post("/orders/optimize-split", {
        prescriptionId,
        patientCoords: coords,
        medicines,
      });

      if (res.data.success && res.data.data) {
        setSplitPlan(res.data.data);
        setShowSplitModal(true);
        toast.success("AI found the optimal fulfillment plan!");
      } else {
        toast.error("Failed to find optimal pharmacy splits");
      }
    } catch (err: any) {
      console.error("AI Split optimization failed:", err);
      toast.error(err.response?.data?.message || "Failed to split order with AI");
    } finally {
      setIsOptimizing(false);
    }
  };

  // ── Derived values ───────────────────────────────────────────────────────────

  const patientInfo = report?.patientId || booking?.userId;
  const doctorInfo = report?.doctorId || booking?.doctorId;

  return {
    // routing
    router,
    bookingId,
    // auth
    isDoctor,
    // data
    report,
    booking,
    loading,
    patientInfo,
    doctorInfo,
    // editor
    isEditing,
    setIsEditing,
    reportNotes,
    setReportNotes,
    prescribedMedicines,
    setPrescribedMedicines,
    medicineSearch,
    medicineResults,
    saving,
    // handlers
    handleSearchMedicine,
    handleAddMedicine,
    handleSaveReport,
    // AI
    isOptimizing,
    showSplitModal,
    setShowSplitModal,
    splitPlan,
    handleFindBuyWithAI,
    // quantity selectors
    selectedQuantities,
    handleIncreaseQty,
    handleDecreaseQty,
  };
}
