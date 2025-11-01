"use client";

import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import {
  User,
  Mail,
  Bell,
  Shield,
  Globe,
  LogOut,
  Check,
  Copy,
  ExternalLink,
  Wallet,
  TrendingUp,
} from "lucide-react";

/**
 * Ajustes Page - Configuración de perfil y preferencias
 * 
 * Features:
 * - Información de perfil
 * - Configuración de notificaciones
 * - Preferencias de privacidad
 * - Información de wallet
 * - Credit score details
 */

export default function AjustesPage() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Datos MOCK del usuario
  const mockUserData = {
    ens: "usuario.eth",
    email: "usuario@ejemplo.com",
    creditScore: 750,
    memberSince: "2025-01-15",
    totalLoans: 3,
    totalInvested: 15000,
    completedPayments: 12,
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simular guardado
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Ajustes
        </h1>
        <p className="text-gray-600 mt-1">
          Administra tu perfil y preferencias
        </p>
      </div>

      {/* Información de Wallet */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            Información de Wallet
          </CardTitle>
          <CardDescription>
            Tu identidad en PrestaChain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dirección de wallet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección de Wallet
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono text-gray-900">
                {address ? `${address.slice(0, 12)}...${address.slice(-10)}` : "No conectado"}
              </div>
              <Button
                variant="outline"
                onClick={handleCopyAddress}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* ENS */}
          {mockUserData.ens && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre ENS
              </label>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">{mockUserData.ens}</span>
                <a
                  href={`https://app.ens.domains/${mockUserData.ens}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Stats rápidas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{mockUserData.creditScore}</p>
              <p className="text-xs text-gray-600">Credit Score</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{mockUserData.totalLoans}</p>
              <p className="text-xs text-gray-600">Préstamos</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{mockUserData.completedPayments}</p>
              <p className="text-xs text-gray-600">Pagos</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">${(mockUserData.totalInvested / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-600">Invertido</p>
            </div>
          </div>

          {/* Miembro desde */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Miembro desde{" "}
              <span className="font-medium text-gray-900">
                {new Date(mockUserData.memberSince).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Información Personal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            Información Personal
          </CardTitle>
          <CardDescription>
            Información opcional para mejorar tu experiencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Correo Electrónico (opcional)"
            type="email"
            placeholder="tu@email.com"
            defaultValue={mockUserData.email}
            leftIcon={<Mail className="w-5 h-5" />}
            helperText="Solo para notificaciones importantes"
          />
          <Input
            label="Nombre de Usuario (opcional)"
            type="text"
            placeholder="Tu nombre"
            leftIcon={<User className="w-5 h-5" />}
          />
        </CardContent>
        <CardFooter>
          <Button
            variant="primary"
            onClick={handleSaveProfile}
            isLoading={isSaving}
          >
            Guardar Cambios
          </Button>
        </CardFooter>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            Notificaciones
          </CardTitle>
          <CardDescription>
            Configura cómo quieres recibir actualizaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Recordatorios de Pago</p>
              <p className="text-sm text-gray-600">
                Recibe notificaciones antes de tus fechas de pago
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Oportunidades de Inversión</p>
              <p className="text-sm text-gray-600">
                Notificaciones sobre nuevos préstamos disponibles
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Actualizaciones del Producto</p>
              <p className="text-sm text-gray-600">
                Noticias y características nuevas de PrestaChain
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Privacidad y Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Privacidad y Seguridad
          </CardTitle>
          <CardDescription>
            Controla tu información y visibilidad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Perfil Público</p>
              <p className="text-sm text-gray-600">
                Permite que otros vean tu historial crediticio
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">
                  Tus datos están seguros
                </p>
                <p className="text-blue-700">
                  Solo almacenamos información pública on-chain. Nunca compartimos datos personales sin tu consentimiento.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zona de Peligro */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
          <CardDescription>
            Acciones irreversibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <p className="font-medium text-red-900">Desconectar Wallet</p>
              <p className="text-sm text-red-700">
                Cerrarás sesión y volverás a la página de inicio
              </p>
            </div>
            <Button
              variant="danger"
              onClick={handleDisconnect}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Desconectar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}