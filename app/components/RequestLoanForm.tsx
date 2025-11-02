'use client';

import { useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { useLoanContract } from '@/src/hooks/useLoanContract';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function RequestLoanForm() {
  const { wallets, ready: walletsReady } = useWallets();
  const { createLoan, loading } = useLoanContract();
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(6);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que haya una wallet conectada
    if (!wallets || wallets.length === 0) {
      alert('Por favor, conecta tu wallet primero');
      return;
    }

    // Validar que el monto sea válido
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Por favor, ingresa un monto válido');
      return;
    }

    try {
      const result = await createLoan(amount, duration);
      alert(`¡Préstamo creado! ID: ${result.loanId}`);
      setSuccess(true);
      setAmount('');
      
      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error creating loan:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Mostrar mensaje si no hay wallet conectada
  if (!walletsReady || !wallets || wallets.length === 0) {
    return (
      <Card>
        <h2 className="text-2xl font-bold mb-4">Solicitar Préstamo</h2>
        <p className="text-gray-500">Conecta tu wallet para solicitar un préstamo.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">Solicitar Préstamo</h2>
      
      {success && (
        <div className="bg-green-100 p-3 rounded mb-4">
          ✅ Préstamo creado exitosamente
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Monto (ETH)</label>
          <input
            type="number"
            step="0.001"
            min="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ej: 0.1"
            className="w-full p-2 border rounded"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Interés: 20% anual
          </p>
        </div>

        <div>
          <label className="block mb-2">Duración</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value={3}>3 meses</option>
            <option value={6}>6 meses</option>
            <option value={12}>12 meses</option>
            <option value={24}>24 meses</option>
          </select>
        </div>

        <div className="bg-blue-50 p-3 rounded">
          <p className="text-sm">
            💡 Tu préstamo aparecerá en el marketplace para que otros usuarios puedan invertir
          </p>
        </div>

        <Button type="submit" disabled={loading || !amount}>
          {loading ? 'Creando...' : 'Solicitar  éstamo'}
        </Button>
      </form>
    </Card>
  );
}