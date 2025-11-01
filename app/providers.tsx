"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { arbitrumSepolia } from "viem/chains";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "tu-app-id-aqui"}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#3b82f6",
        },
        loginMethods: ["sms", "email", "wallet"],
      }}
    >
      {children}
    </PrivyProvider>
  );
}