"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

/**
 * Dashboard Layout
 * 
 * Layout compartido para todas las páginas del dashboard
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Proteger todas las rutas del dashboard
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  // Mostrar loading mientras se verifica autenticación
  if (!ready || !authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Marketplace", href: "/dashboard/marketplace", icon: TrendingUp },
    { name: "Mis Préstamos", href: "/dashboard/mis-prestamos", icon: Wallet },
    { name: "Mis Inversiones", href: "/dashboard/mis-inversiones", icon: TrendingUp },
    { name: "Ajustes", href: "/dashboard/ajustes", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex h-screen">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="font-bold text-xl text-gray-900">BrightLend</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Sidebar Mobile */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">P</span>
                  </div>
                  <span className="font-bold text-xl text-gray-900">BrightLend</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:pl-64">
          {/* Top Bar Mobile */}
          <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="font-bold text-lg text-gray-900">BrightLend</span>
              </div>
              <div className="w-10" /> {/* Spacer */}
            </div>
          </div>

          {/* Page Content */}
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}