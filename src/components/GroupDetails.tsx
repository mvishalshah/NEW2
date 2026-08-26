import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { Group, Expense, DebtEdge, GroupActivity, GroupMember } from '../types.js';
import { calculateDebtsClient } from '../data/mockData.js';
import {
  isSupabaseConfigured,
  fetchGroupsFromSupabase,
  fetchExpensesFromSupabase,
  fetchGroupMembersFromSupabase
} from '../lib/supabase.js';
import {
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  Share2,
  Users,
  Receipt,
  HeartHandshake,
  Send,
  Plus,
  Calendar,
  Sparkles,
  ShieldCheck,
  Activity,
  Trash2
} from 'lucide-react';

interface GroupDetailsProps {
  groupId: string;
}

export const GroupDetails: React.FC<GroupDetailsProps> = ({ groupId }) => {
  const {
    currentUser,
    allUsers,
    groups,
    setActiveView,
    openAddExpenseModal,
    openMoneyExchange,
    openReminderModal,
    showToast,
    refreshAllData,
    deleteExpense
  } = useApp();

  const [groupData, setGroupData] = useState<any | null>(null);
  const [debts, setDebts] = useState<DebtEdge[]>([]);
  const [activeTab, setActiveTab] = useState<'expenses' | 'debts' | 'members' | 'activity'>('expenses');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroupDetails = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const [sbGroups, sbExpenses, sbMembers] = await Promise.all([
          fetchGroupsFromSupabase(),
          fetchExpensesFromSupabase(undefined, groupId),
          fetchGroupMembersFromSupabase(groupId)
        ]);

        const matched = sbGroups.find((g) => g.id === groupId);
        if (matched) {
          const membersWithUsers = sbMembers.length > 0
            ? sbMembers.map((m) => ({
                ...m,
                user: allUsers.find((u) => u.id === m.userId) || (currentUser?.id === m.userId ? currentUser : {
                  id: m.userId,
                  name: `Member ${m.userId.substring(0, 5)}`,
                  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
                })
              }))
            : [
                {
                  id: `gm_${matched.id}_${matched.ownerId}`,
                  groupId: matched.id,
                  userId: matched.ownerId,
                  role: 'owner',
                  status: 'active',
                  joinedAt: matched.createdAt,
                  user: allUsers.find((u) => u.id === matched.ownerId) || (currentUser?.id === matched.ownerId ? currentUser : undefined)
                }
              ];

          const groupExpenses = sbExpenses.filter((e) => e.groupId === groupId);
          const debtsCalculated = calculateDebtsClient(groupExpenses, [
            ...allUsers,
            ...(currentUser ? [currentUser] : [])
          ]);

          setGroupData({
            ...matched,
            members: membersWithUsers,
            expenses: groupExpenses,
            activities: []
          });
          setDebts(debtsCalculated);
          setIsLoading(false);
          return;
        }
      }

      const res = await fetch(`/api/groups/${groupId}`);
      const data = await res.json();
      if (data.group) {
        setGroupData(data.group);
        setDebts(data.debts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const handleCopyCode = () => {
    if (groupData?.groupCode) {
      navigator.clipboard.writeText(groupData.groupCode);
      setCopiedCode(true);
      showToast(`Group Code ${groupData.groupCode} copied to clipboard! 📋`, 'success');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleRegenerateCode = async () => {
    try {
      const res = await fetch(`/api/groups/${groupId}/code/regenerate`, { method: 'POST' });
      const json = await res.json();
      if (json.success && json.code) {
        setGroupData((prev: any) => ({ ...prev, groupCode: json.code }));
        showToast(`New group code generated: ${json.code}`, 'success');
      } else {
        showToast(json.error || 'Only group owner can regenerate code', 'error');
      }
    } catch (err) {
      showToast('Failed to regenerate group code', 'error');
    }
  };

  if (isLoading || !groupData) {
    return (
      <div className="py-20 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
        <p className="text-xs text-slate-500 mt-2">Loading group details...</p>
      </div>
    );
  }

  // Calculate my balance in this group
  const userMember = groupData.members?.find((m: any) => m.userId === currentUser?.id);
  const myBalance = userMember?.balance || 0;
  const isOwner = groupData.ownerId === currentUser?.id;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('groups')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Groups</span>
        </button>

        <button
          onClick={() => openAddExpenseModal('manual', groupData.id)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-100 dark:shadow-none transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Group Expense</span>
        </button>
      </div>

      {/* Group Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white border border-slate-800 shadow-xl">
        <div className="absolute inset-0 opacity-40">
          <img
            src={groupData.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200'}
            alt={groupData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-8 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {groupData.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-white/10 text-slate-200">
                {groupData.institution || 'College Campus'}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-white/10 text-slate-200 capitalize">
                {groupData.privacy}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{groupData.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl line-clamp-2">
              {groupData.description || 'Student group for sharing mess, canteen, outings, and project expenses.'}
            </p>

            <div className="flex items-center gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>{groupData.members?.length || 0} Members</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-indigo-400" />
                <span>{groupData.expenses?.length || 0} Expenses</span>
              </span>
            </div>
          </div>

          {/* Group Code Card & Net Balance */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white/10 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/15">
            {/* Join Code with Copy & Regenerate */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 block">
                Unique Group Code
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-base sm:text-lg font-bold tracking-wider text-white">
                  {groupData.groupCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                  title="Copy Group Code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                {isOwner && (
                  <button
                    onClick={handleRegenerateCode}
                    className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                    title="Regenerate Group Code (Admin)"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="sm:border-l sm:border-white/20 sm:pl-4 pt-2 sm:pt-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
                Your Net Balance
              </span>
              <div className="mt-1">
                {myBalance > 0 ? (
                  <span className="text-base font-bold text-emerald-400">+₹{myBalance.toLocaleString('en-IN')}</span>
                ) : myBalance < 0 ? (
                  <span className="text-base font-bold text-red-400">-₹{Math.abs(myBalance).toLocaleString('en-IN')}</span>
                ) : (
                  <span className="text-sm font-bold text-slate-300">All Settled ✓</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Group Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'expenses', label: 'Expenses', icon: Receipt, count: groupData.expenses?.length },
          { id: 'debts', label: 'Simplified Debts', icon: HeartHandshake, count: debts.length },
          { id: 'members', label: 'Members', icon: Users, count: groupData.members?.length },
          { id: 'activity', label: 'Social Feed', icon: Activity, count: groupData.activities?.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-indigo-800 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Expenses */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Group Expense Ledger</h3>
            <span className="text-xs text-slate-500">
              Total Spent: ₹{groupData.expenses?.reduce((sum: number, e: any) => sum + e.amount, 0).toLocaleString('en-IN')}
            </span>
          </div>

          {(!groupData.expenses || groupData.expenses.length === 0) ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No expenses recorded yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Scan your mess, pizza, or project invoice with AI OCR to split it automatically.
              </p>
              <button
                onClick={() => openAddExpenseModal('ocr', groupData.id)}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
              >
                Scan First Receipt
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {(groupData.expenses || []).map((exp: Expense) => {
                const payer = allUsers.find((u) => u.id === exp.paidBy);
                const userPart = (exp.participants || []).find((p) => p.userId === currentUser?.id);
                const isPayer = exp.paidBy === currentUser?.id;

                return (
                  <div key={exp.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                        {exp.category[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{exp.title}</h4>
                          {exp.source === 'ocr' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                              📷 AI OCR
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Paid by <span className="font-semibold text-slate-700 dark:text-slate-300">{payer?.name || 'Someone'}</span> • {new Date(exp.date).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {exp.splitMethod} split
                        </p>

                        {/* List items preview if item based */}
                        {exp.items && exp.items.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {exp.items.map((it) => (
                              <span key={it.id} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                                {it.name} (₹{it.totalPrice})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="text-right">
                        <div className="text-base font-bold text-slate-900 dark:text-white">
                          ₹{exp.amount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs font-medium mt-0.5">
                          {isPayer ? (
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">You paid</span>
                          ) : userPart ? (
                            <span className="text-red-500 font-semibold">Your share: ₹{userPart.shareAmount}</span>
                          ) : (
                            <span className="text-slate-400">Not involved</span>
                          )}
                        </div>
                      </div>

                      {/* Delete button if creator or payer */}
                      {(isPayer || exp.createdBy === currentUser?.id) && (
                        <button
                          onClick={async () => {
                            if (window.confirm('Delete this expense?')) {
                              await deleteExpense(exp.id);
                              fetchGroupDetails();
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Simplified Debts & Honesty Settle */}
      {activeTab === 'debts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Smart Debt Simplification</h3>
              <p className="text-xs text-slate-500">
                Minimizes total transactions between group members using greedy graph simplification.
              </p>
            </div>
          </div>

          {debts.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">All debts are settled! 🎉</h4>
              <p className="text-xs text-slate-400 mt-1">No pending payments in this group.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {debts.map((d, idx) => {
                const isMePayer = d.fromUserId === currentUser?.id;
                const isMeReceiver = d.toUserId === currentUser?.id;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      isMePayer
                        ? 'bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-900'
                        : isMeReceiver
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <img src={d.fromUser?.avatarUrl} alt={d.fromUser?.name} className="w-7 h-7 rounded-full object-cover" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{d.fromUser?.name?.split(' ')[0]}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-400">owes</span>
                      <div className="flex items-center gap-2">
                        <img src={d.toUser?.avatarUrl} alt={d.toUser?.name} className="w-7 h-7 rounded-full object-cover" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{d.toUser?.name?.split(' ')[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                        ₹{d.amount.toLocaleString('en-IN')}
                      </span>

                      {isMePayer && d.toUser && (
                        <button
                          onClick={() =>
                            openMoneyExchange({
                              recipientUser: d.toUser!,
                              amount: d.amount,
                              groupId: groupData.id,
                              note: `Money exchange settlement for ${groupData.name}`
                            })
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                        >
                          <HeartHandshake className="w-3.5 h-3.5" />
                          <span>Exchange & Agree</span>
                        </button>
                      )}

                      {isMeReceiver && d.fromUser && (
                        <button
                          onClick={() =>
                            openReminderModal({
                              receiverUser: d.fromUser!,
                              amount: d.amount,
                              groupId: groupData.id
                            })
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Honesty Reminder</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Members */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {groupData.members?.map((m: any) => {
              const u = allUsers.find((user) => user.id === m.userId);
              return (
                <div key={m.userId} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={u?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={u?.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{u?.name}</h4>
                        {m.role === 'admin' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                            Admin
                          </span>
                        )}
                        {m.userId === currentUser?.id && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-mono">
                        @{u?.username || 'member'} • {u?.institution || 'Student'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Group Balance</span>
                    {m.balance > 0 ? (
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+₹{m.balance}</span>
                    ) : m.balance < 0 ? (
                      <span className="text-sm font-bold text-red-500">-₹{Math.abs(m.balance)}</span>
                    ) : (
                      <span className="text-xs text-slate-400">Settled</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Social Activity Feed */}
      {activeTab === 'activity' && (
        <div className="space-y-3">
          {(!groupData.activities || groupData.activities.length === 0) ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              No activity logged yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {(groupData.activities || []).map((act: GroupActivity) => {
                const actUser = allUsers.find((u) => u.id === act.userId);
                return (
                  <div key={act.id} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                    <img src={actUser?.avatarUrl} alt={actUser?.name} className="w-8 h-8 rounded-lg object-cover mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {actUser?.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{act.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
