'use client';

import { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useLoanContract } from '@/src/hooks/useLoanContract';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import {
  Search,
  Filter,
  TrendingUp,
  Clock,
  DollarSign,
  User,
  Shield,
  AlertCircle,
  Wallet,
  RefreshCw,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';

interface LoanDetails {
  id: string;
  borrower: string;
  amount: string;
  durationMonths: string;
  totalToRepay: string;
  status: string;
}

// IMPORTANTE: Debe ser export default
export default function MarketplacePage() {
  const { user, ready: privyReady } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  const { getPendingLoans, getLoan, fundLoan, loading } = useLoanContract();
  const [loans, setLoans] = useState<LoanDetails[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'amount' | 'return' | 'duration'>('amount');

  useEffect(() => {
    if (!privyReady || !walletsReady) return;
    
    if (wallets && wallets.length > 0) {
      loadLoans();
    } else {
      setLoadingLoans(false);
    }
  }, [privyReady, walletsReady, wallets]);

  const loadLoans = async () => {
    setLoadingLoans(true);
    try {
      const loanIds = await getPendingLoans();
      const loansData = await Promise.all(
        loanIds.map((id) => getLoan(id))
      );
      setLoans(loansData);
    } catch (error) {
      console.error('Error loading loans:', error);
    } finally {
      setLoadingLoans(false);
    }
  };

  const handleFund = async (loanId: string, amount: string) => {
    const confirmed = window.confirm(
      `¿Confirmas invertir ${amount} ETH en este préstamo?\n\n` +
      `Recibirás ${loans.find(l => l.id === loanId)?.totalToRepay} ETH al finalizar.`
    );
    
    if (!confirmed) return;
    
    try {
      await fundLoan(Number(loanId), amount);
      alert('¡Inversión exitosa! 🎉');
      loadLoans();
    } catch (error: any) {
      alert(`Error al invertir: ${error.message}`);
    }
  };

  const calculateROI = (amount: string, totalToRepay: string) => {
    const invested = Number(amount);
    const returns = Number(totalToRepay);
    const profit = returns - invested;
    const roi = ((profit / invested) * 100).toFixed(2);
    return { profit: profit.toFixed(4), roi };
  };

  const getRiskLevel = (duration: string) => {
    const months = Number(duration);
    if (months <= 3) return { text: 'Bajo Riesgo', color: 'text-green-600', bg: 'bg-green-50' };
    if (months <= 6) return { text: 'Riesgo Medio', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: 'Alto Riesgo', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const filteredAndSortedLoans = loans
    .filter((loan) =>
      loan.borrower.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.id.includes(searchQuery)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return Number(b.amount) - Number(a.amount);
        case 'return':
          return Number(b.totalToRepay) - Number(a.totalToRepay);
        case 'duration':
          return Number(a.durationMonths) - Number(b.durationMonths);
        default:
          return 0;
      }
    });

  if (!privyReady || !walletsReady) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Inicializando marketplace...</p>
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
            Por favor, conecta tu wallet para ver préstamos disponibles
          </CardDescription>
          <Button variant="primary">Conectar Wallet</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Marketplace
          </h2>
          <p className="text-gray-600 mt-1">
            {loans.length} préstamos disponibles para invertir
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadLoans}
          disabled={loadingLoans}
          className="flex-shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loadingLoans ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar por ID o dirección..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="amount">Mayor Monto</option>
          <option value="return">Mayor Retorno</option>
          <option value="duration">Menor Plazo</option>
        </select>
      </div>

      {loadingLoans && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando préstamos...</p>
          </div>
        </div>
      )}

      {!loadingLoans && loans.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <CardTitle className="mb-2">No hay préstamos disponibles</CardTitle>
            <CardDescription className="mb-4">
              No hay préstamos activos en el marketplace en este momento.
            </CardDescription>
            <Button variant="outline" onClick={loadLoans}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </CardContent>
        </Card>
      )}

      {!loadingLoans && loans.length > 0 && filteredAndSortedLoans.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No se encontraron préstamos que coincidan con tu búsqueda
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="mt-4"
            >
              Limpiar búsqueda
            </Button>
          </CardContent>
        </Card>
      )}

      {!loadingLoans && filteredAndSortedLoans.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAndSortedLoans.map((loan) => {
            const { profit, roi } = calculateROI(loan.amount, loan.totalToRepay);
            const riskInfo = getRiskLevel(loan.durationMonths);
            const isOwnLoan = user?.wallet?.address?.toLowerCase() === loan.borrower.toLowerCase();

            return (
              <Card key={loan.id} hover className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      Préstamo #{loan.id}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskInfo.color} ${riskInfo.bg}`}>
                      {riskInfo.text}
                    </span>
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl">
                    {loan.amount} ETH
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">Plazo</span>
                      </div>
                      <p className="font-bold text-blue-900">
                        {loan.durationMonths} meses
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 text-green-600 mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs font-medium">Retorno</span>
                      </div>
                      <p className="font-bold text-green-900">
                        {loan.totalToRepay} ETH
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-900">
                        Ganancia Estimada
                      </span>
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-900 mb-1">
                      +{profit} ETH
                    </p>
                    <p className="text-sm text-purple-700">
                      ROI: <span className="font-semibold">{roi}%</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">Prestatario</p>
                      <p className="text-xs font-mono truncate text-gray-900">
                        {loan.borrower}
                      </p>
                    </div>
                    <button
                      onClick={() => window.open(`https://sepolia.etherscan.io/address/${loan.borrower}`, '_blank')}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                      title="Ver en Etherscan"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {isOwnLoan && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-yellow-800">
                        Este es tu préstamo. No puedes invertir en él.
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-4 border-t border-gray-200">
                  {isOwnLoan ? (
                    <Button variant="outline" fullWidth disabled>
                      <Shield className="w-4 h-4 mr-2" />
                      Tu Préstamo
                    </Button>
                  ) : (
                    <div className="w-full space-y-2">
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => handleFund(loan.id, loan.amount)}
                        disabled={loading}
                        className="font-semibold"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Invertir {loan.amount} ETH
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-center text-gray-500">
                        Recibirás {loan.totalToRepay} ETH en {loan.durationMonths} meses
                      </p>
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}