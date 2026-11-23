import React, { useState, useMemo } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Plus,
  Trash2,
  TrendingUp,
  Tag,
  DollarSign,
  PieChart as PieIcon,
  X,
  CreditCard,
  Target,
  Edit2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { usePlanner } from '../context/PlannerContext';
import { Transaction, TransactionType, FinancialGoal, BudgetLimit } from '../types';
import { MONTH_NAMES } from '../utils/calendarUtils';

const PIE_COLORS = ['#0284C7', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#6366F1', '#14B8A6'];

export const FinancePlannerView: React.FC = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    budgetLimits,
    updateBudgetLimit,
    financialGoals,
    addFinancialGoal,
    updateFinancialGoal,
    deleteFinancialGoal,
    settings,
    selectedDate,
    selectedMonth,
  } = usePlanner();

  const currency = settings.currency || '₹';

  // Transaction Modal
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [txCategory, setTxCategory] = useState('Groceries & Nutrition');
  const [txAmount, setTxAmount] = useState<number | ''>('');
  const [txDate, setTxDate] = useState(selectedDate);
  const [txDesc, setTxDesc] = useState('');
  const [txMethod, setTxMethod] = useState('UPI');

  // Financial Goal Modal
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [fgTitle, setFgTitle] = useState('');
  const [fgTarget, setFgTarget] = useState<number | ''>('');
  const [fgCurrent, setFgCurrent] = useState<number | ''>('');
  const [fgDeadline, setFgDeadline] = useState('2027-12-31');
  const [fgCategory, setFgCategory] = useState('Safety Net');

  // Edit Budget Limit inline
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newLimitValue, setNewLimitValue] = useState<number>(0);

  // Month filter for transactions
  const [filterMonth, setFilterMonth] = useState<number>(selectedMonth || 1);

  // Filtered transactions for the chosen month
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const m = parseInt(t.date.split('-')[1], 10);
      return m === filterMonth;
    });
  }, [transactions, filterMonth]);

  // Totals
  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const totalSavings = monthTransactions
    .filter((t) => t.type === 'savings')
    .reduce((s, t) => s + t.amount, 0);

  const netSavingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  // Category breakdown for Pie Chart
  const categoryExpenses = useMemo(() => {
    const map: Record<string, number> = {};
    monthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [monthTransactions]);

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || !txDesc.trim()) return;

    addTransaction({
      type: txType,
      category: txCategory,
      amount: Number(txAmount),
      date: txDate,
      description: txDesc.trim(),
      paymentMethod: txMethod,
    });

    setIsTxModalOpen(false);
    setTxAmount('');
    setTxDesc('');
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fgTitle.trim() || !fgTarget) return;

    addFinancialGoal({
      title: fgTitle.trim(),
      targetAmount: Number(fgTarget),
      currentAmount: Number(fgCurrent || 0),
      deadline: fgDeadline,
      category: fgCategory.trim(),
    });

    setIsGoalModalOpen(false);
    setFgTitle('');
    setFgTarget('');
    setFgCurrent('');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Header & Month Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1">
            <Wallet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Wealth & Cashflow 2027 ({currency})</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">
            Personal Finance Planner
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Track monthly cash flows, budget allocations, savings rate, and financial targets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(Number(e.target.value))}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            {MONTH_NAMES.map((m, idx) => (
              <option key={m} value={idx + 1}>
                {m} 2027
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setIsTxModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Record
          </button>
        </div>
      </div>

      {/* TOP 4 FINANCIAL METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Monthly Income</p>
            <h3 className="text-xl sm:text-2xl font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              {currency}{totalIncome.toLocaleString('en-IN')}
            </h3>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Inflows
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        {/* Total Expenses */}
        <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Total Expenses</p>
            <h3 className="text-xl sm:text-2xl font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              {currency}{totalExpense.toLocaleString('en-IN')}
            </h3>
            <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-0.5 mt-1">
              <ArrowDownRight className="w-3.5 h-3.5" /> Outflows
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        {/* Total Savings / Investments */}
        <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Invested / Saved</p>
            <h3 className="text-xl sm:text-2xl font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              {currency}{totalSavings.toLocaleString('en-IN')}
            </h3>
            <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-0.5 mt-1">
              <PiggyBank className="w-3.5 h-3.5" /> SIP & RD
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-500">
            <PiggyBank className="w-6 h-6" />
          </div>
        </div>

        {/* Savings Rate */}
        <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Net Savings Rate</p>
            <h3 className="text-xl sm:text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {netSavingsRate}%
            </h3>
            <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 block">
              Remaining: {currency}{(totalIncome - totalExpense).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TWO COLUMN SECTION: SPENDING BREAKDOWN CHART VS BUDGET LIMITS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 Cols): Spending Distribution Chart */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-brand-500" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Spending by Category
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              {MONTH_NAMES[filterMonth - 1]} 2027
            </span>
          </div>

          {categoryExpenses.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 italic">
              No expense records logged for this month.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryExpenses}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {categoryExpenses.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [`${currency}${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Right Column (6 Cols): Budget Category Limits */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-500" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Budget Categories & Limits
              </h4>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400">Monthly Caps</span>
          </div>

          <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
            {budgetLimits.map((b) => {
              const spent = monthTransactions
                .filter((t) => t.type === 'expense' && t.category === b.category)
                .reduce((acc, t) => acc + t.amount, 0);
              const pct = Math.min(Math.round((spent / b.monthlyLimit) * 100), 100);

              return (
                <div key={b.category} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {b.category}
                    </span>
                    <span className="font-mono text-slate-600 dark:text-slate-300">
                      {currency}{spent.toLocaleString('en-IN')} / {currency}
                      {b.monthlyLimit.toLocaleString('en-IN')} ({pct}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct > 90
                          ? 'bg-red-500'
                          : pct > 75
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-emerald-500 to-brand-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FINANCIAL GOALS RESERVES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-brand-500" />
            2027 Financial Goals & Sinking Funds
          </h3>
          <button
            type="button"
            onClick={() => setIsGoalModalOpen(true)}
            className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> New Goal Fund
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {financialGoals.map((fg) => {
            const pct = Math.min(Math.round((fg.currentAmount / fg.targetAmount) * 100), 100);

            return (
              <div
                key={fg.id}
                className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="font-bold uppercase tracking-wider">{fg.category}</span>
                    <button
                      type="button"
                      onClick={() => deleteFinancialGoal(fg.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {fg.title}
                  </h4>
                  <div className="flex justify-between items-center font-mono text-xs pt-1">
                    <span className="text-slate-500">Saved:</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400">
                      {currency}{fg.currentAmount.toLocaleString('en-IN')} / {currency}
                      {fg.targetAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>Deadline: {fg.deadline}</span>
                    <span className="font-mono font-bold">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-500 to-lavender-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TRANSACTION HISTORY TABLE */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {MONTH_NAMES[filterMonth - 1]} 2027 Transactions ({monthTransactions.length})
          </h3>
          <button
            type="button"
            onClick={() => setIsTxModalOpen(true)}
            className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Transaction
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Payment Method</th>
                <th className="py-2.5 px-3 text-right">Amount ({currency})</th>
                <th className="py-2.5 px-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {monthTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50 dark:hover:bg-navy-850/50 transition-colors"
                >
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {tx.date}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {tx.description}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-medium">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{tx.paymentMethod || 'UPI'}</td>
                  <td
                    className={`py-3 px-3 text-right font-mono font-bold ${
                      tx.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : tx.type === 'savings'
                        ? 'text-brand-600 dark:text-brand-400'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {currency}{tx.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => deleteTransaction(tx.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD TRANSACTION MODAL */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Record Financial Entry
              </h3>
              <button
                type="button"
                onClick={() => setIsTxModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['expense', 'income', 'savings'] as TransactionType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTxType(t)}
                      className={`py-2 text-xs font-semibold rounded-xl capitalize transition-all border ${
                        txType === t
                          ? 'bg-brand-500 border-brand-500 text-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Amount ({currency}) *
                </label>
                <input
                  type="number"
                  required
                  autoFocus
                  min="1"
                  value={txAmount}
                  onChange={(e) => setTxAmount(Number(e.target.value))}
                  placeholder="e.g. 2500"
                  className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  placeholder="e.g. Monthly Grocery Pantry Restock..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  >
                    <option value="Groceries & Nutrition">Groceries</option>
                    <option value="Housing & Utilities">Housing & Rent</option>
                    <option value="Dining & Social">Dining & Social</option>
                    <option value="Books & Courses">Books & Tech</option>
                    <option value="Transport & Commute">Transport</option>
                    <option value="Mutual Fund SIP">Mutual Fund SIP</option>
                    <option value="Stipend / Salary">Stipend / Salary</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={txMethod}
                    onChange={(e) => setTxMethod(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe)</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTxModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD FINANCIAL GOAL MODAL */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                New Financial Goal Fund
              </h3>
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={fgTitle}
                  onChange={(e) => setFgTitle(e.target.value)}
                  placeholder="e.g. MacBook Pro M4 Fund..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target ({currency}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={fgTarget}
                    onChange={(e) => setFgTarget(Number(e.target.value))}
                    placeholder="180000"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={fgCurrent}
                    onChange={(e) => setFgCurrent(Number(e.target.value))}
                    placeholder="50000"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={fgCategory}
                    onChange={(e) => setFgCategory(e.target.value)}
                    placeholder="Tech, Travel, Emergency"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    required
                    value={fgDeadline}
                    onChange={(e) => setFgDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-850"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold shadow-sm"
                >
                  Save Fund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
