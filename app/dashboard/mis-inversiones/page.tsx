'use client';

import { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useLoanContract } from '@/src/hooks/useLoanContract';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import {
  TrendingUp,
  DollarSign,
  Wallet,
  PieChart,
  ArrowUpRight,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

type InvestmentStatus = 'active' | 'completed' | 'pending' | 'all';

interface Investment {
  id: string;
  loanId: string;
  borrower: string;
  amount: string;
  totalToRepay: string;
  durationMonths: string;
  status: string;
  paidAmount?: string;
  remaining?: string;
}

export default function MisInversionesPage() {
  const { user, ready: privyReady } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  const { getMyInvestments, getLoan, loading } = useLoanContract();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loadingInvestments, setLoadingInvestments] = useState(true);
  const [filter, setFilter] = useState<InvestmentStatus>('all');

  useEffect(() => {
    if (!privyReady || !walletsReady) return;
    
    if (wallets && wallets.length > 0 && user?.wallet?.address) {
      loadInvestments();
    } else {
      setLoadingInvestments(false);
    }
  }, [privyReady, walletsReady, wallets, user]);

  const loadInvestments = async () => {
    if (!user?.wallet?.address) return;

    setLoadingInvestments(true);
    try {
      // Obtener IDs de préstamos donde el usuario es el lender
      const investmentIds = await getMyInvestments(user.wallet.address);
      
      const investmentsData = await Promise.all(
        investmentIds.map(async (id) => {
          const loan = await getLoan(id);
          return {
            id,
            loanId: id,
            borrower: loan.borrower,
            amount: loan.amount,
            totalToRepay: loan.totalToRepay,
            durationMonths: loan.durationMonths,
            status: loan.status,
            paidAmount: loan.paidAmount || '0',
            remaining: loan.remaining || loan.totalToRepay,
          };
        })
      );
      
      setInvestments(investmentsData);
    } catch (error) {
      console.error('Error loading investments:', error);
    } finally {
      setLoadingInvestments(false);
    }
  };

  const getRiskLevel = (duration: string) => {
    const months = Number(duration);
    if (months <= 3) return { text: 'Bajo', color: 'text-green-600', bg: 'bg-green-50' };
    if (months <= 6) return { text: 'Medio', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: 'Alto', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getStatusInfo = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus === 'completed') {
      return { text: 'Completado', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
    }
    if (normalizedStatus === 'active' || normalizedStatus === 'funded') {
      return { text: 'Activo', color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock };
    }
    return { text: 'Pendiente', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertCircle };
  };

  const calculateROI = (amount: string, totalToRepay: string) => {
    const invested = Number(amount);
    const returns = Number(totalToRepay);
    const profit = returns - invested;
    const roi = ((profit / invested) * 100).toFixed(2);
    return { profit: profit.toFixed(4), roi };
  };

  const filteredInvestments = investments.filter((inv) => {
    if (filter === 'all') return true;
    const status = inv.status.toLowerCase();
    
    if (filter === 'active') return status === 'active' || status === 'funded';
    if (filter === 'completed') return status === 'completed';
    if (filter === 'pending') return status === 'pending';
    
    return true;
  });

  const stats = {
    totalInvested: investments.reduce((sum, inv) => sum + Number(inv.amount || 0), 0).toFixed(4),
    totalReturns: investments.reduce((sum, inv) => sum + Number(inv.totalToRepay || 0), 0).toFixed(4),
    totalReceived: investments.reduce((sum, inv) => sum + Number(inv.paidAmount || 0), 0).toFixed(4),
    totalPending: investments.reduce((sum, inv) => sum + Number(inv.remaining || 0), 0).toFixed(4),
    activeCount: investments.filter(inv => inv.status.toLowerCase() === 'active' || inv.status.toLowerCase() === 'funded').length,
    completedCount: investments.filter(inv => inv.status.toLowerCase() === 'completed').length,
    avgROI: investments.length > 0
      ? (investments.reduce((sum, inv) => {
          const { roi } = calculateROI(inv.amount, inv.totalToRepay);
          return sum + Number(roi);
        }, 0) / investments.length).toFixed(2)
      : '0',
  };

  // Loading states
  if (!privyReady || !walletsReady) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Inicializando...</p>
        </div>
      </div>
    );
  }

  if (!wallets || wallets.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <CardTitle className="mb-2">Wallet no conectada</CardTitle>
          <CardDescription className="mb-4">
            Por favor, conecta tu wallet para ver tus inversiones
          </CardDescription>
          <Button variant="primary">Conectar Wallet</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Mis Inversiones
          </h1>
          <p className="text-gray-600 mt-1">
            Administra tu portfolio y ganancias
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadInvestments}
          disabled={loadingInvestments}
          className="flex-shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loadingInvestments ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Total Invertido</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats.totalInvested} ETH
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Ganancias Totales</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                +{(Number(stats.totalReturns) - Number(stats.totalInvested)).toFixed(4)} ETH
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Recibido</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">
                {stats.totalReceived} ETH
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <PieChart className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">ROI Promedio</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats.avgROI}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.activeCount} activas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Overview */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Resumen de Portfolio</CardTitle>
          <CardDescription>Tu rendimiento acumulado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* ROI Total */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Retorno sobre Inversión (ROI)</span>
                <span className="font-semibold text-green-600">
                  +{Number(stats.totalInvested) > 0 
                    ? (((Number(stats.totalReturns) - Number(stats.totalInvested)) / Number(stats.totalInvested)) * 100).toFixed(2)
                    : '0'}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      Number(stats.totalInvested) > 0
                        ? ((Number(stats.totalReceived) / Number(stats.totalReturns)) * 100)
                        : 0,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Distribución por riesgo */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Bajo Riesgo</p>
                <p className="text-lg sm:text-xl font-bold text-green-600">
                  {investments.filter(inv => Number(inv.durationMonths) <= 3).length}
                </p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Riesgo Medio</p>
                <p className="text-lg sm:text-xl font-bold text-yellow-600">
                  {investments.filter(inv => {
                    const months = Number(inv.durationMonths);
                    return months > 3 && months <= 6;
                  }).length}
                </p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Alto Riesgo</p>
                <p className="text-lg sm:text-xl font-bold text-red-600">
                  {investments.filter(inv => Number(inv.durationMonths) > 6).length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="py-3 sm:py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { id: 'all', label: 'Todas', count: investments.length },
              { id: 'active', label: 'Activas', count: stats.activeCount },
              { id: 'completed', label: 'Completadas', count: stats.completedCount },
            ].map((filterOption) => (
              <Button
                key={filterOption.id}
                variant={filter === filterOption.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter(filterOption.id as InvestmentStatus)}
                className="whitespace-nowrap"
              >
                {filterOption.label}
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                  {filterOption.count}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      {loadingInvestments && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando inversiones...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loadingInvestments && investments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <CardTitle className="mb-2">No tienes inversiones</CardTitle>
            <CardDescription className="mb-4">
              Empieza a invertir en préstamos para generar ingresos pasivos
            </CardDescription>
            <Button variant="primary" size="sm">
              Explorar Marketplace
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Lista de inversiones */}
      {!loadingInvestments && filteredInvestments.length > 0 && (
        <div className="space-y-4">
          {filteredInvestments.map((investment) => {
            const riskInfo = getRiskLevel(investment.durationMonths);
            const statusInfo = getStatusInfo(investment.status);
            const StatusIcon = statusInfo.icon;
            const { profit, roi } = calculateROI(investment.amount, investment.totalToRepay);
            const returnProgress = Number(investment.totalToRepay) > 0
              ? ((Number(investment.paidAmount || 0) / Number(investment.totalToRepay)) * 100)
              : 0;

            return (
              <Card key={investment.id} hover>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <CardTitle className="text-base sm:text-lg truncate">
                            Préstamo #{investment.loanId}
                          </CardTitle>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskInfo.color} ${riskInfo.bg}`}>
                          Riesgo {riskInfo.text}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bg}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.text}
                        </span>
                      </div>
                      <CardDescription className="text-xs truncate">
                        Prestatario: {investment.borrower}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Detalles de la inversión */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1 text-xs">Invertido</p>
                      <p className="font-semibold text-gray-900">
                        {investment.amount} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1 text-xs">Retorno Total</p>
                      <p className="font-semibold text-gray-900">
                        {investment.totalToRepay} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1 text-xs">Ganancia</p>
                      <p className="font-semibold text-green-600">
                        +{profit} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1 text-xs">ROI</p>
                      <p className="font-semibold text-purple-600">
                        {roi}%
                      </p>
                    </div>
                  </div>

                  {/* Progress de retornos */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progreso de Retornos</span>
                      <span className="font-medium text-gray-900">
                        {returnProgress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          investment.status.toLowerCase() === 'completed'
                            ? 'bg-green-600'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600'
                        }`}
                        style={{ width: `${Math.min(returnProgress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-green-600 font-medium">
                        Recibido: {investment.paidAmount || '0'} ETH
                      </span>
                      <span className="text-gray-600 font-medium">
                        Pendiente: {investment.remaining || '0'} ETH
                      </span>
                    </div>
                  </div>

                  {/* Status específico */}
                  {investment.status.toLowerCase() === 'completed' && (
                    <div className="p-3 sm:p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-green-900">
                            Inversión Completada
                          </p>
                          <p className="text-xs sm:text-sm text-green-700">
                            ROI Total: +{roi}% • Ganancia: +{profit} ETH
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {(investment.status.toLowerCase() === 'active' || investment.status.toLowerCase() === 'funded') && (
                    <div className="p-3 sm:p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Inversión Activa
                          </p>
                          <p className="text-xs sm:text-sm text-blue-700">
                            Plazo: {investment.durationMonths} meses • Pendiente: {investment.remaining || '0'} ETH
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://sepolia.etherscan.io/address/${investment.borrower}`, '_blank')}
                    className="flex-1"
                  >
                    Ver Prestatario
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`https://sepolia.etherscan.io/tx/${investment.loanId}`, '_blank')}
                    className="flex-1"
                  >
                    Ver en Blockchain
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* No results for filter */}
      {!loadingInvestments && investments.length > 0 && filteredInvestments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No tienes inversiones en esta categoría
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}