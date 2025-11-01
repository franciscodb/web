"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MobileNav } from "./MobileNav";
import { Bell, Search } from "lucide-react";

/**
 * Header component - Barra superior de la aplicación
 * 
 * Features:
 * - Botón de menú móvil (MobileNav)
 * - Barra de búsqueda (placeholder)
 * - Notificaciones (placeholder)
 * - ConnectButton de RainbowKit
 */
export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Left side - Mobile Nav */}
        <div className="flex items-center gap-4">
          <MobileNav />
          
          {/* Logo móvil - solo visible cuando sidebar está oculto */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-bold text-gray-900">PrestaChain</span>
          </div>
        </div>

        {/* Center - Search bar (solo desktop) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar préstamos, inversores..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side - Notifications + Wallet */}
        <div className="flex items-center gap-3">
          {/* Botón de notificaciones */}
          <button
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {/* Badge de notificaciones pendientes */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Connect Wallet Button */}
          <ConnectButton
            chainStatus="icon"
            showBalance={{
              smallScreen: false,
              largeScreen: true,
            }}
          />
        </div>
      </div>

      {/* Mobile Search Bar - debajo del header principal */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </header>
  );
}