import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrumSepolia } from "wagmi/chains";

// Validar que exista el WalletConnect Project ID
if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined");
}

/**
 * Configuración de Wagmi y RainbowKit para BrightLend
 * 
 * Red principal: Arbitrum Sepolia (testnet)
 * - Chain ID: 421614
 * - Para el hackathon usamos testnet
 * - En producción se cambiaría a Arbitrum One
 */
export const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME || "BrightLend MX",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains: [arbitrumSepolia],
  ssr: true, // Para Next.js App Router
});

/**
 * Configuración de la red Arbitrum Sepolia
 */
export const defaultChain = arbitrumSepolia;

/**
 * Dirección de contratos (se llenarán después del deployment)
 */
export const contracts = {
  loanManager: process.env.NEXT_PUBLIC_LOAN_CONTRACT_ADDRESS as `0x${string}` | undefined,
  creditScore: process.env.NEXT_PUBLIC_CREDIT_SCORE_CONTRACT_ADDRESS as `0x${string}` | undefined,
} as const;

/**
 * Helper para validar si los contratos están configurados
 */
export const areContractsConfigured = () => {
  return !!(contracts.loanManager && contracts.creditScore);
};