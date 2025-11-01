"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils/cn";
import {
  LayoutDashboard,
  Store,
  Wallet,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";

/**
 * Items de navegación del sidebar
 */
const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Marketplace",
    href: "/dashboard/marketplace",
    icon: Store,
  },
  {
    name: "Mis Préstamos",
    href: "/dashboard/mis-prestamos",
    icon: Wallet,
  },
  {
    name: "Mis Inversiones",
    href: "/dashboard/mis-inversiones",
    icon: TrendingUp,
  },
  {
    name: "Ajustes",
    href: "/dashboard/ajustes",
    icon: Settings,
  },
];

/**
 * Sidebar component para navegación desktop
 * 
 * Features:
 * - Navegación principal
 * - Highlighting de ruta activa
 * - Logo y branding
 * - Botón de logout
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      {/* Logo y título */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">P</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">PrestaChain</h1>
          <p className="text-xs text-gray-500">Préstamos P2P</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer con logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            // TODO: Implementar logout (disconnect wallet)
            console.log("Logout");
          }}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}