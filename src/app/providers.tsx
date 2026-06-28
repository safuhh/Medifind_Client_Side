"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "@/store/redux/store";
import { useEffect } from "react";
import api from "@/services/apis/api";
import { setCredentials, setLoading, logout } from "@/store/redux/authSlice";

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.auth.isLoading);

  useEffect(() => {
    // Cleanup old redux-persist state if exists
    if (typeof window !== "undefined") {
      localStorage.removeItem("persist:auth");
    }

    const checkSession = async () => {
      try {
        const res = await api.get("/auth/current");
        dispatch(setCredentials({ user: res.data.user }));
      } catch (err) {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkSession();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0a4d33] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId="174364488629-adapv9uobfe8tav4bq6ssnjs9pj0daq5.apps.googleusercontent.com">
      <Provider store={store}>
        <AuthLoader>
          {children}
        </AuthLoader>
      </Provider>
    </GoogleOAuthProvider>
  );
}