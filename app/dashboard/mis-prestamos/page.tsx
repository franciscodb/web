'use client';

import { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useLoanContract } from '@/src/hooks/useLoanContract';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import {
  Wallet,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  ArrowRight,
  FileText,
  ExternalLink,
  RefreshCw,
  User,
} from 'lucide-react';

type LoanStatus = 'active' | 'completed' | 'pending' | 'all';

export default function MyLoansPage() {
  const { user, ready: privyReady } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  const { getMyLoans, getLoan, makePayment, getRemainingAmount, loading } = useLoanContract();
  const [loans, setLoans] = useState<any[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [activeFilter, setActiveFilter] = useState<LoanStatus>('all');
  const [expandedLoan, setExpandedLoan] = useState<number | null>(null);

  useEffect(() => {
    if (!privyReady || !walletsReady) return;
    
    if (wallets && wallets.length > 0 && user?.wallet?.address) {
      loadMyLoans();
    } else {
      setLoadingLoans(false);
    }
  }, [privyReady, walletsReady, wallets, user]);

  const loadMyLoans = async () => {
    if (!user?.wallet?.address) return;

    setLoadingLoans(true);
    try {
      const loanIds = await getMyLoans(user.wallet.address);
      
      const loansData = await Promise.all(
        loanIds.map(async (id) => {
          const loan = await getLoan(id);
          const remaining = await getRemainingAmount(id);
          return { ...loan, remaining };
        })
      );
      
      setLoans(loansData);
    } catch (error) {
      console.error('Error loading my loans:', error);
    } finally {
      setLoadingLoans(false);
    }
  };

  const handlePayment = async (loanId: string, monthlyPayment: string) => {
    const amount = prompt(`¿Cuánto deseas pagar? (Sugerido: ${monthlyPayment} ETH)`);
    if (!amount || isNaN(Number(amount))) return;

    const confirmed = window.confirm(
      `¿Confirmas realizar un pago de ${amount} ETH?\n\n` +
      `Préstamo #${loanId}`
    );

    if (!confirmed) return;

    try {
      await makePayment(Number(loanId), amount);
      alert('¡Pago realizado exitosamente! 🎉');
      loadMyLoans();
    } catch (error: any) {
      alert(`Error al realizar el pago: ${error.message}`);
    }
  };

  const getStatusInfo = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus === 'completed') {
      return {
        text: 'Completado',
        color: 'text-green-600',
        bg: 'bg-green-50',
        icon: CheckCircle,
      };
    }
    if (normalizedStatus === 'active' || normalizedStatus === 'funded') {
      return {
        text: 'Activo',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        icon: Clock,
      };
    }
    return {
      text: 'Pendiente',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      icon: AlertCircle,
    };
  };

  const filteredLoans = loans.filter((loan) => {
    if (activeFilter === 'all') return true;
    const status = loan.status.toLowerCase();
    
    if (activeFilter === 'active') return status === 'active' || status === 'funded';
    if (activeFilter === 'completed') return status === 'completed';
    if (activeFilter === 'pending') return status === 'pending';
    
    return true;
  });

  const stats = {
    total: loans.length,
    active: loans.filter((l) => l.status.toLowerCase() === 'active' || l.status.toLowerCase() === 'funded').length,
    completed: loans.filter((l) => l.status.toLowerCase() === 'completed').length,
    pending: loans.filter((l) => l.status.toLowerCase() === 'pending').length,
    totalBorrowed: loans.reduce((sum, l) => sum + Number(l.amount || 0), 0).toFixed(4),
    totalPaid: loans.reduce((sum, l) => sum + Number(l.paidAmount || 0), 0).toFixed(4),
    totalRemaining: loans.reduce((sum, l) => sum + Number(l.remaining || 0), 0).toFixed(4),
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
            Por favor, conecta tu wallet para ver tus préstamos
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
            Mis Préstamos
          </h1>
          <p className="text-gray-600 mt-1">
            Administra tus préstamos y pagos
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadMyLoans}
          disabled={loadingLoans}
          className="flex-shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loadingLoans ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Total Prestado</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats.totalBorrowed} ETH
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Total Pagado</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats.totalPaid} ETH
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Por Pagar</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats.totalRemaining} ETH
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Préstamos</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats.active} activos
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-3 sm:py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { id: 'all', label: 'Todos', count: stats.total },
              { id: 'active', label: 'Activos', count: stats.active },
              { id: 'pending', label: 'Pendientes', count: stats.pending },
              { id: 'completed', label: 'Completados', count: stats.completed },
            ].map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter(filter.id as LoanStatus)}
                className="whitespace-nowrap"
              >
                {filter.label}
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                  {filter.count}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      {loadingLoans && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando tus préstamos...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loadingLoans && loans.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              No tienes préstamos solicitados aún
            </p>
            <Button variant="primary" size="sm">
              Solicitar Préstamo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loans List */}
      {!loadingLoans && filteredLoans.length === 0 && loans.length > 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No tienes préstamos en esta categoría
            </p>
          </CardContent>
        </Card>
      )}

      {!loadingLoans && filteredLoans.length > 0 && (
        <div className="space-y-4">
          {filteredLoans.map((loan) => {
            const statusInfo = getStatusInfo(loan.status);
            const StatusIcon = statusInfo.icon;
            const isExpanded = expandedLoan === Number(loan.id);
            const progressPercentage = loan.totalToRepay > 0 
              ? ((Number(loan.paidAmount) / Number(loan.totalToRepay)) * 100)
              : 0;

            return (
              <Card key={loan.id} hover>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <CardTitle className="text-lg sm:text-xl">
                          Préstamo #{loan.id}
                        </CardTitle>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bg}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.text}
                        </span>
                      </div>
                      <CardDescription className="text-sm">
                        Plazo: {loan.durationMonths} meses
                      </CardDescription>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {loan.amount} ETH
                      </p>
                      <p className="text-xs text-gray-500">
                        Total: {loan.totalToRepay} ETH
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progreso de pago</span>
                      <span className="font-medium text-gray-900">
                        {progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          loan.status.toLowerCase() === 'completed'
                            ? 'bg-green-600'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600'
                        }`}
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Key Info Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Ya Pagado</p>
                      <p className="font-semibold text-green-600">
                        {loan.paidAmount} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Falta</p>
                      <p className="font-semibold text-orange-600">
                        {loan.remaining} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Pago Mensual</p>
                      <p className="font-semibold text-gray-900">
                        {loan.monthlyPayment} ETH
                      </p>
                    </div>
                  </div>

                  {/* Lender Info */}
                  {loan.lender && loan.lender !== '0x0000000000000000000000000000000000000000' && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 mb-0.5">Inversor</p>
                        <p className="text-xs font-mono truncate text-gray-900">
                          {loan.lender}
                        </p>
                      </div>
                      <button
                        onClick={() => window.open(`https://sepolia.etherscan.io/address/${loan.lender}`, '_blank')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                        title="Ver en Etherscan"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  )}

                  {/* Payment Action */}
                  {(loan.status.toLowerCase() === 'active' || loan.status.toLowerCase() === 'funded') && (
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <DollarSign className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-blue-900 mb-1">
                              Realizar Pago
                            </p>
                            <p className="text-sm text-blue-700">
                              Pago sugerido: {loan.monthlyPayment} ETH
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handlePayment(loan.id, loan.monthlyPayment)}
                          disabled={loading}
                          className="flex-shrink-0"
                        >
                          {loading ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            'Pagar'
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Completed Badge */}
                  {loan.status.toLowerCase() === 'completed' && (
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="font-medium text-green-900">
                        ✅ Préstamo completado
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`https://sepolia.etherscan.io/tx/${loan.id}`, '_blank')}
                    fullWidth
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver en Blockchain
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}