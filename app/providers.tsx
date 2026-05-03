"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store, persistor } from "@/app/redux/store";
import { PersistGate } from "redux-persist/integration/react";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId="174364488629-adapv9uobfe8tav4bq6ssnjs9pj0daq5.apps.googleusercontent.com">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}