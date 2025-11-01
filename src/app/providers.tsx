"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {config } from "@/src/lib/web3/config";  

/**
 * Cliente de React Query para manejo de estado asíncrono
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Providers component que envuelve toda la aplicación
 * 
 * Orden de los providers (importante):
 * 1. WagmiProvider - Conexión Web3
 * 2. QueryClientProvider - Estado asíncrono
 * 3. RainbowKitProvider - UI de wallets
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#0284c7", // Blue 600 - color principal
            accentColorForeground: "white",
            borderRadius: "medium",
          })}
          appInfo={{
            appName: "PrestaChain MX",
            disclaimer: ({ Text, Link }) => (
              <Text>
                Al conectar tu wallet aceptas los{" "}
                <Link href="/terminos">términos y condiciones</Link> de
                PrestaChain.
              </Text>
            ),
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}