import { useState } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { ethers, BrowserProvider } from 'ethers';
import { CONTRACTS, ARBITRUM_SEPOLIA, ethToWei, weiToEth } from '@/src/lib/contracts/config';
import BrightLendABI from '@/src/lib/contracts/BrightLendSimple.json';

export function useLoanContract() {
  const { wallets } = useWallets();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContract = async () => {
    if (!wallets || wallets.length === 0) {
      throw new Error('No wallet connected');
    }

    const wallet = wallets[0];
    
    // Cambiar a Arbitrum Sepolia si no está en esa red
    await wallet.switchChain(ARBITRUM_SEPOLIA.chainId);

    // CORRECCIÓN: Usar getEthereumProvider() en lugar de getEthersProvider()
    const ethereumProvider = await wallet.getEthereumProvider();
    const provider = new BrowserProvider(ethereumProvider);
    const signer = await provider.getSigner();

    return new ethers.Contract(
      CONTRACTS.BrightLendSimple,
      BrightLendABI.abi,
      signer
    );
  };

  // ========== CREAR PRÉSTAMO ==========
  const createLoan = async (amountETH: string, durationMonths: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const contract = await getContract();
      const amountWei = ethToWei(amountETH);

      const tx = await contract.createLoan(amountWei, durationMonths);
      const receipt = await tx.wait();

      // Extraer el loan ID del evento
      const event = receipt.logs
        .map((log: any) => {
          try {
            return contract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((e: any) => e?.name === 'LoanCreated');

      const loanId = event?.args?.loanId.toString();

      return { loanId, txHash: receipt.hash };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========== FONDEAR PRÉSTAMO ==========
  const fundLoan = async (loanId: number, amountETH: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const contract = await getContract();
      const amountWei = ethToWei(amountETH);

      const tx = await contract.fundLoan(loanId, {
        value: amountWei,
      });
      const receipt = await tx.wait();

      return { txHash: receipt.hash };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========== HACER PAGO ==========
  const makePayment = async (loanId: number, amountETH: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const contract = await getContract();
      const amountWei = ethToWei(amountETH);

      const tx = await contract.makePayment(loanId, {
        value: amountWei,
      });
      const receipt = await tx.wait();

      return { txHash: receipt.hash };
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========== CONSULTAR PRÉSTAMO ==========
  const getLoan = async (loanId: number) => {
    try {
      const contract = await getContract();
      const loan = await contract.getLoan(loanId);

      return {
        id: loan.id.toString(),
        borrower: loan.borrower,
        lender: loan.lender,
        amount: weiToEth(loan.amount),
        durationMonths: loan.durationMonths.toString(),
        totalToRepay: weiToEth(loan.totalToRepay),
        monthlyPayment: weiToEth(loan.monthlyPayment),
        paidAmount: weiToEth(loan.paidAmount),
        status: ['Pending', 'Active', 'Completed'][loan.status],
        createdAt: new Date(Number(loan.createdAt) * 1000),
        fundedAt: loan.fundedAt > 0 ? new Date(Number(loan.fundedAt) * 1000) : null,
      };
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // ========== PRÉSTAMOS PENDIENTES ==========
  const getPendingLoans = async () => {
    try {
      const contract = await getContract();
      const loanIds = await contract.getPendingLoans();
      
      // Convertir BigInt[] a number[]
      return loanIds.map((id: bigint) => Number(id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // ========== MIS PRÉSTAMOS (como prestatario) ==========
  const getMyLoans = async (address: string) => {
    try {
      const contract = await getContract();
      const loanIds = await contract.getUserLoans(address);
      
      return loanIds.map((id: bigint) => Number(id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // ========== MIS INVERSIONES (como inversor) ==========
  const getMyInvestments = async (address: string) => {
    try {
      const contract = await getContract();
      const loanIds = await contract.getLenderInvestments(address);
      
      return loanIds.map((id: bigint) => Number(id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // ========== MONTO RESTANTE ==========
  const getRemainingAmount = async (loanId: number) => {
    try {
      const contract = await getContract();
      const remaining = await contract.getRemainingAmount(loanId);
      
      return weiToEth(remaining);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    createLoan,
    fundLoan,
    makePayment,
    getLoan,
    getPendingLoans,
    getMyLoans,
    getMyInvestments,
    getRemainingAmount,
    loading,
    error,
  };
}