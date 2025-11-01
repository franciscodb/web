"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useUserSync } from "@/src/hooks/useUserSync";
import { ClaimENSCard } from "../components/ui/Claimenscard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ExternalLink,
  LogOut,
  AlertCircle,
  Globe,
} from "lucide-react";

/**
 * Dashboard Principal con Privy + Supabase + ENS
 */
export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();
  const { loading: syncLoading, dbUser, error: syncError, refetch } = useUserSync();

  // Protección de ruta
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  // Loading state
  if (!ready || !authenticated || syncLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {syncLoading ? "Sincronizando con base de datos..." : "Cargando..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (syncError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Error de Sincronización
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{syncError}</p>
            <Button onClick={() => window.location.reload()} variant="primary" fullWidth>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Obtener wallet embebida
  const embeddedWallet = user?.linkedAccounts?.find(
    (account) => account.type === "wallet" && account.walletClient === "privy"
  )?.address;

  const address = embeddedWallet || user?.linkedAccounts?.find(
    (account) => account.type === "wallet"
  )?.address;

  // Datos de Supabase
  const creditScore = dbUser?.credit_score || 500;
  const ensSubdomain = dbUser?.ens_subdomain || null;

  // Datos MOCK
  const mockData = {
    creditScore,
    totalLoans: 3,
    activeLoans: 1,
    totalInvested: 15000,
    activeInvestments: 5,
    earnings: 1250,
    nextPayment: {
      amount: 2500,
      date: "2025-11-15",
      daysLeft: 14,
    },
    recentActivity: [
      {
        id: 1,
        type: "loan_approved",
        title: "Préstamo Aprobado",
        amount: 5000,
        date: "Hace 2 días",
        icon: ArrowDownRight,
        color: "text-green-600",
        bg: "bg-green-50",
      },
      {
        id: 2,
        type: "payment_made",
        title: "Pago Realizado",
        amount: 2500,
        date: "Hace 5 días",
        icon: ArrowUpRight,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        id: 3,
        type: "investment",
        title: "Nueva Inversión",
        amount: 3000,
        date: "Hace 1 semana",
        icon: TrendingUp,
        color: "text-purple-600",
        bg: "bg-purple-50",
      },
    ],
  };

  const getScoreLevel = (score: number) => {
    if (score >= 800) return { text: "Excelente", color: "text-green-600", bg: "bg-green-50" };
    if (score >= 650) return { text: "Bueno", color: "text-blue-600", bg: "bg-blue-50" };
    if (score >= 500) return { text: "Regular", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { text: "Bajo", color: "text-red-600", bg: "bg-red-50" };
  };

  const scoreLevel = getScoreLevel(mockData.creditScore);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleENSSuccess = async (subdomain: string) => {
    console.log('ENS reclamado:', subdomain);
    // Refrescar datos del usuario
    await refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header con saludo */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            ¡Bienvenido de vuelta!
          </h1>
          <div className="mt-1 space-y-1">
            {ensSubdomain ? (
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                <p className="text-lg font-medium text-purple-600">
                  {ensSubdomain}.brightlend.eth
                </p>
              </div>
            ) : (
              <p className="text-gray-600">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Cargando..."}
              </p>
            )}
            {dbUser && (
              <p className="text-sm text-gray-500">
                Usuario ID: {dbUser.id.slice(0, 8)}...
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-gray-700"
        >
          <LogOut className="w-4 h-4" />
          Salir
        </button>
      </div>

      {/* Card para reclamar ENS */}
      {!ensSubdomain && dbUser && (
        <ClaimENSCard userId={dbUser.id} onSuccess={handleENSSuccess} />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Credit Score */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Credit Score</p>
                <p className="text-3xl font-bold text-gray-900">
                  {mockData.creditScore}
                </p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${scoreLevel.color} ${scoreLevel.bg}`}>
                  {scoreLevel.text}
                </span>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Préstamos Activos */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Préstamos Activos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {mockData.activeLoans}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Total: {mockData.totalLoans} préstamos
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Invertido */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Invertido</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${mockData.totalInvested.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  +${mockData.earnings.toLocaleString()} ganados
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximo Pago */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Próximo Pago</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${mockData.nextPayment.amount.toLocaleString()}
                </p>
                <p className="text-xs text-orange-600 mt-2">
                  En {mockData.nextPayment.daysLeft} días
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid de 2 columnas */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>¿Qué quieres hacer hoy?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/marketplace">
              <Button variant="primary" fullWidth className="justify-start">
                <Plus className="w-5 h-5 mr-2" />
                Solicitar Nuevo Préstamo
              </Button>
            </Link>
            <Link href="/dashboard/marketplace">
              <Button variant="secondary" fullWidth className="justify-start">
                <TrendingUp className="w-5 h-5 mr-2" />
                Invertir en Préstamos
              </Button>
            </Link>
            <Link href="/dashboard/mis-prestamos">
              <Button variant="outline" fullWidth className="justify-start">
                <Wallet className="w-5 h-5 mr-2" />
                Ver Mis Préstamos
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas transacciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${activity.bg} rounded-full flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${activity.amount.toLocaleString()} MXN
                    </p>
                  </div>
                );
              })}
            </div>
            <Link href="/dashboard/ajustes">
              <Button variant="ghost" fullWidth className="mt-4">
                Ver Todo
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Credit Score Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso de Credit Score</CardTitle>
          <CardDescription>
            Sigue mejorando tu score para acceder a mejores tasas y montos más altos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Score Actual</span>
                <span className="font-semibold text-gray-900">{mockData.creditScore} / 1000</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${(mockData.creditScore / 1000) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 mb-1">+50</p>
                <p className="text-sm text-gray-600">Paga a tiempo</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600 mb-1">+30</p>
                <p className="text-sm text-gray-600">Invierte en préstamos</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600 mb-1">+20</p>
                <p className="text-sm text-gray-600">Completa tu perfil</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}