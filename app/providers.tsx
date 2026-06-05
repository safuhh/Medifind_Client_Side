"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/app/redux/store";
import { useEffect } from "react";
import api from "@/app/apis/api";
import { setCredentials, setLoading, logout } from "@/app/redux/authSlice";

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

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