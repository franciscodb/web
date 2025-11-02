'use client';

import { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useLoanContract } from '@/src/hooks/useLoanContract';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function MyLoans() {
  const { user, ready: privyReady } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  const { getMyLoans, getLoan, makePayment, getRemainingAmount, loading } = useLoanContract();
  const [loans, setLoans] = useState<any[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(true);

  useEffect(() => {
    // Esperar a que Privy y las wallets estén listas
    if (!privyReady || !walletsReady) return;
    
    // Verificar que haya una wallet conectada
    if (wallets && wallets.length > 0 && user?.wallet?.address) {
      loadMyLoans();
    } else {
      setLoadingLoans(false);
    }
  }, [privyReady, walletsReady, wallets, user]);

  const loadMyLoans = async () => {
    if (!user?.wallet?.address) return;

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
    if (!amount) return;

    try {
      await makePayment(Number(loanId), amount);
      alert('¡Pago realizado exitosamente!');
      loadMyLoans(); // Recargar
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
        <p>Por favor, conecta tu wallet para ver tus préstamos.</p>
      </Card>
    );
  }

  if (loadingLoans) return <div>Cargando tus préstamos...</div>;

  if (loans.length === 0) {
    return (
      <Card>
        <p>No tienes préstamos solicitados aún.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Mis Préstamos</h2>
      
      {loans.map((loan) => (
        <Card key={loan.id}>
          <div className="space-y-3">
            <div className="flex justify-between">
              <h3 className="text-xl font-bold">Préstamo #{loan.id}</h3>
              <span className={`px-3 py-1 rounded text-sm ${
                loan.status === 'Completed' ? 'bg-green-100' :
                loan.status === 'Active' ? 'bg-blue-100' :
                'bg-yellow-100'
              }`}>
                {loan.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Monto recibido</p>
                <p className="font-bold">{loan.amount} ETH</p>
              </div>
              <div>
                <p className="text-gray-500">Total a pagar</p>
                <p className="font-bold">{loan.totalToRepay} ETH</p>
              </div>
              <div>
                <p className="text-gray-500">Ya pagado</p>
                <p className="font-bold text-green-600">{loan.paidAmount} ETH</p>
              </div>
              <div>
                <p className="text-gray-500">Falta por pagar</p>
                <p className="font-bold text-red-600">{loan.remaining} ETH</p>
              </div>
            </div>

            {loan.lender !== '0x0000000000000000000000000000000000000000' && (
              <div className="text-xs text-gray-500">
                Inversor: {loan.lender}
              </div>
            )}

            {loan.status === 'Active' && (
              <div className="space-y-2">
                <p className="text-sm">
                  💡 Pago mensual sugerido: <strong>{loan.monthlyPayment} ETH</strong>
                </p>
                <Button
                  onClick={() => handlePayment(loan.id, loan.monthlyPayment)}
                  disabled={loading}
                  className="w-full"
                >
                  Hacer Pago
                </Button>
              </div>
            )}

            {loan.status === 'Completed' && (
              <div className="bg-green-50 p-3 rounded text-center">
                ✅ Préstamo completado
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}