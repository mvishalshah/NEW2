import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { OCRScanner } from './OCRScanner.js';
import { SplitMethod, ExpenseItem } from '../types.js';
import {
  X,
  Camera,
  PenTool,
  Receipt,
  Users,
  Check,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  PieChart
} from 'lucide-react';

export const AddExpenseModal: React.FC = () => {
  const {
    isAddExpenseModalOpen,
    closeAddExpenseModal,
    initialAddExpenseMode,
    groups,
    allUsers,
    currentUser,
    selectedGroupId: contextGroupId,
    addExpense,
    refreshAllData,
    showToast
  } = useApp();


  const [mode, setMode] = useState<'manual' | 'ocr'>(initialAddExpenseMode || 'manual');

  // Manual Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'Food' | 'Transport' | 'Education' | 'Shopping' | 'Entertainment' | 'Hostel' | 'Other'>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState<string>(contextGroupId || groups[0]?.id || '');
  const [paidBy, setPaidBy] = useState<string>(currentUser?.id || '');
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('equal');

  // Selected participants for manual split
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(
    allUsers.slice(0, 4).map((u) => u.id)
  );

  // Split details: percentages or exact amounts
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const [exactAmounts, setExactAmounts] = useState<Record<string, number>>({});

  // Custom line items for manual item-based split
  const [manualItems, setManualItems] = useState<ExpenseItem[]>([
    { id: 'item_1', name: 'Item 1', quantity: 1, unitPrice: 0, totalPrice: 0, assignedUserIds: [currentUser?.id || ''] }
  ]);

  if (!isAddExpenseModalOpen) return null;

  // Toggle user participant
  const toggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      if (selectedUserIds.length <= 1) {
        showToast('At least one participant required', 'error');
        return;
      }
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  // Handle OCR Completion
  const handleOCRComplete = async (data: any) => {
    try {
      const saved = await addExpense({
        ...data,
        source: 'ocr'
      });
      if (saved) {
        await refreshAllData();
        closeAddExpenseModal();
      }
    } catch (err) {
      showToast('Error saving OCR expense', 'error');
    }
  };

  // Handle Manual Save
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!title.trim()) {
      showToast('Please enter an expense title', 'error');
      return;
    }
    if (!numAmount || numAmount <= 0) {
      showToast('Please enter a valid expense amount', 'error');
      return;
    }

    // Build participants array based on splitMethod
    let participantsPayload: any[] = [];

    if (splitMethod === 'equal') {
      const perHead = Math.round((numAmount / selectedUserIds.length) * 100) / 100;
      participantsPayload = selectedUserIds.map((uId) => ({
        userId: uId,
        shareAmount: perHead
      }));
    } else if (splitMethod === 'percentage') {
      let totalPct = 0;
      selectedUserIds.forEach((uId) => (totalPct += percentages[uId] || 0));
      if (Math.abs(totalPct - 100) > 1) {
        showToast(`Percentages must add up to 100% (currently ${totalPct}%)`, 'error');
        return;
      }
      participantsPayload = selectedUserIds.map((uId) => ({
        userId: uId,
        percentage: percentages[uId] || 0,
        shareAmount: Math.round((numAmount * ((percentages[uId] || 0) / 100)) * 100) / 100
      }));
    } else if (splitMethod === 'exact') {
      let totalExact = 0;
      selectedUserIds.forEach((uId) => (totalExact += exactAmounts[uId] || 0));
      if (Math.abs(totalExact - numAmount) > 1) {
        showToast(`Exact amounts sum (₹${totalExact}) must match total amount (₹${numAmount})`, 'error');
        return;
      }
      participantsPayload = selectedUserIds.map((uId) => ({
        userId: uId,
        exactAmount: exactAmounts[uId] || 0,
        shareAmount: exactAmounts[uId] || 0
      }));
    } else if (splitMethod === 'item_based') {
      participantsPayload = selectedUserIds.map((uId) => ({
        userId: uId
      }));
    }

    try {
      const saved = await addExpense({
        title,
        amount: numAmount,
        category,
        date,
        description,
        groupId: groupId || undefined,
        paidBy: paidBy || currentUser?.id,
        source: 'manual',
        splitMethod,
        items: splitMethod === 'item_based' ? manualItems : undefined,
        participants: participantsPayload
      });

      if (saved) {
        await refreshAllData();
        closeAddExpenseModal();
      }
    } catch (err) {
      showToast('Error saving expense', 'error');
    }
  };


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                id="tab-manual-expense-btn"
                onClick={() => setMode('manual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'manual'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>✍️ Add Manually</span>
              </button>

              <button
                type="button"
                id="tab-ocr-expense-btn"
                onClick={() => setMode('ocr')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'ocr'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-indigo-600" />
                <span>📷 Scan Receipt (AI OCR)</span>
              </button>
            </div>
          </div>

          <button
            onClick={closeAddExpenseModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {mode === 'ocr' ? (
            <OCRScanner
              defaultGroupId={groupId}
              onComplete={handleOCRComplete}
              onCancel={closeAddExpenseModal}
            />
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              {/* Core Details (Title, Amount, Category) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Expense Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Canteen Lunch, Domino's Pizza, Xerox"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Total Amount (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Group, Category, Date, Paid By */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Group
                  </label>
                  <select
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="">Personal Expense (No Group)</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Food">🍕 Food & Canteen</option>
                    <option value="Transport">🚗 Travel & Transport</option>
                    <option value="Education">📚 Education & Xerox</option>
                    <option value="Shopping">🛍️ Shopping</option>
                    <option value="Entertainment">🎬 Entertainment & Movies</option>
                    <option value="Hostel">🏠 Hostel & Groceries</option>
                    <option value="Other">✨ Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Paid By
                  </label>
                  <select
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} {u.id === currentUser?.id ? '(You)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Split Method Tabs */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Select Split Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'equal', label: 'Equal Split', desc: '₹1,000 / 4 = ₹250 each' },
                    { id: 'percentage', label: 'Percentage %', desc: '40% / 30% / 30%' },
                    { id: 'exact', label: 'Exact Amount', desc: '₹500 / ₹300 / ₹200' },
                    { id: 'item_based', label: 'Item-Based', desc: 'Line item assignment' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSplitMethod(s.id as SplitMethod)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        splitMethod === s.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs">{s.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Participants Selector & Method Customization */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Participants Involved ({selectedUserIds.length})
                  </span>
                  <span className="text-[11px] text-slate-400">Click avatar to include/exclude</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {allUsers.map((u) => {
                    const isSelected = selectedUserIds.includes(u.id);
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => toggleUser(u.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/40'
                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <img src={u.avatarUrl} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                        <span>{u.name.split(' ')[0]}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>

                {/* Percentage Inputs */}
                {splitMethod === 'percentage' && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Set Percentages</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedUserIds.map((uId) => {
                        const u = allUsers.find((user) => user.id === uId);
                        return (
                          <div key={uId} className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate flex-1">{u?.name?.split(' ')[0]}</span>
                            <input
                              type="number"
                              placeholder="%"
                              value={percentages[uId] || ''}
                              onChange={(e) => setPercentages({ ...percentages, [uId]: Number(e.target.value) })}
                              className="w-14 px-2 py-1 text-xs text-right rounded-lg bg-slate-100 dark:bg-slate-800 border font-mono font-bold"
                            />
                            <span className="text-xs text-slate-400">%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Exact Amount Inputs */}
                {splitMethod === 'exact' && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Set Exact Amounts (₹)</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedUserIds.map((uId) => {
                        const u = allUsers.find((user) => user.id === uId);
                        return (
                          <div key={uId} className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate flex-1">{u?.name?.split(' ')[0]}</span>
                            <span className="text-xs text-slate-400">₹</span>
                            <input
                              type="number"
                              placeholder="0"
                              value={exactAmounts[uId] || ''}
                              onChange={(e) => setExactAmounts({ ...exactAmounts, [uId]: Number(e.target.value) })}
                              className="w-20 px-2 py-1 text-xs text-right rounded-lg bg-slate-100 dark:bg-slate-800 border font-mono font-bold"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeAddExpenseModal}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="submit-manual-expense-btn"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Expense</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
