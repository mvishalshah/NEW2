import React, { useState } from 'react';
import { ImageModal } from './ImageModal';
import { useApp } from '../context/AppContext.js';
import {
  Receipt,
  Search,
  Plus,
  Camera,
  Trash2,
  Calendar,
  Filter,
  Users,
  ChevronDown
} from 'lucide-react';

export const ExpensesListView: React.FC = () => {
  const {
    expenses,
    currentUser,
    allUsers,
    groups,
    openAddExpenseModal,
    deleteExpense
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGroupId, setSelectedGroupId] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'receipts'>('all');

  const categories = ['all', 'Food', 'Transport', 'Education', 'Shopping', 'Entertainment', 'Hostel', 'Other'];

  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const filteredExpenses = safeExpenses.filter((exp) => {
    if (!exp) return false;
    if (activeTab === 'receipts' && exp.source !== 'ocr' && !exp.receiptUrl && !(exp.items && exp.items.length > 0)) return false;
    const matchesCat = selectedCategory === 'all' || exp.category === selectedCategory;
    const matchesGrp = selectedGroupId === 'all' || (selectedGroupId === 'personal' ? !exp.groupId : exp.groupId === selectedGroupId);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (exp.title && exp.title.toLowerCase().includes(q)) ||
      (exp.description && exp.description.toLowerCase().includes(q)) ||
      (exp.groupName && exp.groupName.toLowerCase().includes(q));
    return matchesCat && matchesGrp && matchesSearch;
  });

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const [previewReceiptUrl, setPreviewReceiptUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-indigo-600" />
            <span>Expense Ledger & Receipts</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {filteredExpenses.length} records • Total ₹{totalFilteredAmount.toLocaleString('en-IN')}
          </p>
        </div>



        <div className="flex items-center gap-2">
          <button
            onClick={() => openAddExpenseModal('ocr')}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Receipt</span>
          </button>
          <button
            onClick={() => openAddExpenseModal('manual')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'all' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          All Expenses
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'receipts' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <Receipt className="w-4 h-4" />
          Receipt History
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          {/* Group Filter */}
          <div>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
            >
              <option value="all">All Groups & Personal</option>
              <option value="personal">Personal Only (No Group)</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No expenses found matching the current criteria.
          </div>
        ) : (
          filteredExpenses.map((exp) => {
            const payer = allUsers.find((u) => u.id === exp.paidBy);
            const userPart = exp.participants.find((p) => p.userId === currentUser?.id);
            const isPayer = exp.paidBy === currentUser?.id;

            return (
              <div
                key={exp.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                    {exp.category[0]}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{exp.title}</h4>
                      {exp.source === 'ocr' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                          📷 OCR
                        </span>
                      )}
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {exp.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{exp.groupName || 'Personal'}</span>
                      <span>•</span>
                      <span>Paid by <span className="font-semibold text-slate-700 dark:text-slate-300">{payer?.name || 'Someone'}</span></span>
                      <span>•</span>
                      <span>{new Date(exp.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span className="capitalize">{exp.splitMethod} split</span>
                    </div>

                    {/* Participant Avatars */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-400">Split ({exp.participants.length}):</span>
                      <div className="flex -space-x-1.5">
                        {exp.participants.map((p) => {
                          const u = allUsers.find((user) => user.id === p.userId);
                          return (
                            <img
                              key={p.userId}
                              src={u?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                              alt={u?.name}
                              title={`${u?.name}: ₹${p.shareAmount}`}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-white dark:ring-slate-900"
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs font-medium">
                      {isPayer ? (
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">You paid full</span>
                      ) : userPart ? (
                        <span className="text-red-500 font-semibold">Your share: ₹{userPart.shareAmount}</span>
                      ) : (
                        <span className="text-slate-400">Not in split</span>
                      )}
                    </div>
                  </div>

                  {exp.receiptUrl && (
                    <button
                      onClick={() => {
                        setPreviewReceiptUrl(exp.receiptUrl);
                        setPreviewTitle(exp.title);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                      title="View Receipt"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    </button>
                  )}
                  <button
                    onClick={() => openAddExpenseModal(exp.source === 'ocr' ? 'ocr' : 'manual', exp.groupId, exp)}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                    title={exp.source === 'ocr' ? 'Edit / Re-split Receipt' : 'Edit Expense'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-pen-square"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
                  </button>

                  {(isPayer || exp.createdBy === currentUser?.id) && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete expense "${exp.title}"?`)) {
                          deleteExpense(exp.id);
                        }
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                      title="Delete Expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      {previewReceiptUrl && (
        <ImageModal
          isOpen={true}
          imageUrl={previewReceiptUrl}
          title={previewTitle}
          onClose={() => setPreviewReceiptUrl(null)}
        />
      )}
    </div>
  );
};
