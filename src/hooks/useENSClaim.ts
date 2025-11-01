"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

interface UseENSClaimResult {
  claiming: boolean;
  success: boolean;
  error: string | null;
  subdomain: string | null;
  fullDomain: string | null;
  claimENS: (customSubdomain?: string) => Promise<void>;
  reset: () => void;
}

/**
 * Hook para reclamar un subdominio ENS
 * 
 * Uso:
 * const { claiming, success, error, subdomain, claimENS } = useENSClaim();
 * await claimENS(); // Genera automáticamente
 * // o
 * await claimENS('misubdominio'); // Subdominio personalizado
 */
export function useENSClaim(userId?: string): UseENSClaimResult {
  const { user } = usePrivy();
  const [claiming, setClaiming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [fullDomain, setFullDomain] = useState<string | null>(null);

  const claimENS = async (customSubdomain?: string) => {
    try {
      setClaiming(true);
      setError(null);
      setSuccess(false);

      // Obtener wallet embebida
      const embeddedWallet = user?.linkedAccounts?.find(
        (account) => account.type === "wallet" && account.walletClient === "privy"
      )?.address;

      const walletAddress = embeddedWallet || user?.linkedAccounts?.find(
        (account) => account.type === "wallet"
      )?.address;

      if (!walletAddress) {
        throw new Error("No se encontró wallet para el usuario");
      }

      if (!userId) {
        throw new Error("User ID no proporcionado");
      }

      // Llamar a la API
      const response = await fetch('/api/ens/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          walletAddress,
          customSubdomain,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error al registrar ENS');
      }

      // Éxito!
      setSuccess(true);
      setSubdomain(data.subdomain);
      setFullDomain(data.fullDomain);

      console.log('✅ ENS registrado exitosamente:', data);

    } catch (err: any) {
      console.error('Error reclamando ENS:', err);
      setError(err.message || 'Error desconocido');
      setSuccess(false);
    } finally {
      setClaiming(false);
    }
  };

  const reset = () => {
    setClaiming(false);
    setSuccess(false);
    setError(null);
    setSubdomain(null);
    setFullDomain(null);
  };

  return {
    claiming,
    success,
    error,
    subdomain,
    fullDomain,
    claimENS,
    reset,
  };
}

/**
 * Hook para verificar disponibilidad de subdominios
 */
export function useENSAvailability() {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = async (subdomain: string) => {
    try {
      setChecking(true);
      setError(null);

      const response = await fetch(
        `/api/ens/register?subdomain=${encodeURIComponent(subdomain)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error verificando disponibilidad');
      }

      setAvailable(data.available);
      return data.available;

    } catch (err: any) {
      console.error('Error verificando disponibilidad:', err);
      setError(err.message);
      setAvailable(null);
      return null;
    } finally {
      setChecking(false);
    }
  };

  return {
    checking,
    available,
    error,
    checkAvailability,
  };
}