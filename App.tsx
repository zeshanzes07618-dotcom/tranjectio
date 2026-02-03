
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown, History, Users, BarChart3 } from 'lucide-react';
import { Transaction, TransactionType } from './types';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import DebtTracker from './components/DebtTracker';
import TransactionList from './components/TransactionList';
import AddTransactionModal from './components/AddTransactionModal';

const App: React.FC = () => {
  const [userName, setUserName] = useState('Jahidul Islam');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('bdt_ledger_transactions');
    return saved ? JSON.parse(saved) : [
      { id: '1', personName: 'Rahim Ahmed', amount: 5000, type: 'cash-in', date: '2026-02-01', category: 'Salary' },
      { id: '2', personName: 'Karim Ullah', amount: 2000, type: 'cash-out', date: '2026-02-03', category: 'Rent' },
      { id: '3', personName: 'Sufia Begum', amount: 1500, type: 'cash-in', date: '2026-02-05', category: 'Freelance' }
    ];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('bdt_ledger_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const stats = useMemo(() => {
    const cashIn = transactions
      .filter(t => t.type === 'cash-in')
      .reduce((sum, t) => sum + t.amount, 0);
    const cashOut = transactions
      .filter(t => t.type === 'cash-out')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalBalance: cashIn - cashOut,
      totalSavings: cashIn - cashOut, // As per requirements: Savings = In - Out
      totalVolume: cashIn + cashOut,
      totalCashIn: cashIn,
      totalCashOut: cashOut
    };
  }, [transactions]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const txWithId = { ...newTx, id: Math.random().toString(36).substr(2, 9) };
    setTransactions([txWithId, ...transactions]);
    setIsModalOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <Header userName={userName} onEditName={setUserName} />
        
        <SummaryCards stats={stats} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <DebtTracker transactions={transactions} />
          
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-400" />
                  Recent History
                </h2>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="royal-blue-gradient p-2 rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                  <Plus className="w-6 h-6" />
                </button>
             </div>
             <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 md:hidden royal-blue-gradient w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-40 border border-white/20 active:scale-95 transition-transform"
      >
        <Plus className="w-8 h-8" />
      </button>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTransaction} 
      />
    </div>
  );
};

export default App;
