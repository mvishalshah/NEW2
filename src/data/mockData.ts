import {
  User,
  Group,
  GroupMember,
  Expense,
  Settlement,
  AppNotification,
  GroupActivity,
  UserFinancialSummary,
  DebtEdge,
  OCRReceiptResult
} from '../types.js';

export const initialUsers: User[] = [
  {
    id: 'user_rahul',
    googleId: 'google_1001',
    name: 'Rahul Sharma',
    username: 'rahul_tech',
    email: 'rahul.sharma@example.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    institution: 'Delhi Technological University',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    city: 'New Delhi',
    bio: 'Coding by night, splitting bills by day. Always ready for midnight Maggi!',
    honestyScore: 99,
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'user_priya',
    googleId: 'google_1002',
    name: 'Priya Patel',
    username: 'priya_p',
    email: 'priya.patel@example.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    institution: 'Delhi Technological University',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    city: 'New Delhi',
    bio: 'Design enthusiast & coffee addict ☕',
    honestyScore: 100,
    createdAt: '2026-01-12T11:30:00.000Z',
  },
  {
    id: 'user_aman',
    googleId: 'google_1003',
    name: 'Aman Verma',
    username: 'aman_v',
    email: 'aman.v@example.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    institution: 'Delhi Technological University',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    city: 'New Delhi',
    bio: 'Hostel 204 champion gamer 🎮',
    honestyScore: 98,
    createdAt: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'user_neha',
    googleId: 'google_1004',
    name: 'Neha Gupta',
    username: 'neha_g',
    email: 'neha.gupta@example.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    institution: 'Delhi Technological University',
    course: 'B.Tech IT',
    year: '3rd Year',
    city: 'New Delhi',
    bio: 'Event coordinator & food explorer',
    honestyScore: 100,
    createdAt: '2026-01-18T14:20:00.000Z',
  },
  {
    id: 'user_rohan',
    googleId: 'google_1005',
    name: 'Rohan Mehra',
    username: 'rohan_m',
    email: 'rohan.mehra@example.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    institution: 'Delhi Technological University',
    course: 'B.Tech Mechanical',
    year: '3rd Year',
    city: 'New Delhi',
    bio: 'Robotics club captain 🤖',
    honestyScore: 97,
    createdAt: '2026-01-20T16:45:00.000Z',
  },
  {
    id: 'user_sneha',
    googleId: 'google_1006',
    name: 'Sneha Rao',
    username: 'sneha_r',
    email: 'sneha.rao@example.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    institution: 'Delhi University (South Campus)',
    course: 'B.Sc Economics',
    year: '2nd Year',
    city: 'New Delhi',
    bio: 'Finance geek & debater',
    honestyScore: 100,
    createdAt: '2026-02-01T12:00:00.000Z',
  }
];

export const initialGroups: Group[] = [
  {
    id: 'grp_cse_3rd',
    name: '🎓 CSE 3rd Year (Batch 2026)',
    description: 'Official batch splitting group for notes, xerox, lab kits, and hackathons.',
    groupCode: 'CSE3X8K2',
    category: 'college',
    institution: 'Delhi Technological University',
    city: 'New Delhi',
    privacy: 'public',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80',
    ownerId: 'user_rahul',
    createdAt: '2026-01-15T10:00:00.000Z',
    memberCount: 5,
  },
  {
    id: 'grp_hostel_204',
    name: '🏠 Hostel Room 204 & Block A',
    description: 'Night snacks, Wi-Fi router recharge, room groceries and Maggi bills.',
    groupCode: 'HSTL204A',
    category: 'hostel',
    institution: 'Delhi Technological University',
    city: 'New Delhi',
    privacy: 'private',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&auto=format&fit=crop&q=80',
    ownerId: 'user_aman',
    createdAt: '2026-01-20T12:00:00.000Z',
    memberCount: 4,
  },
  {
    id: 'grp_delhi_coaching',
    name: '📚 Delhi Coaching Batch A',
    description: 'GATE & GRE test series sharing, study material xerox, and canteen snacks.',
    groupCode: 'DELCOACH1',
    category: 'coaching',
    institution: 'Made Easy Delhi Center',
    city: 'New Delhi',
    privacy: 'public',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=80',
    ownerId: 'user_priya',
    createdAt: '2026-02-01T15:00:00.000Z',
    memberCount: 4,
  },
  {
    id: 'grp_goa_trip',
    name: '🚗 Goa Trip 2026',
    description: 'Self-drive rental, beach shacks, resort booking & water sports split!',
    groupCode: 'GOATRIP26',
    category: 'trip',
    institution: 'Delhi Technological University',
    city: 'Goa',
    privacy: 'private',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&auto=format&fit=crop&q=80',
    ownerId: 'user_rahul',
    createdAt: '2026-02-10T18:00:00.000Z',
    memberCount: 4,
  },
  {
    id: 'grp_project_alpha',
    name: '💻 Project Team Alpha - AI Bot',
    description: 'Cloud hosting servers, Arduino sensors, 3D printing & hardware expense.',
    groupCode: 'ALPHA26',
    category: 'project',
    institution: 'Delhi Technological University',
    city: 'New Delhi',
    privacy: 'public',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&auto=format&fit=crop&q=80',
    ownerId: 'user_neha',
    createdAt: '2026-02-14T09:30:00.000Z',
    memberCount: 3,
  }
];

export const initialGroupMembers: GroupMember[] = [
  { id: 'gm_1', groupId: 'grp_cse_3rd', userId: 'user_rahul', role: 'owner', status: 'active', joinedAt: '2026-01-15T10:00:00.000Z' },
  { id: 'gm_2', groupId: 'grp_cse_3rd', userId: 'user_priya', role: 'admin', status: 'active', joinedAt: '2026-01-15T10:05:00.000Z' },
  { id: 'gm_3', groupId: 'grp_cse_3rd', userId: 'user_aman', role: 'member', status: 'active', joinedAt: '2026-01-15T11:00:00.000Z' },
  { id: 'gm_4', groupId: 'grp_cse_3rd', userId: 'user_neha', role: 'member', status: 'active', joinedAt: '2026-01-16T09:15:00.000Z' },
  { id: 'gm_5', groupId: 'grp_cse_3rd', userId: 'user_rohan', role: 'member', status: 'active', joinedAt: '2026-01-18T14:30:00.000Z' },

  { id: 'gm_6', groupId: 'grp_hostel_204', userId: 'user_aman', role: 'owner', status: 'active', joinedAt: '2026-01-20T12:00:00.000Z' },
  { id: 'gm_7', groupId: 'grp_hostel_204', userId: 'user_rahul', role: 'admin', status: 'active', joinedAt: '2026-01-20T12:10:00.000Z' },
  { id: 'gm_8', groupId: 'grp_hostel_204', userId: 'user_rohan', role: 'member', status: 'active', joinedAt: '2026-01-20T12:15:00.000Z' },
  { id: 'gm_9', groupId: 'grp_hostel_204', userId: 'user_priya', role: 'member', status: 'active', joinedAt: '2026-01-21T18:00:00.000Z' },

  { id: 'gm_10', groupId: 'grp_delhi_coaching', userId: 'user_priya', role: 'owner', status: 'active', joinedAt: '2026-02-01T15:00:00.000Z' },
  { id: 'gm_11', groupId: 'grp_delhi_coaching', userId: 'user_rahul', role: 'member', status: 'active', joinedAt: '2026-02-01T15:10:00.000Z' },
  { id: 'gm_12', groupId: 'grp_delhi_coaching', userId: 'user_sneha', role: 'member', status: 'active', joinedAt: '2026-02-02T10:00:00.000Z' },
  { id: 'gm_13', groupId: 'grp_delhi_coaching', userId: 'user_neha', role: 'member', status: 'active', joinedAt: '2026-02-03T16:20:00.000Z' },

  { id: 'gm_14', groupId: 'grp_goa_trip', userId: 'user_rahul', role: 'owner', status: 'active', joinedAt: '2026-02-10T18:00:00.000Z' },
  { id: 'gm_15', groupId: 'grp_goa_trip', userId: 'user_priya', role: 'admin', status: 'active', joinedAt: '2026-02-10T18:05:00.000Z' },
  { id: 'gm_16', groupId: 'grp_goa_trip', userId: 'user_aman', role: 'member', status: 'active', joinedAt: '2026-02-10T18:20:00.000Z' },
  { id: 'gm_17', groupId: 'grp_goa_trip', userId: 'user_neha', role: 'member', status: 'active', joinedAt: '2026-02-10T19:00:00.000Z' },

  { id: 'gm_18', groupId: 'grp_project_alpha', userId: 'user_neha', role: 'owner', status: 'active', joinedAt: '2026-02-14T09:30:00.000Z' },
  { id: 'gm_19', groupId: 'grp_project_alpha', userId: 'user_rahul', role: 'member', status: 'active', joinedAt: '2026-02-14T09:35:00.000Z' },
  { id: 'gm_20', groupId: 'grp_project_alpha', userId: 'user_aman', role: 'member', status: 'active', joinedAt: '2026-02-14T09:40:00.000Z' }
];

export const initialExpenses: Expense[] = [];

export const initialSettlements: Settlement[] = [];

export const initialNotifications: AppNotification[] = [];

// Calculation Helpers for client-side execution when offline / on GitHub Pages
export function calculateDebtsClient(expenses: Expense[] = [], settlements: Settlement[] = [], groupId?: string): DebtEdge[] {
  const netBalances: Record<string, number> = {};

  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeSettlements = Array.isArray(settlements) ? settlements : [];

  const filteredExpenses = groupId ? safeExpenses.filter((e) => e && e.groupId === groupId) : safeExpenses;
  const filteredSettlements = groupId
    ? safeSettlements.filter((s) => s && s.groupId === groupId && s.status === 'completed')
    : safeSettlements.filter((s) => s && s.status === 'completed');

  filteredExpenses.forEach((exp) => {
    if (!exp) return;
    const paidBy = exp.paidBy;
    const total = exp.amount || 0;
    netBalances[paidBy] = (netBalances[paidBy] || 0) + total;

    (exp.participants || []).forEach((part) => {
      if (!part) return;
      netBalances[part.userId] = (netBalances[part.userId] || 0) - (part.shareAmount || 0);
    });
  });

  filteredSettlements.forEach((set) => {
    if (!set) return;
    netBalances[set.fromUserId] = (netBalances[set.fromUserId] || 0) + (set.amount || 0);
    netBalances[set.toUserId] = (netBalances[set.toUserId] || 0) - (set.amount || 0);
  });

  const debtors: Array<{ userId: string; amount: number }> = [];
  const creditors: Array<{ userId: string; amount: number }> = [];

  Object.entries(netBalances).forEach(([userId, balance]) => {
    const rounded = Math.round((balance || 0) * 100) / 100;
    if (rounded < -0.5) {
      debtors.push({ userId, amount: -rounded });
    } else if (rounded > 0.5) {
      creditors.push({ userId, amount: rounded });
    }
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const debts: DebtEdge[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const settleAmount = Math.min(debtor.amount, creditor.amount);
    if (settleAmount > 0.5) {
      debts.push({
        fromUserId: debtor.userId,
        toUserId: creditor.userId,
        amount: Math.round(settleAmount)
      });
    }

    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;

    if (debtor.amount < 0.5) dIdx++;
    if (creditor.amount < 0.5) cIdx++;
  }

  return debts;
}

export function calculateFinancialSummaryClient(
  userId: string,
  expenses: Expense[] = [],
  settlements: Settlement[] = []
): UserFinancialSummary {
  let totalSpending = 0;
  let youPaid = 0;
  let youAreOwed = 0;
  let youOwe = 0;
  const categoryMap: Record<string, number> = {};

  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeSettlements = Array.isArray(settlements) ? settlements : [];

  const debts = calculateDebtsClient(safeExpenses, safeSettlements);

  (debts || []).forEach((d) => {
    if (!d) return;
    if (d.fromUserId === userId) {
      youOwe += (d.amount || 0);
    }
    if (d.toUserId === userId) {
      youAreOwed += (d.amount || 0);
    }
  });

  safeExpenses.forEach((e) => {
    if (!e) return;
    if (e.paidBy === userId) {
      youPaid += (e.amount || 0);
    }
    const part = (e.participants || []).find((p) => p && p.userId === userId);
    if (part) {
      totalSpending += (part.shareAmount || 0);
      const cat = e.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + (part.shareAmount || 0);
    }
  });

  const categoryBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0
  }));

  return {
    totalSpending: Math.round(totalSpending),
    youPaid: Math.round(youPaid),
    youOwe: Math.round(youOwe),
    youAreOwed: Math.round(youAreOwed),
    todaySpending: Math.round(totalSpending * 0.15),
    weekSpending: Math.round(totalSpending * 0.45),
    monthSpending: Math.round(totalSpending),
    categoryBreakdown,
    monthlyTrends: [
      { month: 'Dec', amount: 3200 },
      { month: 'Jan', amount: 4800 },
      { month: 'Feb', amount: Math.round(totalSpending) }
    ]
  };
}

// Sample OCR Receipts for 1-Click extraction on Client/Offline
export const SAMPLE_CLIENT_RECEIPTS: Record<string, OCRReceiptResult> = {
  cafe: {
    merchantName: 'Campus Bistro & Cafe',
    date: '2026-02-25',
    receiptNumber: 'CB-9482',
    subtotal: 820,
    tax: 41,
    discount: 0,
    serviceCharge: 0,
    total: 861,
    confidenceOverall: 'high',
    items: [
      { id: 'it_1', name: 'Veg Grilled Club Sandwich', quantity: 2, unitPrice: 180, totalPrice: 360, confidence: 'high', assignedUserIds: ['user_rahul'] },
      { id: 'it_2', name: 'Crispy Peri Peri French Fries', quantity: 1, unitPrice: 160, totalPrice: 160, confidence: 'high', assignedUserIds: ['user_rahul'] },
      { id: 'it_3', name: 'Cold Hazelnut Frappe', quantity: 2, unitPrice: 150, totalPrice: 300, confidence: 'high', assignedUserIds: ['user_rahul'] }
    ]
  },
  groceries: {
    merchantName: 'Hostel Supermarket',
    date: '2026-02-24',
    receiptNumber: 'HSM-4421',
    subtotal: 1350,
    tax: 0,
    discount: 30,
    serviceCharge: 0,
    total: 1320,
    confidenceOverall: 'high',
    items: [
      { id: 'it_1', name: 'Maggi 2-Minute Noodles Family Pack (12x)', quantity: 2, unitPrice: 160, totalPrice: 320, confidence: 'high', assignedUserIds: ['user_rahul'] },
      { id: 'it_2', name: 'Amul Taaza Milk Tetra Pack 1L', quantity: 4, unitPrice: 75, totalPrice: 300, confidence: 'high', assignedUserIds: ['user_rahul'] },
      { id: 'it_3', name: 'Haldiram Bhujia & Aloo Bhujia 400g', quantity: 2, unitPrice: 125, totalPrice: 250, confidence: 'high', assignedUserIds: ['user_rahul'] },
      { id: 'it_4', name: 'Odonil Room Freshener Spray 220ml', quantity: 1, unitPrice: 200, totalPrice: 200, confidence: 'high', assignedUserIds: ['user_rahul'] },
      { id: 'it_5', name: 'Nescafe Classic Instant Coffee Jar 100g', quantity: 1, unitPrice: 280, totalPrice: 280, confidence: 'high', assignedUserIds: ['user_rahul'] }
    ]
  },
  stationery: {
    merchantName: 'Balaji Xerox & Books Store',
    date: '2026-02-23',
    receiptNumber: 'BJB-1089',
    subtotal: 1300,
    tax: 0,
    discount: 0,
    serviceCharge: 0,
    total: 1300,
    confidenceOverall: 'high',
    items: [
      { id: 'it_1', name: 'Operating Systems & DBMS Spiral Notes (x5)', quantity: 5, unitPrice: 150, totalPrice: 750, confidence: 'high', assignedUserIds: ['user_rahul'] },
      { id: 'it_2', name: 'Engineering Lab Manual Hardcover Record', quantity: 3, unitPrice: 110, totalPrice: 330, confidence: 'high', assignedUserIds: ['user_rahul'] },
      { id: 'it_3', name: 'A4 Printing Paper Ream (500 sheets)', quantity: 1, unitPrice: 220, totalPrice: 220, confidence: 'high', assignedUserIds: ['user_rahul'] }
    ]
  }
};
