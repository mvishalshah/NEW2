var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);

// server/db.ts
var initialUsers = [
  {
    id: "user_rahul",
    googleId: "google_1001",
    name: "Rahul Sharma",
    username: "rahul_tech",
    email: "rahul.sharma@example.edu",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    institution: "Delhi Technological University",
    course: "B.Tech Computer Science",
    year: "3rd Year",
    city: "New Delhi",
    bio: "Coding by night, splitting bills by day. Always ready for midnight Maggi!",
    createdAt: "2026-01-10T10:00:00.000Z"
  },
  {
    id: "user_priya",
    googleId: "google_1002",
    name: "Priya Patel",
    username: "priya_p",
    email: "priya.patel@example.edu",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    institution: "Delhi Technological University",
    course: "B.Tech Computer Science",
    year: "3rd Year",
    city: "New Delhi",
    bio: "Design enthusiast & coffee addict \u2615",
    createdAt: "2026-01-12T11:30:00.000Z"
  },
  {
    id: "user_aman",
    googleId: "google_1003",
    name: "Aman Verma",
    username: "aman_v",
    email: "aman.v@example.edu",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    institution: "Delhi Technological University",
    course: "B.Tech Computer Science",
    year: "3rd Year",
    city: "New Delhi",
    bio: "Hostel 204 champion gamer \u{1F3AE}",
    createdAt: "2026-01-15T09:00:00.000Z"
  },
  {
    id: "user_neha",
    googleId: "google_1004",
    name: "Neha Gupta",
    username: "neha_g",
    email: "neha.gupta@example.edu",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    institution: "Delhi Technological University",
    course: "B.Tech IT",
    year: "3rd Year",
    city: "New Delhi",
    bio: "Event coordinator & food explorer",
    createdAt: "2026-01-18T14:20:00.000Z"
  },
  {
    id: "user_rohan",
    googleId: "google_1005",
    name: "Rohan Mehra",
    username: "rohan_m",
    email: "rohan.mehra@example.edu",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    institution: "Delhi Technological University",
    course: "B.Tech Mechanical",
    year: "3rd Year",
    city: "New Delhi",
    bio: "Robotics club captain \u{1F916}",
    createdAt: "2026-01-20T16:45:00.000Z"
  },
  {
    id: "user_sneha",
    googleId: "google_1006",
    name: "Sneha Rao",
    username: "sneha_r",
    email: "sneha.rao@example.edu",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    institution: "Delhi University (South Campus)",
    course: "B.Sc Economics",
    year: "2nd Year",
    city: "New Delhi",
    bio: "Finance geek & debater",
    createdAt: "2026-02-01T12:00:00.000Z"
  }
];
var initialGroups = [
  {
    id: "grp_cse_3rd",
    name: "\u{1F393} CSE 3rd Year (Batch 2026)",
    description: "Official batch splitting group for notes, xerox, lab kits, and hackathons.",
    groupCode: "CSE3X8K2",
    category: "college",
    institution: "Delhi Technological University",
    city: "New Delhi",
    privacy: "public",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80",
    ownerId: "user_rahul",
    createdAt: "2026-01-15T10:00:00.000Z",
    memberCount: 5
  },
  {
    id: "grp_hostel_204",
    name: "\u{1F3E0} Hostel Room 204 & Block A",
    description: "Night snacks, Wi-Fi router recharge, room groceries and Maggi bills.",
    groupCode: "HSTL204A",
    category: "hostel",
    institution: "Delhi Technological University",
    city: "New Delhi",
    privacy: "private",
    imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&auto=format&fit=crop&q=80",
    ownerId: "user_aman",
    createdAt: "2026-01-20T12:00:00.000Z",
    memberCount: 4
  },
  {
    id: "grp_delhi_coaching",
    name: "\u{1F4DA} Delhi Coaching Batch A",
    description: "GATE & GRE test series sharing, study material xerox, and canteen snacks.",
    groupCode: "DELCOACH1",
    category: "coaching",
    institution: "Made Easy Delhi Center",
    city: "New Delhi",
    privacy: "public",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=80",
    ownerId: "user_priya",
    createdAt: "2026-02-01T15:00:00.000Z",
    memberCount: 4
  },
  {
    id: "grp_goa_trip",
    name: "\u{1F697} Goa Trip 2026",
    description: "Self-drive rental, beach shacks, resort booking & water sports split!",
    groupCode: "GOATRIP26",
    category: "trip",
    institution: "Delhi Technological University",
    city: "Goa",
    privacy: "private",
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&auto=format&fit=crop&q=80",
    ownerId: "user_rahul",
    createdAt: "2026-02-10T18:00:00.000Z",
    memberCount: 4
  },
  {
    id: "grp_project_alpha",
    name: "\u{1F4BB} Project Team Alpha - AI Bot",
    description: "Cloud hosting servers, Arduino sensors, 3D printing & hardware expense.",
    groupCode: "ALPHA26",
    category: "project",
    institution: "Delhi Technological University",
    city: "New Delhi",
    privacy: "public",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&auto=format&fit=crop&q=80",
    ownerId: "user_neha",
    createdAt: "2026-02-14T09:30:00.000Z",
    memberCount: 3
  }
];
var initialGroupMembers = [
  // CSE 3rd Year
  { id: "gm_1", groupId: "grp_cse_3rd", userId: "user_rahul", role: "owner", status: "active", joinedAt: "2026-01-15T10:00:00.000Z" },
  { id: "gm_2", groupId: "grp_cse_3rd", userId: "user_priya", role: "admin", status: "active", joinedAt: "2026-01-15T10:05:00.000Z" },
  { id: "gm_3", groupId: "grp_cse_3rd", userId: "user_aman", role: "member", status: "active", joinedAt: "2026-01-15T11:00:00.000Z" },
  { id: "gm_4", groupId: "grp_cse_3rd", userId: "user_neha", role: "member", status: "active", joinedAt: "2026-01-16T09:15:00.000Z" },
  { id: "gm_5", groupId: "grp_cse_3rd", userId: "user_rohan", role: "member", status: "active", joinedAt: "2026-01-18T14:30:00.000Z" },
  // Hostel 204
  { id: "gm_6", groupId: "grp_hostel_204", userId: "user_aman", role: "owner", status: "active", joinedAt: "2026-01-20T12:00:00.000Z" },
  { id: "gm_7", groupId: "grp_hostel_204", userId: "user_rahul", role: "admin", status: "active", joinedAt: "2026-01-20T12:10:00.000Z" },
  { id: "gm_8", groupId: "grp_hostel_204", userId: "user_rohan", role: "member", status: "active", joinedAt: "2026-01-20T12:15:00.000Z" },
  { id: "gm_9", groupId: "grp_hostel_204", userId: "user_priya", role: "member", status: "active", joinedAt: "2026-01-21T18:00:00.000Z" },
  // Delhi Coaching
  { id: "gm_10", groupId: "grp_delhi_coaching", userId: "user_priya", role: "owner", status: "active", joinedAt: "2026-02-01T15:00:00.000Z" },
  { id: "gm_11", groupId: "grp_delhi_coaching", userId: "user_rahul", role: "member", status: "active", joinedAt: "2026-02-01T15:10:00.000Z" },
  { id: "gm_12", groupId: "grp_delhi_coaching", userId: "user_sneha", role: "member", status: "active", joinedAt: "2026-02-02T10:00:00.000Z" },
  { id: "gm_13", groupId: "grp_delhi_coaching", userId: "user_neha", role: "member", status: "active", joinedAt: "2026-02-03T16:20:00.000Z" },
  // Goa Trip
  { id: "gm_14", groupId: "grp_goa_trip", userId: "user_rahul", role: "owner", status: "active", joinedAt: "2026-02-10T18:00:00.000Z" },
  { id: "gm_15", groupId: "grp_goa_trip", userId: "user_priya", role: "admin", status: "active", joinedAt: "2026-02-10T18:05:00.000Z" },
  { id: "gm_16", groupId: "grp_goa_trip", userId: "user_aman", role: "member", status: "active", joinedAt: "2026-02-10T18:20:00.000Z" },
  { id: "gm_17", groupId: "grp_goa_trip", userId: "user_neha", role: "member", status: "active", joinedAt: "2026-02-10T19:00:00.000Z" },
  // Project Alpha
  { id: "gm_18", groupId: "grp_project_alpha", userId: "user_neha", role: "owner", status: "active", joinedAt: "2026-02-14T09:30:00.000Z" },
  { id: "gm_19", groupId: "grp_project_alpha", userId: "user_rahul", role: "member", status: "active", joinedAt: "2026-02-14T09:35:00.000Z" },
  { id: "gm_20", groupId: "grp_project_alpha", userId: "user_aman", role: "member", status: "active", joinedAt: "2026-02-14T09:40:00.000Z" }
];
var initialExpenses = [
  {
    id: "exp_1",
    groupId: "grp_cse_3rd",
    groupName: "\u{1F393} CSE 3rd Year (Batch 2026)",
    title: "Pizza & Garlic Bread Treat @ Domino\u2019s",
    description: "Post-hackathon celebration dinner bill",
    amount: 1155,
    category: "Food",
    date: "2026-02-20",
    paidBy: "user_rahul",
    createdBy: "user_rahul",
    source: "ocr",
    splitMethod: "item_based",
    items: [
      { id: "it_1", name: "Farmhouse Pizza Large", quantity: 1, unitPrice: 600, totalPrice: 600, assignedUserIds: ["user_rahul", "user_aman"] },
      { id: "it_2", name: "Stuffed Garlic Bread & Dip", quantity: 1, unitPrice: 300, totalPrice: 300, assignedUserIds: ["user_priya"] },
      { id: "it_3", name: "Cold Drinks 750ml (x2)", quantity: 2, unitPrice: 100, totalPrice: 200, assignedUserIds: ["user_rahul", "user_priya", "user_aman"] },
      { id: "it_4", name: "GST & Service Charge (5%)", quantity: 1, unitPrice: 55, totalPrice: 55, assignedUserIds: ["user_rahul", "user_priya", "user_aman"] }
    ],
    participants: [
      { userId: "user_rahul", shareAmount: 385, isPaid: true },
      // Rahul paid entire 1155, his share is 385
      { userId: "user_aman", shareAmount: 385, isPaid: false },
      { userId: "user_priya", shareAmount: 385, isPaid: false }
    ],
    createdAt: "2026-02-20T19:30:00.000Z"
  },
  {
    id: "exp_2",
    groupId: "grp_cse_3rd",
    groupName: "\u{1F393} CSE 3rd Year (Batch 2026)",
    title: "Operating Systems Xerox & Lab Manuals",
    description: "Spiral bound xerox copies for batch",
    amount: 850,
    category: "Education",
    date: "2026-02-22",
    paidBy: "user_priya",
    createdBy: "user_priya",
    source: "manual",
    splitMethod: "equal",
    participants: [
      { userId: "user_rahul", shareAmount: 170, isPaid: false },
      { userId: "user_priya", shareAmount: 170, isPaid: true },
      { userId: "user_aman", shareAmount: 170, isPaid: false },
      { userId: "user_neha", shareAmount: 170, isPaid: false },
      { userId: "user_rohan", shareAmount: 170, isPaid: false }
    ],
    createdAt: "2026-02-22T11:15:00.000Z"
  },
  {
    id: "exp_3",
    groupId: "grp_hostel_204",
    groupName: "\u{1F3E0} Hostel Room 204 & Block A",
    title: "Midnight Grocery & Maggi Packet Box",
    description: "Bulk buy from Supermarket for night study sessions",
    amount: 1420,
    category: "Hostel",
    date: "2026-02-23",
    paidBy: "user_aman",
    createdBy: "user_aman",
    source: "ocr",
    splitMethod: "equal",
    participants: [
      { userId: "user_aman", shareAmount: 355, isPaid: true },
      { userId: "user_rahul", shareAmount: 355, isPaid: false },
      { userId: "user_rohan", shareAmount: 355, isPaid: false },
      { userId: "user_priya", shareAmount: 355, isPaid: false }
    ],
    createdAt: "2026-02-23T23:45:00.000Z"
  },
  {
    id: "exp_4",
    groupId: "grp_project_alpha",
    groupName: "\u{1F4BB} Project Team Alpha - AI Bot",
    title: "Cloud GPU Server & Domain Registration",
    description: "Runpod GPU hours and domain name for college evaluation",
    amount: 1800,
    category: "Education",
    date: "2026-02-24",
    paidBy: "user_rahul",
    createdBy: "user_rahul",
    source: "manual",
    splitMethod: "percentage",
    participants: [
      { userId: "user_rahul", shareAmount: 600, percentage: 33.33, isPaid: true },
      { userId: "user_neha", shareAmount: 600, percentage: 33.33, isPaid: false },
      { userId: "user_aman", shareAmount: 600, percentage: 33.34, isPaid: false }
    ],
    createdAt: "2026-02-24T14:10:00.000Z"
  },
  {
    id: "exp_5",
    groupId: "grp_cse_3rd",
    groupName: "\u{1F393} CSE 3rd Year (Batch 2026)",
    title: "Campus Canteen Chai & Samosa Break",
    description: "Evening tea with team after classes",
    amount: 320,
    category: "Food",
    date: "2026-02-25",
    paidBy: "user_rahul",
    createdBy: "user_rahul",
    source: "manual",
    splitMethod: "equal",
    participants: [
      { userId: "user_rahul", shareAmount: 80, isPaid: true },
      { userId: "user_priya", shareAmount: 80, isPaid: false },
      { userId: "user_aman", shareAmount: 80, isPaid: false },
      { userId: "user_neha", shareAmount: 80, isPaid: false }
    ],
    createdAt: "2026-02-25T17:00:00.000Z"
  }
];
var initialSettlements = [
  {
    id: "set_1",
    groupId: "grp_cse_3rd",
    fromUserId: "user_aman",
    toUserId: "user_rahul",
    amount: 300,
    status: "completed",
    paymentMethod: "money_exchange",
    payerAgreed: true,
    receiverAgreed: true,
    completedAt: "2026-02-21T10:05:00.000Z",
    note: "Settled for Domino\u2019s Pizza part payment",
    createdAt: "2026-02-21T10:00:00.000Z",
    paidAt: "2026-02-21T10:05:00.000Z"
  }
];
var initialActivities = [
  {
    id: "act_1",
    groupId: "grp_cse_3rd",
    userId: "user_rahul",
    type: "expense_added",
    content: "added \u20B91,155 for Pizza & Garlic Bread Treat @ Domino\u2019s",
    amount: 1155,
    createdAt: "2026-02-20T19:30:00.000Z"
  },
  {
    id: "act_2",
    groupId: "grp_cse_3rd",
    userId: "user_aman",
    type: "settlement_made",
    content: "settled \u20B9300 with Rahul via UPI",
    amount: 300,
    createdAt: "2026-02-21T10:05:00.000Z"
  },
  {
    id: "act_3",
    groupId: "grp_cse_3rd",
    userId: "user_priya",
    type: "expense_added",
    content: "added \u20B9850 for Operating Systems Xerox & Lab Manuals",
    amount: 850,
    createdAt: "2026-02-22T11:15:00.000Z"
  },
  {
    id: "act_4",
    groupId: "grp_hostel_204",
    userId: "user_aman",
    type: "expense_added",
    content: "scanned receipt & added \u20B91,420 for Midnight Grocery",
    amount: 1420,
    createdAt: "2026-02-23T23:45:00.000Z"
  },
  {
    id: "act_5",
    groupId: "grp_project_alpha",
    userId: "user_rahul",
    type: "expense_added",
    content: "added \u20B91,800 for Cloud GPU Server & Domain",
    amount: 1800,
    createdAt: "2026-02-24T14:10:00.000Z"
  },
  {
    id: "act_6",
    groupId: "grp_cse_3rd",
    userId: "user_rahul",
    type: "expense_added",
    content: "added \u20B9320 for Campus Canteen Chai & Samosa Break",
    amount: 320,
    createdAt: "2026-02-25T17:00:00.000Z"
  }
];
var initialNotifications = [
  {
    id: "notif_1",
    userId: "user_rahul",
    type: "payment_reminder",
    title: "Payment Reminder from Priya",
    message: "Priya sent a friendly reminder for \u20B9170 (OS Xerox)",
    read: false,
    data: { amount: 170, fromUserId: "user_priya", groupId: "grp_cse_3rd" },
    createdAt: "2026-02-24T09:00:00.000Z"
  },
  {
    id: "notif_2",
    userId: "user_rahul",
    type: "new_expense",
    title: "New Expense in Hostel 204",
    message: "Aman added \u20B91,420 for Midnight Grocery. Your share: \u20B9355",
    read: false,
    data: { amount: 1420, yourShare: 355, groupId: "grp_hostel_204" },
    createdAt: "2026-02-23T23:45:00.000Z"
  },
  {
    id: "notif_3",
    userId: "user_rahul",
    type: "settlement_confirmed",
    title: "Settlement Confirmed \u{1F389}",
    message: "Aman paid \u20B9300 via UPI for Domino\u2019s Pizza",
    read: true,
    data: { amount: 300, fromUserId: "user_aman" },
    createdAt: "2026-02-21T10:05:00.000Z"
  }
];
var DatabaseStore = class {
  // Default active student
  constructor() {
    this.users = [...initialUsers];
    this.groups = [...initialGroups];
    this.groupMembers = [...initialGroupMembers];
    this.expenses = [...initialExpenses];
    this.settlements = [...initialSettlements];
    this.reminders = [];
    this.notifications = [...initialNotifications];
    this.activities = [...initialActivities];
    this.currentUserId = "user_rahul";
    this.hydrateRelations();
  }
  hydrateRelations() {
  }
  // Current User Management
  getCurrentUser() {
    const u = this.users.find((user) => user.id === this.currentUserId);
    return u || this.users[0];
  }
  setCurrentUser(userId) {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.currentUserId = user.id;
      return user;
    }
    return null;
  }
  // Google Login / Upsert User
  loginWithGoogle(payload) {
    let existing = this.users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (existing) {
      if (payload.avatarUrl) existing.avatarUrl = payload.avatarUrl;
      if (payload.name) existing.name = payload.name;
      this.currentUserId = existing.id;
      return existing;
    }
    const username = (payload.name || payload.email.split("@")[0]).toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 15) + Math.floor(100 + Math.random() * 900);
    const newUser = {
      id: `user_${Date.now()}`,
      googleId: payload.googleId || `google_${Date.now()}`,
      name: payload.name || "New Student",
      username,
      email: payload.email,
      avatarUrl: payload.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      institution: "",
      course: "",
      year: "",
      yearOfStudy: "",
      city: "",
      address: "",
      phone: "",
      upiId: "",
      bio: "",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.users.push(newUser);
    this.currentUserId = newUser.id;
    const publicGroup = this.groups[0];
    if (publicGroup) {
      this.groupMembers.push({
        id: `gm_${Date.now()}`,
        groupId: publicGroup.id,
        userId: newUser.id,
        role: "member",
        status: "active",
        joinedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      publicGroup.memberCount += 1;
    }
    return newUser;
  }
  updateUserProfile(userId, updates) {
    const index = this.users.findIndex((u) => u.id === userId);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }
  getUser(userId) {
    return this.users.find((u) => u.id === userId);
  }
  getAllUsers() {
    return this.users;
  }
  // Groups
  getGroupsForUser(userId) {
    const userMemberships = this.groupMembers.filter((gm) => gm.userId === userId && gm.status === "active");
    return userMemberships.map((membership) => {
      const group = this.groups.find((g) => g.id === membership.groupId);
      if (!group) return null;
      const debts = this.calculateGroupDebts(group.id);
      let balance = 0;
      debts.forEach((debt) => {
        if (debt.toUserId === userId) balance += debt.amount;
        if (debt.fromUserId === userId) balance -= debt.amount;
      });
      return {
        ...group,
        role: membership.role,
        myBalance: balance
      };
    }).filter(Boolean);
  }
  getPublicGroups(query) {
    let list = this.groups.filter((g) => g.privacy === "public");
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (g) => g.name.toLowerCase().includes(q) || g.institution.toLowerCase().includes(q) || g.city.toLowerCase().includes(q) || g.category.toLowerCase().includes(q) || g.groupCode.toLowerCase().includes(q)
      );
    }
    return list;
  }
  getGroupById(groupId) {
    const group = this.groups.find((g) => g.id === groupId);
    if (!group) return null;
    const members = this.groupMembers.filter((gm) => gm.groupId === groupId && gm.status === "active").map((gm) => ({
      ...gm,
      user: this.getUser(gm.userId)
    }));
    const expenses = this.expenses.filter((e) => e.groupId === groupId).map((e) => ({
      ...e,
      paidByUser: this.getUser(e.paidBy)
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const activities = this.activities.filter((a) => a.groupId === groupId).map((a) => {
      const u = this.getUser(a.userId);
      return {
        ...a,
        user: u ? { id: u.id, name: u.name, avatarUrl: u.avatarUrl, username: u.username } : void 0
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return {
      ...group,
      members,
      expenses,
      activities
    };
  }
  createGroup(data) {
    const groupCode = this.generateUniqueGroupCode(data.name);
    const newGroup = {
      id: `grp_${Date.now()}`,
      name: data.name,
      description: data.description || "",
      groupCode,
      category: data.category || "college",
      institution: data.institution || "Delhi Technological University",
      city: data.city || "New Delhi",
      privacy: data.privacy || "public",
      imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80",
      ownerId: data.ownerId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      memberCount: 1
    };
    this.groups.unshift(newGroup);
    this.groupMembers.push({
      id: `gm_${Date.now()}`,
      groupId: newGroup.id,
      userId: data.ownerId,
      role: "owner",
      status: "active",
      joinedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    const owner = this.getUser(data.ownerId);
    this.activities.unshift({
      id: `act_${Date.now()}`,
      groupId: newGroup.id,
      userId: data.ownerId,
      type: "member_joined",
      content: `created the group "${newGroup.name}" with code ${groupCode}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      user: owner ? { id: owner.id, name: owner.name, avatarUrl: owner.avatarUrl, username: owner.username } : void 0
    });
    return newGroup;
  }
  joinGroupByCode(groupCode, userId) {
    const cleanCode = groupCode.trim().toUpperCase();
    const group = this.groups.find((g) => g.groupCode.toUpperCase() === cleanCode);
    if (!group) {
      return { success: false, message: "Invalid group code. Please check and try again." };
    }
    const existingMember = this.groupMembers.find((gm) => gm.groupId === group.id && gm.userId === userId);
    if (existingMember && existingMember.status === "active") {
      return { success: false, message: `You are already a member of ${group.name}.`, group };
    }
    if (existingMember && existingMember.status === "pending") {
      existingMember.status = "active";
    } else {
      this.groupMembers.push({
        id: `gm_${Date.now()}`,
        groupId: group.id,
        userId,
        role: "member",
        status: "active",
        joinedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      group.memberCount += 1;
    }
    const user = this.getUser(userId);
    this.activities.unshift({
      id: `act_${Date.now()}`,
      groupId: group.id,
      userId,
      type: "member_joined",
      content: `${user?.name || "A student"} joined the group using group code \u{1F389}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId,
      type: "group_joined",
      title: "Joined Group \u{1F389}",
      message: `You successfully joined ${group.name}!`,
      read: false,
      data: { groupId: group.id },
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return { success: true, message: `Successfully joined ${group.name}!`, group };
  }
  regenerateGroupCode(groupId, userId) {
    const group = this.groups.find((g) => g.id === groupId);
    if (!group) return null;
    const member = this.groupMembers.find((gm) => gm.groupId === groupId && gm.userId === userId);
    if (!member || member.role !== "owner" && member.role !== "admin") {
      return null;
    }
    const newCode = this.generateUniqueGroupCode(group.name);
    group.groupCode = newCode;
    this.activities.unshift({
      id: `act_${Date.now()}`,
      groupId: group.id,
      userId,
      type: "code_regenerated",
      content: `regenerated the group code to ${newCode}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return newCode;
  }
  generateUniqueGroupCode(name) {
    const prefix = name.replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase() || "GRP";
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    let code = `${prefix}${rand}`;
    while (this.groups.some((g) => g.groupCode === code)) {
      code = `${prefix}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    }
    return code;
  }
  // Expense Management
  addExpense(data) {
    const totalAmount = Math.round(Number(data.amount) * 100) / 100;
    const group = data.groupId ? this.groups.find((g) => g.id === data.groupId) : void 0;
    let finalParticipants = [];
    if (data.splitMethod === "equal") {
      const count = data.participants.length || 1;
      const baseShare = Math.floor(totalAmount / count * 100) / 100;
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
    } else if (data.splitMethod === "percentage") {
      let sumShares = 0;
      finalParticipants = data.participants.map((p, idx) => {
        const pct = p.percentage || 100 / data.participants.length;
        let share = Math.round(totalAmount * (pct / 100) * 100) / 100;
        sumShares += share;
        return {
          userId: p.userId,
          shareAmount: share,
          percentage: pct,
          isPaid: p.userId === data.paidBy
        };
      });
      const diff = Math.round((totalAmount - sumShares) * 100) / 100;
      if (diff !== 0 && finalParticipants.length > 0) {
        finalParticipants[0].shareAmount = Math.round((finalParticipants[0].shareAmount + diff) * 100) / 100;
      }
    } else if (data.splitMethod === "exact") {
      finalParticipants = data.participants.map((p) => ({
        userId: p.userId,
        shareAmount: Math.round(Number(p.exactAmount || p.shareAmount || 0) * 100) / 100,
        exactAmount: p.exactAmount,
        isPaid: p.userId === data.paidBy
      }));
    } else if (data.splitMethod === "item_based" && data.items && data.items.length > 0) {
      const userShareMap = {};
      data.participants.forEach((p) => userShareMap[p.userId] = 0);
      let itemsTotal = 0;
      data.items.forEach((item) => {
        const itemPrice = Math.round(Number(item.totalPrice || item.quantity * item.unitPrice) * 100) / 100;
        itemsTotal += itemPrice;
        const assigned = item.assignedUserIds && item.assignedUserIds.length > 0 ? item.assignedUserIds : data.participants.map((p) => p.userId);
        const splitPerPerson = itemPrice / assigned.length;
        assigned.forEach((uId) => {
          if (userShareMap[uId] !== void 0) {
            userShareMap[uId] += splitPerPerson;
          } else {
            userShareMap[uId] = splitPerPerson;
          }
        });
      });
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
      finalParticipants = data.participants.map((p) => ({
        userId: p.userId,
        shareAmount: Math.round(totalAmount / data.participants.length * 100) / 100,
        isPaid: p.userId === data.paidBy
      }));
    }
    const newExpense = {
      id: `exp_${Date.now()}`,
      groupId: data.groupId,
      groupName: group?.name || "Personal / General",
      title: data.title,
      description: data.description,
      amount: totalAmount,
      category: data.category || "Food",
      date: data.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      paidBy: data.paidBy,
      createdBy: data.createdBy,
      source: data.source || "manual",
      splitMethod: data.splitMethod,
      items: data.items,
      participants: finalParticipants,
      receiptUrl: data.receiptUrl,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.expenses.unshift(newExpense);
    if (data.groupId) {
      const payer = this.getUser(data.paidBy);
      this.activities.unshift({
        id: `act_${Date.now()}`,
        groupId: data.groupId,
        userId: data.paidBy,
        type: "expense_added",
        content: `${data.source === "ocr" ? "scanned receipt & " : ""}added \u20B9${totalAmount.toLocaleString("en-IN")} for "${data.title}"`,
        amount: totalAmount,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        user: payer ? { id: payer.id, name: payer.name, avatarUrl: payer.avatarUrl, username: payer.username } : void 0
      });
      finalParticipants.forEach((p) => {
        if (p.userId !== data.paidBy) {
          this.notifications.unshift({
            id: `notif_${Date.now()}_${p.userId}`,
            userId: p.userId,
            type: "new_expense",
            title: `New Expense in ${group?.name || "Group"}`,
            message: `${payer?.name || "Someone"} added \u20B9${totalAmount.toLocaleString("en-IN")} for ${data.title}. Your share: \u20B9${p.shareAmount.toLocaleString("en-IN")}`,
            read: false,
            data: { expenseId: newExpense.id, groupId: data.groupId, shareAmount: p.shareAmount },
            createdAt: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      });
    }
    return newExpense;
  }
  deleteExpense(expenseId, userId) {
    const idx = this.expenses.findIndex((e) => e.id === expenseId);
    if (idx === -1) return false;
    const exp = this.expenses[idx];
    if (exp.createdBy !== userId && exp.paidBy !== userId) {
      return false;
    }
    this.expenses.splice(idx, 1);
    return true;
  }
  // Debt Simplification Matrix & Settlements
  calculateGroupDebts(groupId) {
    const relevantExpenses = groupId ? this.expenses.filter((e) => e.groupId === groupId) : this.expenses;
    const relevantSettlements = (groupId ? this.settlements.filter((s) => s.groupId === groupId) : this.settlements).filter((s) => s.status === "completed");
    const netBalance = {};
    relevantExpenses.forEach((exp) => {
      netBalance[exp.paidBy] = (netBalance[exp.paidBy] || 0) + exp.amount;
      exp.participants.forEach((p) => {
        netBalance[p.userId] = (netBalance[p.userId] || 0) - p.shareAmount;
      });
    });
    relevantSettlements.forEach((set) => {
      netBalance[set.fromUserId] = (netBalance[set.fromUserId] || 0) + set.amount;
      netBalance[set.toUserId] = (netBalance[set.toUserId] || 0) - set.amount;
    });
    const debtors = [];
    const creditors = [];
    Object.keys(netBalance).forEach((userId) => {
      const bal = Math.round(netBalance[userId] * 100) / 100;
      if (bal < -0.5) {
        debtors.push({ userId, amount: -bal });
      } else if (bal > 0.5) {
        creditors.push({ userId, amount: bal });
      }
    });
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);
    const simplifiedDebts = [];
    let i = 0;
    let j = 0;
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
  recordSettlement(data) {
    const isCompleted = data.status === "completed" || data.payerAgreed && data.receiverAgreed;
    const newSettlement = {
      id: `set_${Date.now()}`,
      groupId: data.groupId,
      fromUserId: data.fromUserId,
      toUserId: data.toUserId,
      amount: Math.round(Number(data.amount) * 100) / 100,
      paymentMethod: data.paymentMethod || "money_exchange",
      status: isCompleted ? "completed" : data.status || "awaiting_receiver",
      payerAgreed: data.payerAgreed ?? true,
      receiverAgreed: data.receiverAgreed ?? false,
      completedAt: isCompleted ? (/* @__PURE__ */ new Date()).toISOString() : void 0,
      note: data.note || "Settled via SmartSplitMate Mutual Honesty Agreement",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      paidAt: isCompleted ? (/* @__PURE__ */ new Date()).toISOString() : void 0,
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
        type: "settlement_made",
        content: `${isCompleted ? "settled" : "initiated honesty exchange of"} \u20B9${data.amount.toLocaleString("en-IN")} with ${toUser?.name || "member"}`,
        amount: data.amount,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        user: fromUser ? { id: fromUser.id, name: fromUser.name, avatarUrl: fromUser.avatarUrl, username: fromUser.username } : void 0
      });
    }
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: data.toUserId,
      type: data.status === "completed" ? "settlement_confirmed" : "settlement_initiated",
      title: data.status === "completed" ? "Payment Settled \u{1F389}" : "Payment Initiated",
      message: `${fromUser?.name || "Someone"} ${data.status === "completed" ? "settled" : "initiated a payment of"} \u20B9${data.amount.toLocaleString("en-IN")} via ${data.paymentMethod.toUpperCase()}`,
      read: false,
      data: { settlementId: newSettlement.id, fromUserId: data.fromUserId, amount: data.amount },
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return newSettlement;
  }
  confirmSettlement(settlementId, userId) {
    const set = this.settlements.find((s) => s.id === settlementId);
    if (!set) return false;
    if (set.toUserId !== userId && set.fromUserId !== userId) return false;
    set.status = "completed";
    set.paidAt = (/* @__PURE__ */ new Date()).toISOString();
    const fromUser = this.getUser(set.fromUserId);
    const toUser = this.getUser(set.toUserId);
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: set.fromUserId,
      type: "settlement_confirmed",
      title: "Settlement Confirmed \u2705",
      message: `${toUser?.name || "Recipient"} confirmed receiving \u20B9${set.amount.toLocaleString("en-IN")}`,
      read: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return true;
  }
  // Payment Reminders with Cooldown
  sendPaymentReminder(data) {
    const existing = this.reminders.find(
      (r) => r.senderId === data.senderId && r.receiverId === data.receiverId && new Date(r.cooldownUntil).getTime() > Date.now()
    );
    if (existing) {
      const waitMins = Math.ceil((new Date(existing.cooldownUntil).getTime() - Date.now()) / 6e4);
      return {
        success: false,
        message: `Please wait ${waitMins} minute${waitMins > 1 ? "s" : ""} before sending another reminder to this member.`
      };
    }
    const cooldownUntil = new Date(Date.now() + 5 * 60 * 1e3).toISOString();
    const reminder = {
      id: `rem_${Date.now()}`,
      settlementId: data.settlementId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      amount: data.amount,
      note: data.note,
      sentAt: (/* @__PURE__ */ new Date()).toISOString(),
      cooldownUntil,
      status: "sent",
      sender: this.getUser(data.senderId),
      receiver: this.getUser(data.receiverId)
    };
    this.reminders.unshift(reminder);
    const sender = this.getUser(data.senderId);
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: data.receiverId,
      type: "payment_reminder",
      title: `Payment Reminder from ${sender?.name || "a friend"} \u{1F514}`,
      message: `${sender?.name || "Someone"} sent a reminder for pending payment of \u20B9${data.amount.toLocaleString("en-IN")}. ${data.note || ""}`,
      read: false,
      data: { reminderId: reminder.id, senderId: data.senderId, amount: data.amount },
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    return { success: true, message: "Friendly payment reminder sent successfully!", reminder };
  }
  // Financial Summary for Dashboard
  getUserFinancialSummary(userId) {
    let totalSpending = 0;
    let youPaid = 0;
    let todaySpending = 0;
    let weekSpending = 0;
    let monthSpending = 0;
    const now = /* @__PURE__ */ new Date();
    const todayStr = now.toISOString().split("T")[0];
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const categoryMap = {
      Food: 0,
      Transport: 0,
      Education: 0,
      Shopping: 0,
      Entertainment: 0,
      Hostel: 0,
      Other: 0
    };
    const monthlyMap = {};
    this.expenses.forEach((exp) => {
      const expDate = new Date(exp.date);
      const isThisMonth = expDate >= startOfMonth;
      const isThisWeek = expDate >= sevenDaysAgo;
      const isToday = exp.date === todayStr;
      const part = exp.participants.find((p) => p.userId === userId);
      if (part) {
        totalSpending += part.shareAmount;
        categoryMap[exp.category] = (categoryMap[exp.category] || 0) + part.shareAmount;
        if (isToday) todaySpending += part.shareAmount;
        if (isThisWeek) weekSpending += part.shareAmount;
        if (isThisMonth) monthSpending += part.shareAmount;
        const monthName = expDate.toLocaleString("default", { month: "short" });
        monthlyMap[monthName] = (monthlyMap[monthName] || 0) + part.shareAmount;
      }
      if (exp.paidBy === userId) {
        youPaid += exp.amount;
      }
    });
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
      percentage: totalSpending > 0 ? Math.round(categoryMap[cat] / totalSpending * 100) : 0
    }));
    const monthlyTrends = Object.keys(monthlyMap).map((m) => ({
      month: m,
      amount: monthlyMap[m]
    }));
    if (monthlyTrends.length < 3) {
      monthlyTrends.unshift(
        { month: "Dec", amount: 3200 },
        { month: "Jan", amount: 4850 }
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
  getNotificationsForUser(userId) {
    return this.notifications.filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  markNotificationAsRead(id, userId) {
    const notif = this.notifications.find((n) => n.id === id && n.userId === userId);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }
  markAllNotificationsAsRead(userId) {
    this.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    return true;
  }
};
var db = new DatabaseStore();

// server/ocr.ts
var import_genai = require("@google/genai");
var sampleReceiptTemplates = {
  cafe: {
    merchantName: "Campus Bistro & Cafe",
    date: "2026-02-25",
    receiptNumber: "CBC-9402",
    category: "Food",
    currency: "INR",
    items: [
      { id: "it_c1", name: "Paneer Tikka Sandwich", quantity: 2, unitPrice: 160, totalPrice: 320, confidence: "high", assignedUserIds: [] },
      { id: "it_c2", name: "Iced Caramel Frappe", quantity: 2, unitPrice: 140, totalPrice: 280, confidence: "high", assignedUserIds: [] },
      { id: "it_c3", name: "Peri-Peri French Fries Large", quantity: 1, unitPrice: 150, totalPrice: 150, confidence: "high", assignedUserIds: [] },
      { id: "it_c4", name: "Chocolate Brownie with Ice Cream", quantity: 1, unitPrice: 120, totalPrice: 120, confidence: "high", assignedUserIds: [] }
    ],
    subtotal: 870,
    discount: 50,
    tax: 41,
    serviceCharge: 0,
    roundOff: 0,
    total: 861,
    confidenceOverall: "high",
    rawText: "CAMPUS BISTRO & CAFE\nBill No: CBC-9402  Date: 25-02-2026\nPaneer Tikka Sandwich x2 = 320.00\nIced Caramel Frappe x2 = 280.00\nPeri-Peri Fries Large x1 = 150.00\nChoco Brownie Sundae x1 = 120.00\nSubtotal: 870.00\nDiscount: -50.00\nGST 5%: 41.00\nGrand Total: INR 861.00\nThank You Visit Again!",
    isAiParsed: true,
    modelUsed: "gemini-3.7-flash"
  },
  groceries: {
    merchantName: "Hostel Mart & Supermarket",
    date: "2026-02-24",
    receiptNumber: "HM-88124",
    category: "Hostel",
    currency: "INR",
    items: [
      { id: "it_g1", name: "Maggi 2-Minute Noodles (12-Pack)", quantity: 2, unitPrice: 168, totalPrice: 336, confidence: "high", assignedUserIds: [] },
      { id: "it_g2", name: "Amul Taaza Milk 1L (x3)", quantity: 3, unitPrice: 68, totalPrice: 204, confidence: "high", assignedUserIds: [] },
      { id: "it_g3", name: "Nescafe Classic Jar 100g", quantity: 1, unitPrice: 295, totalPrice: 295, confidence: "high", assignedUserIds: [] },
      { id: "it_g4", name: "Lays & Kurkure Combo Pack", quantity: 4, unitPrice: 40, totalPrice: 160, confidence: "high", assignedUserIds: [] },
      { id: "it_g5", name: "Britannia Good Day Cookies (x4)", quantity: 4, unitPrice: 35, totalPrice: 140, confidence: "high", assignedUserIds: [] },
      { id: "it_g6", name: "Handwash & Room Spray", quantity: 1, unitPrice: 215, totalPrice: 215, confidence: "medium", assignedUserIds: [] }
    ],
    subtotal: 1350,
    discount: 30,
    tax: 0,
    serviceCharge: 0,
    roundOff: 0,
    total: 1320,
    confidenceOverall: "high",
    rawText: "HOSTEL MART & SUPERMARKET\nInv #HM-88124  24-Feb-2026\nMaggi 12pk x2 336\nAmul Milk 1L x3 204\nNescafe 100g 295\nSnacks Combo x4 160\nBiscuits Pack x4 140\nRoom Sanitizer & Spray 215\nTotal Items: 6\nDiscount: 30\nNET AMOUNT: Rs. 1,320.00",
    isAiParsed: true,
    modelUsed: "gemini-3.7-flash"
  },
  stationery: {
    merchantName: "Sri Balaji University Xerox & Book Depot",
    date: "2026-02-23",
    receiptNumber: "SBU-3109",
    category: "Education",
    currency: "INR",
    items: [
      { id: "it_s1", name: "Engineering Drawing Spiral Notes", quantity: 3, unitPrice: 180, totalPrice: 540, confidence: "high", assignedUserIds: [] },
      { id: "it_s2", name: "Lab Practical Record Books (x4)", quantity: 4, unitPrice: 95, totalPrice: 380, confidence: "high", assignedUserIds: [] },
      { id: "it_s3", name: "Color A3 Project Prints (x15)", quantity: 15, unitPrice: 20, totalPrice: 300, confidence: "high", assignedUserIds: [] },
      { id: "it_s4", name: "Binder Clips & Hardboard files", quantity: 2, unitPrice: 65, totalPrice: 130, confidence: "medium", assignedUserIds: [] }
    ],
    subtotal: 1350,
    discount: 50,
    tax: 0,
    serviceCharge: 0,
    roundOff: 0,
    total: 1300,
    confidenceOverall: "high",
    rawText: "SRI BALAJI UNIVERSITY XEROX\n23/02/2026\nEngg Notes Spiral x3: 540\nLab Record x4: 380\nColor A3 Prints x15: 300\nStationery Binder: 130\nTotal: 1350. Disc: 50. Total: Rs 1300",
    isAiParsed: true,
    modelUsed: "gemini-3.7-flash"
  }
};
var genAIClient = null;
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return genAIClient;
}
async function parseReceiptWithGemini(base64Image, mimeType = "image/jpeg", sampleKey) {
  if (sampleKey && sampleReceiptTemplates[sampleKey]) {
    return JSON.parse(JSON.stringify(sampleReceiptTemplates[sampleKey]));
  }
  if (!base64Image) {
    throw new Error("No receipt image data provided for OCR analysis.");
  }
  const ai = getGenAI();
  if (!ai) {
    console.warn("GEMINI_API_KEY not set in environment. Returning smart fallback.");
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return {
      merchantName: "Scanned Bill",
      date: todayStr,
      receiptNumber: `REC-${Date.now().toString().slice(-4)}`,
      category: "Food",
      currency: "INR",
      items: [
        {
          id: `ocr_it_${Date.now()}_0`,
          name: "Scanned Receipt Item",
          quantity: 1,
          unitPrice: 150,
          totalPrice: 150,
          confidence: "medium",
          assignedUserIds: []
        }
      ],
      subtotal: 150,
      discount: 0,
      tax: 0,
      serviceCharge: 0,
      roundOff: 0,
      total: 150,
      confidenceOverall: "medium",
      rawText: "Scanned Bill Photo\nDate: " + todayStr + "\nTotal: \u20B9150.00\n(Configure GEMINI_API_KEY in Settings > Secrets for AI Vision)",
      isAiParsed: false,
      modelUsed: "Smart Fallback"
    };
  }
  try {
    let cleanBase64 = base64Image.trim();
    if (cleanBase64.includes("base64,")) {
      const parts = cleanBase64.split("base64,");
      const match = parts[0].match(/data:(.*?);/);
      if (match && match[1]) {
        mimeType = match[1];
      }
      cleanBase64 = parts[1];
    }
    cleanBase64 = cleanBase64.replace(/\s+/g, "");
    if (mimeType === "image/jpg") {
      mimeType = "image/jpeg";
    }
    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: cleanBase64
      }
    };
    const promptText = `Analyze this receipt or image. Extract each product/item name and its exact numerical price. Output ONLY structured JSON containing an array of these items.`;
    let response;
    let modelUsed = "gemini-2.5-flash";
    const systemInstruction = "You are an OCR data extractor. Output ONLY JSON. Extract the product names and their prices from the image.";
    const responseSchema = {
      type: import_genai.Type.OBJECT,
      properties: {
        items: {
          type: import_genai.Type.ARRAY,
          description: "List of all extracted items and their prices",
          items: {
            type: import_genai.Type.OBJECT,
            properties: {
              name: { type: import_genai.Type.STRING, description: "Product or item name" },
              price: { type: import_genai.Type.NUMBER, description: "Exact numerical price" }
            },
            required: ["name", "price"]
          }
        }
      },
      required: ["items"]
    };
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          imagePart,
          { text: promptText }
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema
        }
      });
    } catch (primaryErr) {
      console.warn("gemini-2.5-flash call failed, attempting gemini-3.7-flash:", primaryErr.message);
      modelUsed = "gemini-3.7-flash";
      response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          imagePart,
          { text: promptText }
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema
        }
      });
    }
    const rawOutput = response?.text?.trim() || "{}";
    let cleanJson = rawOutput;
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }
    let parsedJson = {};
    try {
      parsedJson = JSON.parse(cleanJson);
    } catch (parseErr) {
      const match = cleanJson.match(/\{[\s\S]*\}/);
      if (match) {
        parsedJson = JSON.parse(match[0]);
      } else {
        throw new Error(`Failed to parse OCR response: ${cleanJson.slice(0, 120)}`);
      }
    }
    let rawItems = Array.isArray(parsedJson.items) ? parsedJson.items : [];
    const items = rawItems.map((item, idx) => {
      const price = Math.round(Number(item.price || 0) * 100) / 100;
      return {
        id: `ocr_it_${Date.now()}_${idx}`,
        name: String(item.name || `Item ${idx + 1}`).trim(),
        quantity: 1,
        unitPrice: price,
        totalPrice: price,
        confidence: "high",
        assignedUserIds: []
      };
    });
    const itemsSum = items.reduce((acc, cur) => acc + (cur.totalPrice || 0), 0);
    const subtotal = Math.round(itemsSum * 100) / 100;
    const discount = 0;
    const tax = 0;
    const serviceCharge = 0;
    const roundOff = 0;
    const total = subtotal;
    const category = "Other";
    const result = {
      merchantName: "",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      receiptNumber: `REC-${Math.floor(1e3 + Math.random() * 9e3)}`,
      category,
      currency: "INR",
      items,
      subtotal,
      discount,
      tax,
      serviceCharge,
      roundOff,
      total,
      confidenceOverall: "high",
      rawText: "Simple Table Parsing Mode",
      isAiParsed: true,
      modelUsed
    };
    return result;
  } catch (err) {
    console.error("Gemini Multimodal OCR Error:", err);
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return {
      merchantName: "Receipt Expense",
      date: todayStr,
      receiptNumber: `REC-${Date.now().toString().slice(-4)}`,
      category: "Food",
      currency: "INR",
      items: [
        {
          id: `ocr_it_${Date.now()}_0`,
          name: "Scanned Bill Item",
          quantity: 1,
          unitPrice: 100,
          totalPrice: 100,
          confidence: "medium",
          assignedUserIds: []
        }
      ],
      subtotal: 100,
      discount: 0,
      tax: 0,
      serviceCharge: 0,
      roundOff: 0,
      total: 100,
      confidenceOverall: "medium",
      rawText: "Scanned Bill Photo\nDate: " + todayStr + "\nTotal: \u20B9100.00\nNote: " + (err.message || "AI OCR could not fully read receipt text"),
      isAiParsed: false,
      modelUsed: "Fallback Engine"
    };
  }
}

// server.ts
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = process.env.RENDER ? process.env.PORT || 3e3 : 3e3;
  app.use(import_express.default.json({ limit: "25mb" }));
  app.use(import_express.default.urlencoded({ extended: true, limit: "25mb" }));
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", name: "SmartSplitMate API", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.get("/api/auth/me", (req, res) => {
    const user = db.getCurrentUser();
    res.json({ user });
  });
  app.post("/api/auth/switch-user", (req, res) => {
    const { userId } = req.body;
    const user = db.setCurrentUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, user });
  });
  app.post("/api/auth/google-login", (req, res) => {
    const { email, name, avatarUrl, googleId } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const user = db.loginWithGoogle({ email, name, avatarUrl, googleId });
    res.json({ success: true, user });
  });
  app.patch("/api/users/profile", (req, res) => {
    const currentUser = db.getCurrentUser();
    const updated = db.updateUserProfile(currentUser.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, user: updated });
  });
  app.get("/api/users", (req, res) => {
    res.json({ users: db.getAllUsers() });
  });
  app.get("/api/dashboard/summary", (req, res) => {
    const user = db.getCurrentUser();
    const summary = db.getUserFinancialSummary(user.id);
    const myGroups = db.getGroupsForUser(user.id);
    const debts = db.calculateGroupDebts();
    const myDebts = debts.filter((d) => d.fromUserId === user.id || d.toUserId === user.id);
    const recentExpenses = db.expenses.filter((e) => e.paidBy === user.id || e.participants.some((p) => p.userId === user.id)).slice(0, 8).map((e) => ({
      ...e,
      paidByUser: db.getUser(e.paidBy)
    }));
    res.json({
      summary,
      groups: myGroups,
      debts: myDebts,
      recentExpenses,
      currentUser: user
    });
  });
  app.get("/api/groups", (req, res) => {
    const user = db.getCurrentUser();
    const groups = db.getGroupsForUser(user.id);
    res.json({ groups });
  });
  app.get("/api/groups/discover", (req, res) => {
    const query = req.query.q;
    const groups = db.getPublicGroups(query);
    res.json({ groups });
  });
  app.post("/api/groups", (req, res) => {
    const user = db.getCurrentUser();
    const { name, description, category, institution, city, privacy, imageUrl } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Group name is required" });
    }
    const group = db.createGroup({
      name,
      description,
      category,
      institution: institution || user.institution,
      city: city || user.city,
      privacy: privacy || "public",
      imageUrl,
      ownerId: user.id
    });
    res.json({ success: true, group });
  });
  app.post("/api/groups/join-code", (req, res) => {
    const user = db.getCurrentUser();
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: "Group code is required" });
    }
    const result = db.joinGroupByCode(code, user.id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  });
  app.get("/api/groups/:id", (req, res) => {
    const group = db.getGroupById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    const debts = db.calculateGroupDebts(group.id);
    res.json({ group, debts });
  });
  app.post("/api/groups/:id/code/regenerate", (req, res) => {
    const user = db.getCurrentUser();
    const newCode = db.regenerateGroupCode(req.params.id, user.id);
    if (!newCode) {
      return res.status(403).json({ error: "Only group owner or admins can regenerate code" });
    }
    res.json({ success: true, code: newCode });
  });
  app.post("/api/ocr/parse", async (req, res) => {
    try {
      const { imageBase64, mimeType, sampleKey } = req.body;
      if (!imageBase64 && !sampleKey) {
        return res.status(400).json({ error: "Image base64 data or sample key is required" });
      }
      const result = await parseReceiptWithGemini(imageBase64, mimeType || "image/jpeg", sampleKey);
      res.json({ success: true, result });
    } catch (err) {
      console.error("OCR API error:", err);
      res.status(500).json({ error: "Failed to process receipt", details: err.message });
    }
  });
  app.get("/api/ocr/samples", (req, res) => {
    res.json({ success: true, samples: sampleReceiptTemplates });
  });
  app.post("/api/expenses", (req, res) => {
    const user = db.getCurrentUser();
    const {
      groupId,
      title,
      description,
      amount,
      category,
      date,
      paidBy,
      source,
      splitMethod,
      items,
      participants,
      receiptUrl
    } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Expense title is required" });
    }
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Valid expense amount is required" });
    }
    if (!participants || participants.length === 0) {
      return res.status(400).json({ error: "At least one participant is required" });
    }
    const expense = db.addExpense({
      groupId,
      title,
      description,
      amount: Number(amount),
      category: category || "Food",
      date,
      paidBy: paidBy || user.id,
      createdBy: user.id,
      source: source || "manual",
      splitMethod: splitMethod || "equal",
      items,
      participants,
      receiptUrl
    });
    res.json({ success: true, expense });
  });
  app.get("/api/expenses", (req, res) => {
    const user = db.getCurrentUser();
    const { groupId, category, search } = req.query;
    let list = db.expenses;
    if (groupId) {
      list = list.filter((e) => e.groupId === groupId);
    }
    if (category && category !== "all") {
      list = list.filter((e) => e.category === category);
    }
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || e.description && e.description.toLowerCase().includes(q));
    }
    const enriched = list.map((e) => ({
      ...e,
      paidByUser: db.getUser(e.paidBy)
    }));
    res.json({ expenses: enriched });
  });
  app.delete("/api/expenses/:id", (req, res) => {
    const user = db.getCurrentUser();
    const success = db.deleteExpense(req.params.id, user.id);
    if (!success) {
      return res.status(403).json({ error: "Unable to delete expense. Only creator or payer can delete." });
    }
    res.json({ success: true });
  });
  app.get("/api/settlements", (req, res) => {
    res.json({ settlements: db.settlements });
  });
  app.post("/api/settlements", (req, res) => {
    const user = db.getCurrentUser();
    const { groupId, fromUserId, toUserId, amount, paymentMethod, status, note } = req.body;
    if (!toUserId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Recipient and valid amount are required" });
    }
    const settlement = db.recordSettlement({
      groupId,
      fromUserId: fromUserId || user.id,
      toUserId,
      amount: Number(amount),
      paymentMethod: paymentMethod || "upi",
      status: status || "initiated",
      note
    });
    res.json({ success: true, settlement });
  });
  app.post("/api/settlements/:id/confirm", (req, res) => {
    const user = db.getCurrentUser();
    const success = db.confirmSettlement(req.params.id, user.id);
    if (!success) {
      return res.status(400).json({ error: "Unable to confirm settlement." });
    }
    res.json({ success: true });
  });
  app.post("/api/reminders/send", (req, res) => {
    const user = db.getCurrentUser();
    const { receiverId, amount, note, settlementId } = req.body;
    if (!receiverId || !amount) {
      return res.status(400).json({ error: "Receiver and amount are required" });
    }
    const result = db.sendPaymentReminder({
      senderId: user.id,
      receiverId,
      amount: Number(amount),
      note,
      settlementId
    });
    if (!result.success) {
      return res.status(429).json(result);
    }
    res.json(result);
  });
  app.get("/api/notifications", (req, res) => {
    const user = db.getCurrentUser();
    const notifications = db.getNotificationsForUser(user.id);
    res.json({ notifications });
  });
  app.patch("/api/notifications/:id/read", (req, res) => {
    const user = db.getCurrentUser();
    const success = db.markNotificationAsRead(req.params.id, user.id);
    res.json({ success });
  });
  app.patch("/api/notifications/read-all", (req, res) => {
    const user = db.getCurrentUser();
    const success = db.markAllNotificationsAsRead(user.id);
    res.json({ success });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartSplitMate Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
