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
    upiId: 'rahul.sharma@okaxis',
    bio: 'Coding by night, splitting bills by day. Always ready for midnight Maggi!',
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
    upiId: 'priya.patel@okhdfcbank',
    bio: 'Design enthusiast & coffee addict ☕',
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
    upiId: 'aman.v@paytm',
    bio: 'Hostel 204 champion gamer 🎮',
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
    upiId: 'neha.gupta@ybl',
    bio: 'Event coordinator & food explorer',
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
    upiId: 'rohan.mehra@icici',
    bio: 'Robotics club captain 🤖',
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
    upiId: 'sneha.rao@upi',
    bio: 'Finance geek & debater',
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

export const initialExpenses: Expense[] = [
  {
    id: 'exp_1',
    groupId: 'grp_cse_3rd',
    groupName: '🎓 CSE 3rd Year (Batch 2026)',
    title: 'Pizza & Garlic Bread Treat @ Domino’s',
    description: 'Post-hackathon celebration dinner bill',
    amount: 1155,
    category: 'Food',
    date: '2026-02-20',
    paidBy: 'user_rahul',
    createdBy: 'user_rahul',
    source: 'ocr',
    splitMethod: 'item_based',
    items: [
      { id: 'it_1', name: 'Farmhouse Pizza Large', quantity: 1, unitPrice: 600, totalPrice: 600, assignedUserIds: ['user_rahul', 'user_aman'] },
      { id: 'it_2', name: 'Stuffed Garlic Bread & Dip', quantity: 1, unitPrice: 300, totalPrice: 300, assignedUserIds: ['user_priya'] },
      { id: 'it_3', name: 'Cold Drinks 750ml (x2)', quantity: 2, unitPrice: 100, totalPrice: 200, assignedUserIds: ['user_rahul', 'user_priya', 'user_aman'] },
      { id: 'it_4', name: 'GST & Service Charge (5%)', quantity: 1, unitPrice: 55, totalPrice: 55, assignedUserIds: ['user_rahul', 'user_priya', 'user_aman'] }
    ],
    participants: [
      { userId: 'user_rahul', shareAmount: 385, isPaid: true },
      { userId: 'user_aman', shareAmount: 385, isPaid: false },
      { userId: 'user_priya', shareAmount: 385, isPaid: false }
    ],
    createdAt: '2026-02-20T19:30:00.000Z'
  },
  {
    id: 'exp_2',
    groupId: 'grp_cse_3rd',
    groupName: '🎓 CSE 3rd Year (Batch 2026)',
    title: 'Operating Systems Xerox & Lab Manuals',
    description: 'Spiral bound xerox copies for batch',
    amount: 850,
    category: 'Education',
    date: '2026-02-22',
    paidBy: 'user_priya',
    createdBy: 'user_priya',
    source: 'manual',
    splitMethod: 'equal',
    participants: [
      { userId: 'user_rahul', shareAmount: 170, isPaid: false },
      { userId: 'user_priya', shareAmount: 170, isPaid: true },
      { userId: 'user_aman', shareAmount: 170, isPaid: false },
      { userId: 'user_neha', shareAmount: 170, isPaid: false },
      { userId: 'user_rohan', shareAmount: 170, isPaid: false }
    ],
    createdAt: '2026-02-22T11:15:00.000Z'
  },
  {
    id: 'exp_3',
    groupId: 'grp_hostel_204',
    groupName: '🏠 Hostel Room 204 & Block A',
    title: 'Midnight Grocery & Maggi Packet Box',
    description: 'Bulk buy from Supermarket for night study sessions',
    amount: 1420,
    category: 'Hostel',
    date: '2026-02-23',
    paidBy: 'user_aman',
    createdBy: 'user_aman',
    source: 'ocr',
    splitMethod: 'equal',
    participants: [
      { userId: 'user_aman', shareAmount: 355, isPaid: true },
      { userId: 'user_rahul', shareAmount: 355, isPaid: false },
      { userId: 'user_rohan', shareAmount: 355, isPaid: false },
      { userId: 'user_priya', shareAmount: 355, isPaid: false }
    ],
    createdAt: '2026-02-23T23:45:00.000Z'
  },
  {
    id: 'exp_4',
    groupId: 'grp_project_alpha',
    groupName: '💻 Project Team Alpha - AI Bot',
    title: 'Cloud GPU Server & Domain Registration',
    description: 'Runpod GPU hours and domain name for college evaluation',
    amount: 1800,
    category: 'Education',
    date: '2026-02-24',
    paidBy: 'user_rahul',
    createdBy: 'user_rahul',
    source: 'manual',
    splitMethod: 'percentage',
    participants: [
      { userId: 'user_rahul', shareAmount: 600, percentage: 33.33, isPaid: true },
      { userId: 'user_neha', shareAmount: 600, percentage: 33.33, isPaid: false },
      { userId: 'user_aman', shareAmount: 600, percentage: 33.34, isPaid: false }
    ],
    createdAt: '2026-02-24T14:10:00.000Z'
  },
  {
    id: 'exp_5',
    groupId: 'grp_cse_3rd',
    groupName: '🎓 CSE 3rd Year (Batch 2026)',
    title: 'Campus Canteen Chai & Samosa Break',
    description: 'Evening tea with team after classes',
    amount: 320,
    category: 'Food',
    date: '2026-02-25',
    paidBy: 'user_rahul',
    createdBy: 'user_rahul',
    source: 'manual',
    splitMethod: 'equal',
    participants: [
      { userId: 'user_rahul', shareAmount: 80, isPaid: true },
      { userId: 'user_priya', shareAmount: 80, isPaid: false },
      { userId: 'user_aman', shareAmount: 80, isPaid: false },
      { userId: 'user_neha', shareAmount: 80, isPaid: false }
    ],
    createdAt: '2026-02-25T17:00:00.000Z'
  }
];

export const initialSettlements: Settlement[] = [
  {
    id: 'set_1',
    groupId: 'grp_cse_3rd',
    fromUserId: 'user_aman',
    toUserId: 'user_rahul',
    amount: 300,
    status: 'completed',
    paymentMethod: 'upi',
    note: 'Settled for Domino’s Pizza part payment',
    createdAt: '2026-02-21T10:00:00.000Z',
    paidAt: '2026-02-21T10:05:00.000Z'
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'user_rahul',
    type: 'payment_reminder',
    title: 'Payment Reminder from Priya',
    message: 'Priya sent a friendly reminder for ₹170 (OS Xerox)',
    read: false,
    data: { amount: 170, fromUserId: 'user_priya', groupId: 'grp_cse_3rd' },
    createdAt: '2026-02-24T09:00:00.000Z'
  },
  {
    id: 'notif_2',
    userId: 'user_rahul',
    type: 'new_expense',
    title: 'New Expense in Hostel 204',
    message: 'Aman added ₹1,420 for Midnight Grocery. Your share: ₹355',
    read: false,
    data: { amount: 1420, yourShare: 355, groupId: 'grp_hostel_204' },
    createdAt: '2026-02-23T23:45:00.000Z'
  },
  {
    id: 'notif_3',
    userId: 'user_rahul',
    type: 'settlement_confirmed',
    title: 'Settlement Confirmed 🎉',
    message: 'Aman paid ₹300 via UPI for Domino’s Pizza',
    read: true,
    data: { amount: 300, fromUserId: 'user_aman' },
    createdAt: '2026-02-21T10:05:00.000Z'
  }
];

// Calculation Helpers for client-side execution when offline / on GitHub Pages
export function calculateDebtsClient(expenses: Expense[], settlements: Settlement[], groupId?: string): DebtEdge[] {
  const netBalances: Record<string, number> = {};

  const filteredExpenses = groupId ? expenses.filter((e) => e.groupId === groupId) : expenses;
  const filteredSettlements = groupId
    ? settlements.filter((s) => s.groupId === groupId && s.status === 'completed')
    : settlements.filter((s) => s.status === 'completed');

  filteredExpenses.forEach((exp) => {
    const paidBy = exp.paidBy;
    const total = exp.amount;
    netBalances[paidBy] = (netBalances[paidBy] || 0) + total;

    exp.participants.forEach((part) => {
      netBalances[part.userId] = (netBalances[part.userId] || 0) - part.shareAmount;
    });
  });

  filteredSettlements.forEach((set) => {
    netBalances[set.fromUserId] = (netBalances[set.fromUserId] || 0) + set.amount;
    netBalances[set.toUserId] = (netBalances[set.toUserId] || 0) - set.amount;
  });

  const debtors: Array<{ userId: string; amount: number }> = [];
  const creditors: Array<{ userId: string; amount: number }> = [];

  Object.entries(netBalances).forEach(([userId, balance]) => {
    const rounded = Math.round(balance * 100) / 100;
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
  expenses: Expense[],
  settlements: Settlement[]
): UserFinancialSummary {
  let totalSpending = 0;
  let youPaid = 0;
  let youAreOwed = 0;
  let youOwe = 0;
  const categoryMap: Record<string, number> = {};

  const debts = calculateDebtsClient(expenses, settlements);

  debts.forEach((d) => {
    if (d.fromUserId === userId) {
      youOwe += d.amount;
    }
    if (d.toUserId === userId) {
      youAreOwed += d.amount;
    }
  });

  expenses.forEach((e) => {
    if (e.paidBy === userId) {
      youPaid += e.amount;
    }
    const part = e.participants.find((p) => p.userId === userId);
    if (part) {
      totalSpending += part.shareAmount;
      const cat = e.category || 'Other';
      categoryMap[cat] = (categoryMap[cat] || 0) + part.shareAmount;
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
