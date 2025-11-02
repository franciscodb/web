'use client';

import { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { BrowserProvider, formatEther } from 'ethers';
import { RequestLoanForm } from '../components/RequestLoanForm';
import { MyLoans } from '../components/MyLoans';
import { LoanMarketplace } from '../components/LoanMarketplace';

export default function DashboardPage() {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    loadBalance();
  }, [wallets]);

  const loadBalance = async () => {
    if (!wallets || wallets.length === 0) return;

    try {
      const wallet = wallets[0];
      
      // CORRECCIÓN: Usar getEthereumProvider() en lugar de getEthersProvider()
      const ethereumProvider = await wallet.getEthereumProvider();
      const provider = new BrowserProvider(ethereumProvider);
      const address = await wallet.address;
      
      const balanceWei = await provider.getBalance(address);
      const balanceETH = formatEther(balanceWei);
      
      setBalance(Number(balanceETH).toFixed(4));
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <p className="text-sm opacity-90">Tu balance</p>
        <h1 className="text-4xl font-bold">{balance} ETH</h1>
        <p className="text-sm opacity-75 truncate">
          {user?.wallet?.address}
        </p>
      </div>

      {/* Tabs o Secciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RequestLoanForm />
        <MyLoans />
      </div>

      <LoanMarketplace />
    </div>
  );
}