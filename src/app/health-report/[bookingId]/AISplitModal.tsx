"use client";

import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Medicine {
  name: string;
  genericName?: string;
  price: number;
  quantity: number;
}

interface Split {
  pharmacyName: string;
  pharmacyPhone?: string;
  pharmacyEmail?: string;
  pharmacyCoordinates?: [number, number];
  distance?: number | null;
  subtotal: number;
  medicines: Medicine[];
  pharmacyId?: any;
}

// ── PharmacySplitCard ──────────────────────────────────────────────────────────

function PharmacySplitCard({ split, index }: { split: Split; index: number }) {
  const pharmacy =
    split.pharmacyId && typeof split.pharmacyId === "object"
      ? split.pharmacyId
      : null;

  const phone = split.pharmacyPhone || pharmacy?.phone || null;
  const email = split.pharmacyEmail || pharmacy?.email || null;
  const coords: [number, number] | null =
    split.pharmacyCoordinates?.length === 2
      ? split.pharmacyCoordinates
      : pharmacy?.location?.coordinates?.length === 2
      ? pharmacy.location.coordinates
      : null;

  const mapsUrl = coords
    ? `https://www.google.com/maps?q=${coords[1]},${coords[0]}`
    : null;

  const distanceKm = split.distance != null ? split.distance : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
    >
      {/* Card header */}
      <div className="px-5 py-4 flex items-start justify-between gap-4 border-b border-slate-100">
        <div className="flex items-start gap-3 min-w-0">
          {/* Index badge */}
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {index + 1}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm leading-tight truncate">
              {split.pharmacyName}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {distanceKm != null && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {distanceKm.toFixed(1)} km
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Subtotal */}
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Subtotal</p>
          <p className="text-sm font-bold text-slate-900">₹{split.subtotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Medicines table */}
      <div className="divide-y divide-slate-50">
        {split.medicines.map((med, i) => (
          <div key={i} className="px-5 py-2.5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-800 truncate">{med.name}</p>
              {med.genericName && med.genericName !== med.name && (
                <p className="text-[10px] text-slate-400 italic mt-0.5">{med.genericName}</p>
              )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 text-xs text-slate-500">
              <span className="bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5 font-medium text-slate-600">
                ×{med.quantity}
              </span>
              <span className="font-semibold text-slate-800 w-16 text-right">
                ₹{(med.price * med.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Contact / Map links */}
      {(phone || email || mapsUrl) && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-emerald-700 transition-colors font-medium"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {phone}
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-emerald-700 transition-colors font-medium"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {email}
            </a>
          )}
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-emerald-600 hover:text-emerald-800 transition-colors font-semibold"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Open in Maps
              {coords && (
                <span className="text-slate-400 font-normal">
                  &nbsp;({coords[1].toFixed(3)}°N)
                </span>
              )}
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── AISplitModal ───────────────────────────────────────────────────────────────

interface AISplitModalProps {
  splitPlan: any;
  onClose: () => void;
  onProceed: () => void;
}

export default function AISplitModal({
  splitPlan,
  onClose,
  onProceed,
}: AISplitModalProps) {
  const shopCount = splitPlan?.splits?.length ?? 0;

  return (
    <AnimatePresence>
      {splitPlan && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden">

              {/* ── Modal Header ─────────────────────────────────────────── */}
              <div className="px-7 pt-7 pb-5 border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full tracking-wide">
                      AI Optimised
                    </span>
                    {shopCount > 0 && (
                      <span className="text-xs font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-full">
                        {shopCount} {shopCount === 1 ? "pharmacy" : "pharmacies"}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    Medicine Fulfillment Plan
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-sm">
                    Optimal split across nearby pharmacies for complete coverage at the lowest cost.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors flex items-center justify-center flex-shrink-0 mt-0.5"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* ── Scrollable Content ────────────────────────────────────── */}
              <div className="flex-1 overflow-y-auto px-7 py-5 space-y-4">
                {/* Unavailable warning */}
                {splitPlan.unavailableMedicines &&
                  splitPlan.unavailableMedicines.length > 0 && (
                    <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">
                      <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-amber-800 text-xs">Unavailable nearby</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {splitPlan.unavailableMedicines.map((med: string, i: number) => (
                            <span key={i} className="text-[10px] font-medium text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md">
                              {med}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                {/* Pharmacy cards */}
                {splitPlan.splits.map((split: any, idx: number) => (
                  <PharmacySplitCard key={idx} split={split} index={idx} />
                ))}
              </div>

              {/* ── Footer ───────────────────────────────────────────────── */}
              <div className="px-7 py-5 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mb-0.5">
                    Total
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    ₹{splitPlan.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onProceed}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm shadow-emerald-600/20 flex items-center gap-1.5 active:scale-95"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M17 13l1.5 6M9 19a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
                    </svg>
                    Buy All Medicines
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
