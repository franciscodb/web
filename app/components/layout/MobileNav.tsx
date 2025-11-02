"use client";

import { useState } from "react";
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
  Menu,
  X,
} from "lucide-react";

/**
 * Items de navegación (mismo que Sidebar)
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
 * MobileNav component - Menú hamburguesa para móviles
 * 
 * Features:
 * - Botón hamburguesa
 * - Drawer animado desde la izquierda
 * - Overlay con blur
 * - Cierre automático al navegar
 */
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Cerrar el menú al navegar
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa - solo visible en mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay con blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer - Menú lateral */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header con logo y botón cerrar */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BrightLend</h1>
              <p className="text-xs text-gray-500">Préstamos P2P</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
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
                onClick={handleLinkClick}
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
              // TODO: Implementar logout
              console.log("Logout");
              setIsOpen(false);
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}