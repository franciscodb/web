// apps/web/src/lib/contracts/config.ts
import { parseEther, formatEther } from 'ethers';

export const CONTRACTS = {
  // Dirección del contrato desplegado
  BrightLendSimple: '0xFc7AFC4334e35e0c8bd1CeCDf0302298Cd2e88D4', // Reemplaza con tu dirección
};

export const ARBITRUM_SEPOLIA = {
  chainId: 421614,
  name: 'Arbitrum Sepolia',
  rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
  blockExplorer: 'https://sepolia.arbiscan.io',
};

// Helper para convertir ETH a Wei - CORREGIDO
export function ethToWei(eth: string): bigint {
  // Usa parseEther de ethers.js que maneja decimales correctamente
  return parseEther(eth);
}

// Helper para convertir Wei a ETH
export function weiToEth(wei: bigint): string {
  // Usa formatEther de ethers.js para la conversión inversa
  return formatEther(wei);
}