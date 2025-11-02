"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { BrowserProvider, formatEther } from "ethers";
import { useUserSync } from "@/src/hooks/useUserSync";
import { ClaimENSCard } from "../components/ui/Claimenscard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { RequestLoanForm } from "../components/RequestLoanForm";
import { MyLoans } from "../components/MyLoans";
import { LoanMarketplace } from "../components/LoanMarketplace";
import {
  Wallet,
  TrendingUp,
  DollarSign,
  Clock,
  Plus,
  LogOut,
  AlertCircle,
  Globe,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();
  const { wallets } = useWallets();
  const { loading: syncLoading, dbUser, error: syncError, refetch } = useUserSync();
  
  const [balance, setBalance] = useState("0");
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "request" | "myloans" | "marketplace">("overview");

  // Protección de ruta
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/login");
    }
  }, [ready, authenticated, router]);

  // Cargar balance
  useEffect(() => {
    if (wallets && wallets.length > 0) {
      loadBalance();
    }
  }, [wallets]);

  const loadBalance = async () => {
    if (!wallets || wallets.length === 0) return;

    setLoadingBalance(true);
    try {
      const wallet = wallets[0];
      const ethereumProvider = await wallet.getEthereumProvider();
      const provider = new BrowserProvider(ethereumProvider);
      const address = wallet.address;
      
      const balanceWei = await provider.getBalance(address);
      const balanceETH = formatEther(balanceWei);
      
      setBalance(Number(balanceETH).toFixed(4));
    } catch (error) {
      console.error('Error loading balance:', error);
      setBalance("0");
    } finally {
      setLoadingBalance(false);
    }
  };

  // Loading state
  if (!ready || !authenticated || syncLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {syncLoading ? "Sincronizando..." : "Cargando..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (syncError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
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

  // Obtener address de forma segura
  const getWalletAddress = () => {
    if (wallets && wallets.length > 0) {
      return wallets[0].address;
    }
    if (user?.wallet?.address) {
      return user.wallet.address;
    }
    return "";
  };

  const address = getWalletAddress();
  const creditScore = dbUser?.credit_score || 500;
  const ensSubdomain = dbUser?.ens_subdomain || null;

  const getScoreLevel = (score: number) => {
    if (score >= 800) return { text: "Excelente", color: "text-green-600", bg: "bg-green-50" };
    if (score >= 650) return { text: "Bueno", color: "text-blue-600", bg: "bg-blue-50" };
    if (score >= 500) return { text: "Regular", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { text: "Bajo", color: "text-red-600", bg: "bg-red-50" };
  };

  const scoreLevel = getScoreLevel(creditScore);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleENSSuccess = async (subdomain: string) => {
    console.log('ENS reclamado:', subdomain);
    await refetch();
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
            Dashboard
          </h1>
          <div className="mt-1 space-y-1">
            {ensSubdomain ? (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                <p className="text-sm sm:text-base font-medium text-purple-600 truncate">
                  {ensSubdomain}.brightlend.eth
                </p>
              </div>
            ) : (
              address && (
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {`${address.slice(0, 6)}...${address.slice(-4)}`}
                </p>
              )
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-gray-700 flex-shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-start">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm opacity-90">Balance Disponible</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold truncate">
                {balance} ETH
              </h2>
              {loadingBalance && (
                <RefreshCw className="w-4 h-4 animate-spin" />
              )}
            </div>
            {address && (
              <p className="text-xs opacity-75 truncate mt-1">
                {address}
              </p>
            )}
          </div>
          <button
            onClick={loadBalance}
            disabled={loadingBalance}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex-shrink-0 disabled:opacity-50"
            title="Recargar balance"
          >
            <RefreshCw className={`w-4 h-4 ${loadingBalance ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Reclamar ENS */}
      {!ensSubdomain && dbUser && (
        <ClaimENSCard userId={dbUser.id} onSuccess={handleENSSuccess} />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Credit Score</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{creditScore}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${scoreLevel.color} ${scoreLevel.bg}`}>
                  {scoreLevel.text}
                </span>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Préstamos</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">0</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Invertido</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">$0</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Próximo Pago</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">--</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 -mx-4 px-4 sm:mx-0 sm:px-0 sm:rounded-lg sm:border">
        <div className="flex overflow-x-auto scrollbar-hide">
          {[
            { id: "overview" as const, label: "Resumen", icon: TrendingUp },
            { id: "request" as const, label: "Solicitar", icon: Plus },
            { id: "myloans" as const, label: "Mis Préstamos", icon: Wallet },
            { id: "marketplace" as const, label: "Mercado", icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="primary" 
                  fullWidth 
                  className="justify-center sm:justify-start"
                  onClick={() => setActiveTab("request")}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Solicitar Préstamo
                </Button>
                <Button 
                  variant="secondary" 
                  fullWidth 
                  className="justify-center sm:justify-start"
                  onClick={() => setActiveTab("marketplace")}
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Invertir en Préstamos
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth 
                  className="justify-center sm:justify-start"
                  onClick={() => setActiveTab("myloans")}
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Ver Mis Préstamos
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Progreso de Credit Score</CardTitle>
                <CardDescription className="text-sm">
                  Mejora tu score para mejores tasas y montos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Score Actual</span>
                      <span className="font-semibold text-gray-900">{creditScore} / 1000</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${(creditScore / 1000) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6">
                    <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                      <p className="text-lg sm:text-2xl font-bold text-blue-600 mb-1">+50</p>
                      <p className="text-xs text-gray-600">Paga a tiempo</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                      <p className="text-lg sm:text-2xl font-bold text-purple-600 mb-1">+30</p>
                      <p className="text-xs text-gray-600">Invierte</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                      <p className="text-lg sm:text-2xl font-bold text-green-600 mb-1">+20</p>
                      <p className="text-xs text-gray-600">Completa perfil</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "request" && (
          <div className="max-w-2xl mx-auto">
            <RequestLoanForm />
          </div>
        )}

        {activeTab === "myloans" && <MyLoans />}

        {activeTab === "marketplace" && <LoanMarketplace />}
      </div>
    </div>
  );
}