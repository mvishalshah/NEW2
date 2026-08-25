import {
  User,
  Group,
  GroupMember,
  Expense,
  ExpenseItem,
  ExpenseParticipant,
  Settlement,
  PaymentReminder,
  AppNotification,
  GroupActivity,
  UserFinancialSummary,
  DebtEdge,
  SplitMethod
} from '../src/types.js';

// Pre-seeded Users
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

// Pre-seeded Groups
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

// Pre-seeded Group Members
export const initialGroupMembers: GroupMember[] = [
  // CSE 3rd Year
  { id: 'gm_1', groupId: 'grp_cse_3rd', userId: 'user_rahul', role: 'owner', status: 'active', joinedAt: '2026-01-15T10:00:00.000Z' },
  { id: 'gm_2', groupId: 'grp_cse_3rd', userId: 'user_priya', role: 'admin', status: 'active', joinedAt: '2026-01-15T10:05:00.000Z' },
  { id: 'gm_3', groupId: 'grp_cse_3rd', userId: 'user_aman', role: 'member', status: 'active', joinedAt: '2026-01-15T11:00:00.000Z' },
  { id: 'gm_4', groupId: 'grp_cse_3rd', userId: 'user_neha', role: 'member', status: 'active', joinedAt: '2026-01-16T09:15:00.000Z' },
  { id: 'gm_5', groupId: 'grp_cse_3rd', userId: 'user_rohan', role: 'member', status: 'active', joinedAt: '2026-01-18T14:30:00.000Z' },

  // Hostel 204
  { id: 'gm_6', groupId: 'grp_hostel_204', userId: 'user_aman', role: 'owner', status: 'active', joinedAt: '2026-01-20T12:00:00.000Z' },
  { id: 'gm_7', groupId: 'grp_hostel_204', userId: 'user_rahul', role: 'admin', status: 'active', joinedAt: '2026-01-20T12:10:00.000Z' },
  { id: 'gm_8', groupId: 'grp_hostel_204', userId: 'user_rohan', role: 'member', status: 'active', joinedAt: '2026-01-20T12:15:00.000Z' },
  { id: 'gm_9', groupId: 'grp_hostel_204', userId: 'user_priya', role: 'member', status: 'active', joinedAt: '2026-01-21T18:00:00.000Z' },

  // Delhi Coaching
  { id: 'gm_10', groupId: 'grp_delhi_coaching', userId: 'user_priya', role: 'owner', status: 'active', joinedAt: '2026-02-01T15:00:00.000Z' },
  { id: 'gm_11', groupId: 'grp_delhi_coaching', userId: 'user_rahul', role: 'member', status: 'active', joinedAt: '2026-02-01T15:10:00.000Z' },
  { id: 'gm_12', groupId: 'grp_delhi_coaching', userId: 'user_sneha', role: 'member', status: 'active', joinedAt: '2026-02-02T10:00:00.000Z' },
  { id: 'gm_13', groupId: 'grp_delhi_coaching', userId: 'user_neha', role: 'member', status: 'active', joinedAt: '2026-02-03T16:20:00.000Z' },

  // Goa Trip
  { id: 'gm_14', groupId: 'grp_goa_trip', userId: 'user_rahul', role: 'owner', status: 'active', joinedAt: '2026-02-10T18:00:00.000Z' },
  { id: 'gm_15', groupId: 'grp_goa_trip', userId: 'user_priya', role: 'admin', status: 'active', joinedAt: '2026-02-10T18:05:00.000Z' },
  { id: 'gm_16', groupId: 'grp_goa_trip', userId: 'user_aman', role: 'member', status: 'active', joinedAt: '2026-02-10T18:20:00.000Z' },
  { id: 'gm_17', groupId: 'grp_goa_trip', userId: 'user_neha', role: 'member', status: 'active', joinedAt: '2026-02-10T19:00:00.000Z' },

  // Project Alpha
  { id: 'gm_18', groupId: 'grp_project_alpha', userId: 'user_neha', role: 'owner', status: 'active', joinedAt: '2026-02-14T09:30:00.000Z' },
  { id: 'gm_19', groupId: 'grp_project_alpha', userId: 'user_rahul', role: 'member', status: 'active', joinedAt: '2026-02-14T09:35:00.000Z' },
  { id: 'gm_20', groupId: 'grp_project_alpha', userId: 'user_aman', role: 'member', status: 'active', joinedAt: '2026-02-14T09:40:00.000Z' }
];

// Pre-seeded Expenses
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
      { userId: 'user_rahul', shareAmount: 385, isPaid: true }, // Rahul paid entire 1155, his share is 385
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

// Pre-seeded Settlements
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

// Pre-seeded Activity Feed
export const initialActivities: GroupActivity[] = [
  {
    id: 'act_1',
    groupId: 'grp_cse_3rd',
    userId: 'user_rahul',
    type: 'expense_added',
    content: 'added ₹1,155 for Pizza & Garlic Bread Treat @ Domino’s',
    amount: 1155,
    createdAt: '2026-02-20T19:30:00.000Z'
  },
  {
    id: 'act_2',
    groupId: 'grp_cse_3rd',
    userId: 'user_aman',
    type: 'settlement_made',
    content: 'settled ₹300 with Rahul via UPI',
    amount: 300,
    createdAt: '2026-02-21T10:05:00.000Z'
  },
  {
    id: 'act_3',
    groupId: 'grp_cse_3rd',
    userId: 'user_priya',
    type: 'expense_added',
    content: 'added ₹850 for Operating Systems Xerox & Lab Manuals',
    amount: 850,
    createdAt: '2026-02-22T11:15:00.000Z'
  },
  {
    id: 'act_4',
    groupId: 'grp_hostel_204',
    userId: 'user_aman',
    type: 'expense_added',
    content: 'scanned receipt & added ₹1,420 for Midnight Grocery',
    amount: 1420,
    createdAt: '2026-02-23T23:45:00.000Z'
  },
  {
    id: 'act_5',
    groupId: 'grp_project_alpha',
    userId: 'user_rahul',
    type: 'expense_added',
    content: 'added ₹1,800 for Cloud GPU Server & Domain',
    amount: 1800,
    createdAt: '2026-02-24T14:10:00.000Z'
  },
  {
    id: 'act_6',
    groupId: 'grp_cse_3rd',
    userId: 'user_rahul',
    type: 'expense_added',
    content: 'added ₹320 for Campus Canteen Chai & Samosa Break',
    amount: 320,
    createdAt: '2026-02-25T17:00:00.000Z'
  }
];

// Pre-seeded Notifications for Current User (Rahul)
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

// In-Memory Database Store Class
class DatabaseStore {
  users: User[] = [...initialUsers];
  groups: Group[] = [...initialGroups];
  groupMembers: GroupMember[] = [...initialGroupMembers];
  expenses: Expense[] = [...initialExpenses];
  settlements: Settlement[] = [...initialSettlements];
  reminders: PaymentReminder[] = [];
  notifications: AppNotification[] = [...initialNotifications];
  activities: GroupActivity[] = [...initialActivities];
  currentUserId: string = 'user_rahul'; // Default active student

  constructor() {
    this.hydrateRelations();
  }

  hydrateRelations() {
    // Helper to keep relations clean
  }

  // Current User Management
  getCurrentUser(): User {
    const u = this.users.find((user) => user.id === this.currentUserId);
    return u || this.users[0];
  }

  setCurrentUser(userId: string): User | null {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.currentUserId = user.id;
      return user;
    }
    return null;
  }

  // Google Login / Upsert User
  loginWithGoogle(payload: { email: string; name?: string; avatarUrl?: string; googleId?: string }): User {
    let existing = this.users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (existing) {
      if (payload.avatarUrl) existing.avatarUrl = payload.avatarUrl;
      if (payload.name) existing.name = payload.name;
      this.currentUserId = existing.id;
      return existing;
    }

    const username = (payload.name || payload.email.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .slice(0, 15) + Math.floor(100 + Math.random() * 900);

    const newUser: User = {
      id: `user_${Date.now()}`,
      googleId: payload.googleId || `google_${Date.now()}`,
      name: payload.name || 'New Student',
      username,
      email: payload.email,
      avatarUrl: payload.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      institution: 'Delhi Technological University',
      course: 'B.Tech Engineering',
      year: '3rd Year',
      city: 'New Delhi',
      upiId: `${username}@okaxis`,
      bio: 'Excited to track student expenses with SplitMate!',
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.currentUserId = newUser.id;

    // Automatically add to public batch group
    const publicGroup = this.groups[0];
    if (publicGroup) {
      this.groupMembers.push({
        id: `gm_${Date.now()}`,
        groupId: publicGroup.id,
        userId: newUser.id,
        role: 'member',
        status: 'active',
        joinedAt: new Date().toISOString()
      });
      publicGroup.memberCount += 1;
    }

    return newUser;
  }

  updateUserProfile(userId: string, updates: Partial<User>): User | null {
    const index = this.users.findIndex((u) => u.id === userId);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  getUser(userId: string): User | undefined {
    return this.users.find((u) => u.id === userId);
  }

  getAllUsers(): User[] {
    return this.users;
  }

  // Groups
  getGroupsForUser(userId: string): Array<Group & { role: string; myBalance: number }> {
    const userMemberships = this.groupMembers.filter((gm) => gm.userId === userId && gm.status === 'active');
    return userMemberships.map((membership) => {
      const group = this.groups.find((g) => g.id === membership.groupId);
      if (!group) return null as any;

      // calculate net balance in this group
      const debts = this.calculateGroupDebts(group.id);
      let balance = 0;
      debts.forEach((debt) => {
        if (debt.toUserId === userId) balance += debt.amount; // someone owes user
        if (debt.fromUserId === userId) balance -= debt.amount; // user owes someone
      });

      return {
        ...group,
        role: membership.role,
        myBalance: balance
      };
    }).filter(Boolean);
  }

  getPublicGroups(query?: string): Group[] {
    let list = this.groups.filter((g) => g.privacy === 'public');
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.institution.toLowerCase().includes(q) ||
          g.city.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.groupCode.toLowerCase().includes(q)
      );
    }
    return list;
  }

  getGroupById(groupId: string): (Group & { members: GroupMember[]; expenses: Expense[]; activities: GroupActivity[] }) | null {
    const group = this.groups.find((g) => g.id === groupId);
    if (!group) return null;

    const members = this.groupMembers
      .filter((gm) => gm.groupId === groupId && gm.status === 'active')
      .map((gm) => ({
        ...gm,
        user: this.getUser(gm.userId)
      }));

    const expenses = this.expenses
      .filter((e) => e.groupId === groupId)
      .map((e) => ({
        ...e,
        paidByUser: this.getUser(e.paidBy)
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const activities = this.activities
      .filter((a) => a.groupId === groupId)
      .map((a) => {
        const u = this.getUser(a.userId);
        return {
          ...a,
          user: u ? { id: u.id, name: u.name, avatarUrl: u.avatarUrl, username: u.username } : undefined
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      ...group,
      members,
      expenses,
      activities
    };
  }

  createGroup(data: {
    name: string;
    description: string;
    category: Group['category'];
    institution: string;
    city: string;
    privacy: 'public' | 'private';
    imageUrl?: string;
    ownerId: string;
  }): Group {
    const groupCode = this.generateUniqueGroupCode(data.name);
    const newGroup: Group = {
      id: `grp_${Date.now()}`,
      name: data.name,
      description: data.description || '',
      groupCode,
      category: data.category || 'college',
      institution: data.institution || 'Delhi Technological University',
      city: data.city || 'New Delhi',
      privacy: data.privacy || 'public',
      imageUrl:
        data.imageUrl ||
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80',
      ownerId: data.ownerId,
      createdAt: new Date().toISOString(),
      memberCount: 1
    };

    this.groups.unshift(newGroup);

    // add owner as admin
    this.groupMembers.push({
      id: `gm_${Date.now()}`,
      groupId: newGroup.id,
      userId: data.ownerId,
      role: 'owner',
      status: 'active',
      joinedAt: new Date().toISOString()
    });

    const owner = this.getUser(data.ownerId);
    this.activities.unshift({
      id: `act_${Date.now()}`,
      groupId: newGroup.id,
      userId: data.ownerId,
      type: 'member_joined',
      content: `created the group "${newGroup.name}" with code ${groupCode}`,
      createdAt: new Date().toISOString(),
      user: owner ? { id: owner.id, name: owner.name, avatarUrl: owner.avatarUrl, username: owner.username } : undefined
    });

    return newGroup;
  }

  joinGroupByCode(groupCode: string, userId: string): { success: boolean; message: string; group?: Group } {
    const cleanCode = groupCode.trim().toUpperCase();
    const group = this.groups.find((g) => g.groupCode.toUpperCase() === cleanCode);

    if (!group) {
      return { success: false, message: 'Invalid group code. Please check and try again.' };
    }

    const existingMember = this.groupMembers.find((gm) => gm.groupId === group.id && gm.userId === userId);
    if (existingMember && existingMember.status === 'active') {
      return { success: false, message: `You are already a member of ${group.name}.`, group };
    }

    if (existingMember && existingMember.status === 'pending') {
      existingMember.status = 'active';
    } else {
      this.groupMembers.push({
        id: `gm_${Date.now()}`,
        groupId: group.id,
        userId,
        role: 'member',
        status: 'active',
        joinedAt: new Date().toISOString()
      });
      group.memberCount += 1;
    }

    const user = this.getUser(userId);
    this.activities.unshift({
      id: `act_${Date.now()}`,
      groupId: group.id,
      userId,
      type: 'member_joined',
      content: `${user?.name || 'A student'} joined the group using group code 🎉`,
      createdAt: new Date().toISOString()
    });

    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId,
      type: 'group_joined',
      title: 'Joined Group 🎉',
      message: `You successfully joined ${group.name}!`,
      read: false,
      data: { groupId: group.id },
      createdAt: new Date().toISOString()
    });

    return { success: true, message: `Successfully joined ${group.name}!`, group };
  }

  regenerateGroupCode(groupId: string, userId: string): string | null {
    const group = this.groups.find((g) => g.id === groupId);
    if (!group) return null;
    const member = this.groupMembers.find((gm) => gm.groupId === groupId && gm.userId === userId);
    if (!member || (member.role !== 'owner' && member.role !== 'admin')) {
      return null;
    }
    const newCode = this.generateUniqueGroupCode(group.name);
    group.groupCode = newCode;

    this.activities.unshift({
      id: `act_${Date.now()}`,
      groupId: group.id,
      userId,
      type: 'code_regenerated',
      content: `regenerated the group code to ${newCode}`,
      createdAt: new Date().toISOString()
    });

    return newCode;
  }

  generateUniqueGroupCode(name: string): string {
    const prefix = name.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase() || 'GRP';
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    let code = `${prefix}${rand}`;
    while (this.groups.some((g) => g.groupCode === code)) {
      code = `${prefix}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    }
    return code;
  }

  // Expense Management
  addExpense(data: {
    groupId?: string;
    title: string;
    description?: string;
    amount: number;
    category: Expense['category'];
    date?: string;
    paidBy: string;
    createdBy: string;
    source: 'manual' | 'ocr';
    splitMethod: SplitMethod;
    items?: ExpenseItem[];
    participants: Array<{ userId: string; shareAmount?: number; percentage?: number; exactAmount?: number }>;
    receiptUrl?: string;
  }): Expense {
    const totalAmount = Math.round(Number(data.amount) * 100) / 100;
    const group = data.groupId ? this.groups.find((g) => g.id === data.groupId) : undefined;

    // Calculate shares mathematically based on splitMethod
    let finalParticipants: ExpenseParticipant[] = [];

    if (data.splitMethod === 'equal') {
      const count = data.participants.length || 1;
      const baseShare = Math.floor((totalAmount / count) * 100) / 100;
      let remainder = Math.round((totalAmount - baseShare * count) * 100) / 100;

      finalParticipants = data.participants.map((p, idx) => {
        let share = baseShare;
        if (idx === 0 && remainder > 0) {
          share = Math.round((share + remainder) * 100) / 100;
        }
        return {
          userId: p.userId,
          shareAmount: share,
          isPaid: p.userId === data.paidBy
        };
      });
    } else if (data.splitMethod === 'percentage') {
      let sumShares = 0;
      finalParticipants = data.participants.map((p, idx) => {
        const pct = p.percentage || 100 / data.participants.length;
        let share = Math.round((totalAmount * (pct / 100)) * 100) / 100;
        sumShares += share;
        return {
          userId: p.userId,
          shareAmount: share,
          percentage: pct,
          isPaid: p.userId === data.paidBy
        };
      });
      // Correct any 1-2 paise rounding error on first participant
      const diff = Math.round((totalAmount - sumShares) * 100) / 100;
      if (diff !== 0 && finalParticipants.length > 0) {
        finalParticipants[0].shareAmount = Math.round((finalParticipants[0].shareAmount + diff) * 100) / 100;
      }
    } else if (data.splitMethod === 'exact') {
      finalParticipants = data.participants.map((p) => ({
        userId: p.userId,
        shareAmount: Math.round(Number(p.exactAmount || p.shareAmount || 0) * 100) / 100,
        exactAmount: p.exactAmount,
        isPaid: p.userId === data.paidBy
      }));
    } else if (data.splitMethod === 'item_based' && data.items && data.items.length > 0) {
      // Calculate per participant based on assigned items
      const userShareMap: Record<string, number> = {};
      data.participants.forEach((p) => (userShareMap[p.userId] = 0));

      let itemsTotal = 0;
      data.items.forEach((item) => {
        const itemPrice = Math.round(Number(item.totalPrice || item.quantity * item.unitPrice) * 100) / 100;
        itemsTotal += itemPrice;
        const assigned = item.assignedUserIds && item.assignedUserIds.length > 0 ? item.assignedUserIds : data.participants.map((p) => p.userId);
        const splitPerPerson = itemPrice / assigned.length;
        assigned.forEach((uId) => {
          if (userShareMap[uId] !== undefined) {
            userShareMap[uId] += splitPerPerson;
          } else {
            userShareMap[uId] = splitPerPerson;
          }
        });
      });

      // Distribute taxes/discounts proportionally if total differs from itemsTotal
      const ratio = itemsTotal > 0 ? totalAmount / itemsTotal : 1;
      let calculatedSum = 0;
      finalParticipants = Object.keys(userShareMap).map((uId, idx) => {
        let finalShare = Math.round(userShareMap[uId] * ratio * 100) / 100;
        calculatedSum += finalShare;
        return {
          userId: uId,
          shareAmount: finalShare,
          isPaid: uId === data.paidBy
        };
      });

      const diff = Math.round((totalAmount - calculatedSum) * 100) / 100;
      if (diff !== 0 && finalParticipants.length > 0) {
        finalParticipants[0].shareAmount = Math.round((finalParticipants[0].shareAmount + diff) * 100) / 100;
      }
    } else {
      // default fallback
      finalParticipants = data.participants.map((p) => ({
        userId: p.userId,
        shareAmount: Math.round((totalAmount / data.participants.length) * 100) / 100,
        isPaid: p.userId === data.paidBy
      }));
    }

    const newExpense: Expense = {
      id: `exp_${Date.now()}`,
      groupId: data.groupId,
      groupName: group?.name || 'Personal / General',
      title: data.title,
      description: data.description,
      amount: totalAmount,
      category: data.category || 'Food',
      date: data.date || new Date().toISOString().split('T')[0],
      paidBy: data.paidBy,
      createdBy: data.createdBy,
      source: data.source || 'manual',
      splitMethod: data.splitMethod,
      items: data.items,
      participants: finalParticipants,
      receiptUrl: data.receiptUrl,
      createdAt: new Date().toISOString()
    };

    this.expenses.unshift(newExpense);

    // Add activity if in a group
    if (data.groupId) {
      const payer = this.getUser(data.paidBy);
      this.activities.unshift({
        id: `act_${Date.now()}`,
        groupId: data.groupId,
        userId: data.paidBy,
        type: 'expense_added',
        content: `${data.source === 'ocr' ? 'scanned receipt & ' : ''}added ₹${totalAmount.toLocaleString('en-IN')} for "${data.title}"`,
        amount: totalAmount,
        createdAt: new Date().toISOString(),
        user: payer ? { id: payer.id, name: payer.name, avatarUrl: payer.avatarUrl, username: payer.username } : undefined
      });

      // Send notifications to other participants
      finalParticipants.forEach((p) => {
        if (p.userId !== data.paidBy) {
          this.notifications.unshift({
            id: `notif_${Date.now()}_${p.userId}`,
            userId: p.userId,
            type: 'new_expense',
            title: `New Expense in ${group?.name || 'Group'}`,
            message: `${payer?.name || 'Someone'} added ₹${totalAmount.toLocaleString('en-IN')} for ${data.title}. Your share: ₹${p.shareAmount.toLocaleString('en-IN')}`,
            read: false,
            data: { expenseId: newExpense.id, groupId: data.groupId, shareAmount: p.shareAmount },
            createdAt: new Date().toISOString()
          });
        }
      });
    }

    return newExpense;
  }

  deleteExpense(expenseId: string, userId: string): boolean {
    const idx = this.expenses.findIndex((e) => e.id === expenseId);
    if (idx === -1) return false;
    const exp = this.expenses[idx];
    if (exp.createdBy !== userId && exp.paidBy !== userId) {
      return false; // unauthorized
    }
    this.expenses.splice(idx, 1);
    return true;
  }

  // Debt Simplification Matrix & Settlements
  calculateGroupDebts(groupId?: string): DebtEdge[] {
    const relevantExpenses = groupId ? this.expenses.filter((e) => e.groupId === groupId) : this.expenses;
    const relevantSettlements = (groupId
      ? this.settlements.filter((s) => s.groupId === groupId)
      : this.settlements
    ).filter((s) => s.status === 'completed');

    // 1. Calculate Net Balance for each user: netBalance = (Total paid by user) - (Total owed by user)
    const netBalance: Record<string, number> = {};

    relevantExpenses.forEach((exp) => {
      // Payer contributed full amount
      netBalance[exp.paidBy] = (netBalance[exp.paidBy] || 0) + exp.amount;

      // Each participant owes their shareAmount
      exp.participants.forEach((p) => {
        netBalance[p.userId] = (netBalance[p.userId] || 0) - p.shareAmount;
      });
    });

    // Factor in completed settlements
    relevantSettlements.forEach((set) => {
      // fromUser paid toUser, so fromUser's balance increases, toUser's decreases
      netBalance[set.fromUserId] = (netBalance[set.fromUserId] || 0) + set.amount;
      netBalance[set.toUserId] = (netBalance[set.toUserId] || 0) - set.amount;
    });

    // Separate into debtors (negative balance) and creditors (positive balance)
    const debtors: { userId: string; amount: number }[] = [];
    const creditors: { userId: string; amount: number }[] = [];

    Object.keys(netBalance).forEach((userId) => {
      const bal = Math.round(netBalance[userId] * 100) / 100;
      if (bal < -0.5) {
        debtors.push({ userId, amount: -bal }); // owes money
      } else if (bal > 0.5) {
        creditors.push({ userId, amount: bal }); // is owed money
      }
    });

    // 2. Greedy Debt Simplification Algorithm
    // Sort debtors and creditors descending by balance to minimize transactions
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const simplifiedDebts: DebtEdge[] = [];
    let i = 0; // debtor index
    let j = 0; // creditor index

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const settlementAmount = Math.min(debtor.amount, creditor.amount);

      if (settlementAmount > 0.5) {
        simplifiedDebts.push({
          fromUserId: debtor.userId,
          toUserId: creditor.userId,
          amount: Math.round(settlementAmount * 100) / 100,
          fromUser: this.getUser(debtor.userId),
          toUser: this.getUser(creditor.userId)
        });
      }

      debtor.amount -= settlementAmount;
      creditor.amount -= settlementAmount;

      if (debtor.amount <= 0.5) i++;
      if (creditor.amount <= 0.5) j++;
    }

    return simplifiedDebts;
  }

  // Record Settlement
  recordSettlement(data: {
    groupId?: string;
    fromUserId: string;
    toUserId: string;
    amount: number;
    paymentMethod: 'upi' | 'cash' | 'other';
    status: 'initiated' | 'completed';
    note?: string;
  }): Settlement {
    const newSettlement: Settlement = {
      id: `set_${Date.now()}`,
      groupId: data.groupId,
      fromUserId: data.fromUserId,
      toUserId: data.toUserId,
      amount: Math.round(Number(data.amount) * 100) / 100,
      paymentMethod: data.paymentMethod || 'upi',
      status: data.status || 'initiated',
      note: data.note || 'Settled via SplitMate UPI',
      createdAt: new Date().toISOString(),
      paidAt: data.status === 'completed' ? new Date().toISOString() : undefined,
      fromUser: this.getUser(data.fromUserId),
      toUser: this.getUser(data.toUserId)
    };

    this.settlements.unshift(newSettlement);

    const fromUser = this.getUser(data.fromUserId);
    const toUser = this.getUser(data.toUserId);

    if (data.groupId) {
      this.activities.unshift({
        id: `act_${Date.now()}`,
        groupId: data.groupId,
        userId: data.fromUserId,
        type: 'settlement_made',
        content: `${data.status === 'completed' ? 'settled' : 'initiated payment of'} ₹${data.amount.toLocaleString('en-IN')} with ${toUser?.name || 'member'} via ${data.paymentMethod.toUpperCase()}`,
        amount: data.amount,
        createdAt: new Date().toISOString(),
        user: fromUser ? { id: fromUser.id, name: fromUser.name, avatarUrl: fromUser.avatarUrl, username: fromUser.username } : undefined
      });
    }

    // Send notification to receiver
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: data.toUserId,
      type: data.status === 'completed' ? 'settlement_confirmed' : 'settlement_initiated',
      title: data.status === 'completed' ? 'Payment Settled 🎉' : 'Payment Initiated',
      message: `${fromUser?.name || 'Someone'} ${data.status === 'completed' ? 'settled' : 'initiated a payment of'} ₹${data.amount.toLocaleString('en-IN')} via ${data.paymentMethod.toUpperCase()}`,
      read: false,
      data: { settlementId: newSettlement.id, fromUserId: data.fromUserId, amount: data.amount },
      createdAt: new Date().toISOString()
    });

    return newSettlement;
  }

  confirmSettlement(settlementId: string, userId: string): boolean {
    const set = this.settlements.find((s) => s.id === settlementId);
    if (!set) return false;
    if (set.toUserId !== userId && set.fromUserId !== userId) return false;

    set.status = 'completed';
    set.paidAt = new Date().toISOString();

    const fromUser = this.getUser(set.fromUserId);
    const toUser = this.getUser(set.toUserId);

    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: set.fromUserId,
      type: 'settlement_confirmed',
      title: 'Settlement Confirmed ✅',
      message: `${toUser?.name || 'Recipient'} confirmed receiving ₹${set.amount.toLocaleString('en-IN')}`,
      read: false,
      createdAt: new Date().toISOString()
    });

    return true;
  }

  // Payment Reminders with Cooldown
  sendPaymentReminder(data: {
    senderId: string;
    receiverId: string;
    amount: number;
    note?: string;
    settlementId?: string;
  }): { success: boolean; message: string; reminder?: PaymentReminder } {
    // Check cooldown (5 minutes between reminders for same receiver to prevent spam)
    const existing = this.reminders.find(
      (r) => r.senderId === data.senderId && r.receiverId === data.receiverId && new Date(r.cooldownUntil).getTime() > Date.now()
    );

    if (existing) {
      const waitMins = Math.ceil((new Date(existing.cooldownUntil).getTime() - Date.now()) / 60000);
      return {
        success: false,
        message: `Please wait ${waitMins} minute${waitMins > 1 ? 's' : ''} before sending another reminder to this member.`
      };
    }

    const cooldownUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 min cooldown

    const reminder: PaymentReminder = {
      id: `rem_${Date.now()}`,
      settlementId: data.settlementId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      amount: data.amount,
      note: data.note,
      sentAt: new Date().toISOString(),
      cooldownUntil,
      status: 'sent',
      sender: this.getUser(data.senderId),
      receiver: this.getUser(data.receiverId)
    };

    this.reminders.unshift(reminder);

    const sender = this.getUser(data.senderId);
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: data.receiverId,
      type: 'payment_reminder',
      title: `Payment Reminder from ${sender?.name || 'a friend'} 🔔`,
      message: `${sender?.name || 'Someone'} sent a reminder for pending payment of ₹${data.amount.toLocaleString('en-IN')}. ${data.note || ''}`,
      read: false,
      data: { reminderId: reminder.id, senderId: data.senderId, amount: data.amount },
      createdAt: new Date().toISOString()
    });

    return { success: true, message: 'Friendly payment reminder sent successfully!', reminder };
  }

  // Financial Summary for Dashboard
  getUserFinancialSummary(userId: string): UserFinancialSummary {
    let totalSpending = 0;
    let youPaid = 0;
    let todaySpending = 0;
    let weekSpending = 0;
    let monthSpending = 0;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const categoryMap: Record<string, number> = {
      Food: 0,
      Transport: 0,
      Education: 0,
      Shopping: 0,
      Entertainment: 0,
      Hostel: 0,
      Other: 0
    };

    const monthlyMap: Record<string, number> = {};

    this.expenses.forEach((exp) => {
      const expDate = new Date(exp.date);
      const isThisMonth = expDate >= startOfMonth;
      const isThisWeek = expDate >= sevenDaysAgo;
      const isToday = exp.date === todayStr;

      // Find user's participant share
      const part = exp.participants.find((p) => p.userId === userId);
      if (part) {
        totalSpending += part.shareAmount;
        categoryMap[exp.category] = (categoryMap[exp.category] || 0) + part.shareAmount;

        if (isToday) todaySpending += part.shareAmount;
        if (isThisWeek) weekSpending += part.shareAmount;
        if (isThisMonth) monthSpending += part.shareAmount;

        const monthName = expDate.toLocaleString('default', { month: 'short' });
        monthlyMap[monthName] = (monthlyMap[monthName] || 0) + part.shareAmount;
      }

      if (exp.paidBy === userId) {
        youPaid += exp.amount;
      }
    });

    // Global debts calculation
    const allDebts = this.calculateGroupDebts();
    let youOwe = 0;
    let youAreOwed = 0;

    allDebts.forEach((debt) => {
      if (debt.fromUserId === userId) youOwe += debt.amount;
      if (debt.toUserId === userId) youAreOwed += debt.amount;
    });

    const categoryBreakdown = Object.keys(categoryMap).map((cat) => ({
      category: cat,
      amount: categoryMap[cat],
      percentage: totalSpending > 0 ? Math.round((categoryMap[cat] / totalSpending) * 100) : 0
    }));

    const monthlyTrends = Object.keys(monthlyMap).map((m) => ({
      month: m,
      amount: monthlyMap[m]
    }));

    // If only 1 month exists, provide simulated last 3 months for nice chart
    if (monthlyTrends.length < 3) {
      monthlyTrends.unshift(
        { month: 'Dec', amount: 3200 },
        { month: 'Jan', amount: 4850 }
      );
    }

    return {
      totalSpending: Math.round(totalSpending * 100) / 100,
      youPaid: Math.round(youPaid * 100) / 100,
      youOwe: Math.round(youOwe * 100) / 100,
      youAreOwed: Math.round(youAreOwed * 100) / 100,
      todaySpending: Math.round(todaySpending * 100) / 100,
      weekSpending: Math.round(weekSpending * 100) / 100,
      monthSpending: Math.round(monthSpending * 100) / 100,
      categoryBreakdown,
      monthlyTrends
    };
  }

  // Notifications
  getNotificationsForUser(userId: string): AppNotification[] {
    return this.notifications.filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  markNotificationAsRead(id: string, userId: string): boolean {
    const notif = this.notifications.find((n) => n.id === id && n.userId === userId);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }

  markAllNotificationsAsRead(userId: string): boolean {
    this.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    return true;
  }
}

export const db = new DatabaseStore();
