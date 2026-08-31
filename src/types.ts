export type SplitMethod = 'equal' | 'percentage' | 'exact' | 'item_based';

export interface User {
  id: string;
  googleId?: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  institution: string;
  course: string;
  year: string;
  yearOfStudy?: string;
  city: string;
  address?: string;
  phone?: string;
  upiId?: string;
  bio?: string;
  honestyScore?: number;
  createdAt: string;
  monthlyLimits?: Record<string, number>;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  groupCode: string;
  category: 'college' | 'hostel' | 'coaching' | 'project' | 'trip' | 'friends' | 'other';
  institution: string;
  city: string;
  privacy: 'public' | 'private';
  imageUrl?: string;
  ownerId: string;
  createdAt: string;
  memberCount: number;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'pending';
  joinedAt: string;
  user?: User;
}

export interface OCRItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  confidence: 'high' | 'medium' | 'low' | 'verify';
  assignedUserIds: string[];
}

export interface OCRReceiptResult {
  merchantName: string;
  date: string;
  receiptNumber?: string;
  category?: 'Food' | 'Transport' | 'Education' | 'Shopping' | 'Entertainment' | 'Hostel' | 'Other';
  currency?: string;
  items: OCRItem[];
  subtotal: number;
  discount: number;
  tax: number;
  serviceCharge: number;
  roundOff?: number;
  total: number;
  confidenceOverall: 'high' | 'medium' | 'low';
  rawText?: string;
  upiRef?: string;
  isAiParsed?: boolean;
  modelUsed?: string;
}

export interface ExpenseItem {
  id: string;
  expenseId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  assignedUserIds: string[];
}

export interface ExpenseParticipant {
  userId: string;
  shareAmount: number;
  percentage?: number;
  exactAmount?: number;
  isPaid?: boolean;
}

export interface Expense {
  id: string;
  groupId?: string;
  groupName?: string;
  title: string;
  description?: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Education' | 'Shopping' | 'Entertainment' | 'Hostel' | 'Other';
  date: string;
  paidBy: string; // userId
  createdBy: string; // userId
  receiptUrl?: string;
  source: 'manual' | 'ocr';
  splitMethod: SplitMethod;
  items?: ExpenseItem[];
  participants: ExpenseParticipant[];
  createdAt: string;
  paidByUser?: User;
}

export interface Settlement {
  id: string;
  groupId?: string;
  fromUserId: string; // Payer: person handing over money / owing
  toUserId: string; // Payee: person receiving money
  amount: number;
  status: 'pending' | 'awaiting_receiver' | 'awaiting_payer' | 'completed' | 'rejected';
  paymentMethod: 'cash' | 'direct' | 'bank_transfer' | 'money_exchange';
  note?: string;
  payerAgreed: boolean; // Payer clicked "Agree to Confirm Honesty"
  payerAgreedAt?: string;
  receiverAgreed: boolean; // Receiver clicked "Agree to Confirm Honesty"
  receiverAgreedAt?: string;
  honestyDeclaration?: string;
  createdAt: string;
  paidAt?: string;
  completedAt?: string;
  fromUser?: User;
  toUser?: User;
}

export interface PaymentReminder {
  id: string;
  settlementId?: string;
  senderId: string;
  receiverId: string;
  amount: number;
  note?: string;
  sentAt: string;
  cooldownUntil?: string;
  status: 'sent' | 'seen' | 'settled';
  honestyAgreedBySender?: boolean;
  honestyAgreedByReceiver?: boolean;
  sender?: User;
  receiver?: User;
}

export interface AppNotification {
  id: string;
  userId: string;
  type:
    | 'group_invite'
    | 'group_joined'
    | 'new_expense'
    | 'expense_updated'
    | 'payment_reminder'
    | 'honesty_agreement_request'
    | 'honesty_confirmed'
    | 'settlement_initiated'
    | 'settlement_confirmed'
    | 'ocr_complete'
    | 'spending_limit_warning';
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: string;
}

export interface GroupActivity {
  id: string;
  groupId: string;
  userId: string;
  type: 'expense_added' | 'member_joined' | 'settlement_made' | 'receipt_scanned' | 'code_regenerated';
  content: string;
  amount?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatarUrl: string;
    username: string;
  };
}

export interface DebtEdge {
  fromUserId: string;
  toUserId: string;
  amount: number;
  fromUser?: User;
  toUser?: User;
}

export interface UserFinancialSummary {
  totalSpending: number;
  youPaid: number;
  youOwe: number;
  youAreOwed: number;
  todaySpending: number;
  weekSpending: number;
  monthSpending: number;
  categoryBreakdown: { category: string; amount: number; percentage: number }[];
  monthlyTrends: { month: string; amount: number }[];
}

export interface GroupMessage {
  id: string;
  groupId: string;
  userId: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
  user?: User;
}
