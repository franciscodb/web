"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { supabase } from "@/src/lib/supabase";

/**
 * Hook para sincronizar usuario de Privy con Supabase
 * 
 * Cuando el usuario inicia sesión con Privy:
 * 1. Verifica si existe en Supabase
 * 2. Si no existe, crea el registro
 * 3. Si existe, actualiza la información
 */
export function useUserSync() {
  const { ready, authenticated, user } = usePrivy();
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !authenticated || !user) {
      setLoading(false);
      return;
    }

    syncUser();
  }, [ready, authenticated, user]);

  async function syncUser() {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Obtener wallet embebida
      const embeddedWallet = user.linkedAccounts?.find(
        (account) => account.type === "wallet" && account.walletClient === "privy"
      )?.address;

      const walletAddress = embeddedWallet || user.linkedAccounts?.find(
        (account) => account.type === "wallet"
      )?.address;

      if (!walletAddress) {
        throw new Error("No se encontró wallet para el usuario");
      }

      // Verificar si el usuario ya existe en Supabase
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("privy_user_id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 = no se encontró el registro
        throw fetchError;
      }

      if (existingUser) {
        // Usuario existe, actualizar información
        const { data: updatedUser, error: updateError } = await supabase
          .from("users")
          .update({
            wallet_address: walletAddress,
            phone_number: user.phone?.number,
            email: user.email?.address,
            updated_at: new Date().toISOString(),
          })
          .eq("privy_user_id", user.id)
          .select()
          .single();

        if (updateError) throw updateError;
        
        setDbUser(updatedUser);
        console.log("Usuario actualizado en Supabase:", updatedUser);
      } else {
        // Usuario no existe, crear nuevo registro
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert({
            privy_user_id: user.id,
            wallet_address: walletAddress,
            phone_number: user.phone?.number,
            email: user.email?.address,
            credit_score: 500, // Score inicial
          })
          .select()
          .single();

        if (insertError) throw insertError;
        
        setDbUser(newUser);
        console.log("Nuevo usuario creado en Supabase:", newUser);
      }
    } catch (err: any) {
      console.error("Error sincronizando usuario:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    dbUser,
    error,
    refetch: syncUser,
  };
}