"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Sidebar } from "@/app/components/layout/Sidebar";
import { Header } from "@/app/components/layout/Header";

/**
 * Dashboard Layout
 * 
 * Layout que envuelve todas las páginas del dashboard con:
 * - Sidebar (desktop)
 * - Header con MobileNav
 * - Protección de rutas (requiere wallet conectado)
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isConnected, isConnecting } = useAccount();

  // Proteger rutas - redirigir a login si no está conectado
  useEffect(() => {
    if (!isConnecting && !isConnected) {
      router.push("/login");
    }
  }, [isConnected, isConnecting, router]);

  // Mostrar loading mientras verifica conexión
  if (isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Conectando wallet...</p>
        </div>
      </div>
    );
  }

  // No mostrar nada si no está conectado (se redirigirá)
  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - fixed en desktop */}
      <Sidebar />

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Header sticky */}
        <Header />

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}