'use client';

import { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useLoanContract } from '@/src/hooks/useLoanContract';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface LoanDetails {
  id: string;
  borrower: string;
  amount: string;
  durationMonths: string;
  totalToRepay: string;
  status: string;
}

export function LoanMarketplace() {
  const { user, ready: privyReady } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  const { getPendingLoans, getLoan, fundLoan, loading } = useLoanContract();
  const [loans, setLoans] = useState<LoanDetails[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(true);

  useEffect(() => {
    // Esperar a que Privy y las wallets estén listas
    if (!privyReady || !walletsReady) return;
    
    // Verificar que haya una wallet conectada
    if (wallets && wallets.length > 0) {
      loadLoans();
    } else {
      setLoadingLoans(false);
    }
  }, [privyReady, walletsReady, wallets]);

  const loadLoans = async () => {
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
    if (!confirm(`¿Invertir ${amount} ETH en este préstamo?`)) return;
    
    try {
      await fundLoan(Number(loanId), amount);
      alert('¡Inversión exitosa!');
      loadLoans(); // Recargar lista
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  // Mostrar mensaje mientras se carga Privy
  if (!privyReady || !walletsReady) {
    return <div>Inicializando...</div>;
  }

  // Mostrar mensaje si no hay wallet conectada
  if (!wallets || wallets.length === 0) {
    return (
      <Card>
        <p>Por favor, conecta tu wallet para ver el marketplace.</p>
      </Card>
    );
  }

  if (loadingLoans) {
    return <div>Cargando préstamos disponibles...</div>;
  }

  if (loans.length === 0) {
    return (
      <Card>
        <p>No hay préstamos disponibles para invertir en este momento.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Marketplace - Préstamos Disponibles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loans.map((loan) => (
          <Card key={loan.id}>
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-500">Préstamo #{loan.id}</span>
                <span className="bg-yellow-100 px-2 py-1 rounded text-xs">
                  {loan.status}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold">{loan.amount} ETH</h3>
              
              <div className="text-sm space-y-1">
                <p>⏱️ Plazo: {loan.durationMonths} meses</p>
                <p>💰 Total a recibir: <strong>{loan.totalToRepay} ETH</strong></p>
                <p className="text-green-600">
                  📈 Ganancia: {(Number(loan.totalToRepay) - Number(loan.amount)).toFixed(4)} ETH
                </p>
              </div>

              <div className="text-xs text-gray-500 truncate">
                Prestatario: {loan.borrower}
              </div>

              {/* No permitir que el prestatario invierta en su propio préstamo */}
              {user?.wallet?.address?.toLowerCase() !== loan.borrower.toLowerCase() ? (
                <Button
                  onClick={() => handleFund(loan.id, loan.amount)}
                  disabled={loading}
                  className="w-full"
                >
                  Invertir {loan.amount} ETH
                </Button>
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  Este es tu préstamo
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}