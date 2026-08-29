import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db.js';
import { parseReceiptWithGemini, sampleReceiptTemplates } from './server/ocr.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.RENDER ? (process.env.PORT || 3000) : 3000;

  // Middleware for JSON and large base64 image uploads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // --- API ROUTES ---

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', name: 'SmartSplitMate API', time: new Date().toISOString() });
  });

  // Auth: Current User
  app.get('/api/auth/me', (req, res) => {
    const user = db.getCurrentUser();
    res.json({ user });
  });

  // Auth: Switch User (for testing multi-party splits & UPI payments!)
  app.post('/api/auth/switch-user', (req, res) => {
    const { userId } = req.body;
    const user = db.setCurrentUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user });
  });

  // Auth: Google Login
  app.post('/api/auth/google-login', (req, res) => {
    const { email, name, avatarUrl, googleId } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = db.loginWithGoogle({ email, name, avatarUrl, googleId });
    res.json({ success: true, user });
  });

  // Users: Update Profile
  app.patch('/api/users/profile', (req, res) => {
    const currentUser = db.getCurrentUser();
    const updated = db.updateUserProfile(currentUser.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user: updated });
  });

  // Users: All Users (for group member selection)
  app.get('/api/users', (req, res) => {
    res.json({ users: db.getAllUsers() });
  });

  // Dashboard: Financial Summary & Analytics
  app.get('/api/dashboard/summary', (req, res) => {
    const user = db.getCurrentUser();
    const summary = db.getUserFinancialSummary(user.id);
    const myGroups = db.getGroupsForUser(user.id);
    const debts = db.calculateGroupDebts();
    const myDebts = debts.filter((d) => d.fromUserId === user.id || d.toUserId === user.id);
    const recentExpenses = db.expenses
      .filter((e) => e.paidBy === user.id || e.participants.some((p) => p.userId === user.id))
      .slice(0, 8)
      .map((e) => ({
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

  // Groups: User Groups
  app.get('/api/groups', (req, res) => {
    const user = db.getCurrentUser();
    const groups = db.getGroupsForUser(user.id);
    res.json({ groups });
  });

  // Groups: Public Discovery
  app.get('/api/groups/discover', (req, res) => {
    const query = req.query.q as string | undefined;
    const groups = db.getPublicGroups(query);
    res.json({ groups });
  });

  // Groups: Create
  app.post('/api/groups', (req, res) => {
    const user = db.getCurrentUser();
    const { name, description, category, institution, city, privacy, imageUrl } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Group name is required' });
    }
    const group = db.createGroup({
      name,
      description,
      category,
      institution: institution || user.institution,
      city: city || user.city,
      privacy: privacy || 'public',
      imageUrl,
      ownerId: user.id
    });
    res.json({ success: true, group });
  });

  // Groups: Join via Code
  app.post('/api/groups/join-code', (req, res) => {
    const user = db.getCurrentUser();
    const { code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ error: 'Group code is required' });
    }
    const result = db.joinGroupByCode(code, user.id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.json(result);
  });

  // Groups: Get By ID with Full Details
  app.get('/api/groups/:id', (req, res) => {
    const group = db.getGroupById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    const debts = db.calculateGroupDebts(group.id);
    res.json({ group, debts });
  });

  // Groups: Regenerate Code
  app.post('/api/groups/:id/code/regenerate', (req, res) => {
    const user = db.getCurrentUser();
    const newCode = db.regenerateGroupCode(req.params.id, user.id);
    if (!newCode) {
      return res.status(403).json({ error: 'Only group owner or admins can regenerate code' });
    }
    res.json({ success: true, code: newCode });
  });

  // OCR: Parse Receipt with Multimodal Gemini 3.7 Flash
  app.post('/api/ocr/parse', async (req, res) => {
    try {
      const { imageBase64, mimeType, sampleKey } = req.body;
      if (!imageBase64 && !sampleKey) {
        return res.status(400).json({ error: 'Image base64 data or sample key is required' });
      }
      const result = await parseReceiptWithGemini(imageBase64, mimeType || 'image/jpeg', sampleKey);
      res.json({ success: true, result });
    } catch (err: any) {
      console.error('OCR API error:', err);
      res.status(500).json({ error: 'Failed to process receipt', details: err.message });
    }
  });

  // OCR: Preloaded Realistic Test Samples
  app.get('/api/ocr/samples', (req, res) => {
    res.json({ success: true, samples: sampleReceiptTemplates });
  });

  // Expenses: Add
  app.post('/api/expenses', (req, res) => {
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
      return res.status(400).json({ error: 'Expense title is required' });
    }
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid expense amount is required' });
    }
    if (!participants || participants.length === 0) {
      return res.status(400).json({ error: 'At least one participant is required' });
    }

    const expense = db.addExpense({
      groupId,
      title,
      description,
      amount: Number(amount),
      category: category || 'Food',
      date,
      paidBy: paidBy || user.id,
      createdBy: user.id,
      source: source || 'manual',
      splitMethod: splitMethod || 'equal',
      items,
      participants,
      receiptUrl
    });

    res.json({ success: true, expense });
  });

  // Expenses: List (with filters)
  app.get('/api/expenses', (req, res) => {
    const user = db.getCurrentUser();
    const { groupId, category, search } = req.query;

    let list = db.expenses;
    if (groupId) {
      list = list.filter((e) => e.groupId === groupId);
    }
    if (category && category !== 'all') {
      list = list.filter((e) => e.category === category);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q) || (e.description && e.description.toLowerCase().includes(q)));
    }

    const enriched = list.map((e) => ({
      ...e,
      paidByUser: db.getUser(e.paidBy)
    }));

    res.json({ expenses: enriched });
  });

  // Expenses: Delete
  app.delete('/api/expenses/:id', (req, res) => {
    const user = db.getCurrentUser();
    const success = db.deleteExpense(req.params.id, user.id);
    if (!success) {
      return res.status(403).json({ error: 'Unable to delete expense. Only creator or payer can delete.' });
    }
    res.json({ success: true });
  });

  // Settlements: Get & Record
  app.get('/api/settlements', (req, res) => {
    res.json({ settlements: db.settlements });
  });

  app.post('/api/settlements', (req, res) => {
    const user = db.getCurrentUser();
    const { groupId, fromUserId, toUserId, amount, paymentMethod, status, note } = req.body;
    if (!toUserId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Recipient and valid amount are required' });
    }

    const settlement = db.recordSettlement({
      groupId,
      fromUserId: fromUserId || user.id,
      toUserId,
      amount: Number(amount),
      paymentMethod: paymentMethod || 'upi',
      status: status || 'initiated',
      note
    });

    res.json({ success: true, settlement });
  });

  app.post('/api/settlements/:id/confirm', (req, res) => {
    const user = db.getCurrentUser();
    const success = db.confirmSettlement(req.params.id, user.id);
    if (!success) {
      return res.status(400).json({ error: 'Unable to confirm settlement.' });
    }
    res.json({ success: true });
  });

  // Payment Reminders
  app.post('/api/reminders/send', (req, res) => {
    const user = db.getCurrentUser();
    const { receiverId, amount, note, settlementId } = req.body;
    if (!receiverId || !amount) {
      return res.status(400).json({ error: 'Receiver and amount are required' });
    }

    const result = db.sendPaymentReminder({
      senderId: user.id,
      receiverId,
      amount: Number(amount),
      note,
      settlementId
    });

    if (!result.success) {
      return res.status(429).json(result); // Rate limit cooldown
    }
    res.json(result);
  });

  // Notifications
  app.get('/api/notifications', (req, res) => {
    const user = db.getCurrentUser();
    const notifications = db.getNotificationsForUser(user.id);
    res.json({ notifications });
  });

  app.patch('/api/notifications/:id/read', (req, res) => {
    const user = db.getCurrentUser();
    const success = db.markNotificationAsRead(req.params.id, user.id);
    res.json({ success });
  });

  app.patch('/api/notifications/read-all', (req, res) => {
    const user = db.getCurrentUser();
    const success = db.markAllNotificationsAsRead(user.id);
    res.json({ success });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartSplitMate Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
