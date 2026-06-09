"use client";
import { useRouter } from "next/navigation";
export default function BecomeDeliveryPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute rounded-full blur-3xl pointer-events-none" />
      <div className="absolute  rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl w-full text-center relative z-10 py-12">
        {/* BADGE */}

        {/* TITLE & DESCRIPTION */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Drive your own success. <br className="hidden md:block" />
          <span className="text-emerald-700">Deliver with us.</span>
        </h1>

        <p className="text-slate-600 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Earn money on your own schedule. Deliver orders, stay active, and be
          part of a fast-growing delivery network that values your time.
        </p>

        {/* BENEFITS CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group text-left">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-xl mb-2">
              Maximize Earnings
            </h3>
            <p className="text-slate-500 text-base leading-relaxed">
              Enjoy flexible earning potential with competitive base pay,
              generous incentives, and peak-hour bonuses.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group text-left">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-xl mb-2">
              Total Flexibility
            </h3>
            <p className="text-slate-500 text-base leading-relaxed">
              Be your own boss. Work whenever you want, wherever you want. No
              minimum hours or fixed schedules.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group text-left">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-xl mb-2">
              Quick Onboarding
            </h3>
            <p className="text-slate-500 text-base leading-relaxed">
              Our sign-up process is streamlined. Get approved quickly and start
              earning money in no time.
            </p>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => router.push("/delivery/apply")}
            className="group flex items-center justify-center gap-3 bg-emerald-700 hover:bg-emerald-800 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg shadow-emerald-700/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            Apply to Drive
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2 mt-5 text-sm text-slate-500 font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-emerald-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Takes less than 2 minutes to apply
          </div>
        </div>
      </div>
    </div>
  );
}
