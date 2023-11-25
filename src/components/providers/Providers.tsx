"use client";

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {


  return (
    <PayPalScriptProvider options={{ 
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
      intent: 'capture',
      currency: 'USD',
    }}>
      <SessionProvider>{children}</SessionProvider>
    </PayPalScriptProvider>
  );
};
