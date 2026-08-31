const fs = require('fs');
let content = fs.readFileSync('server/db.ts', 'utf-8');

const targetStr = "      // Send notifications to other participants\n      finalParticipants.forEach((p) => {";
const checkStr = `      // --- CHECK MONTHLY SPENDING LIMIT ---
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      finalParticipants.forEach((p) => {
        const u = this.getUser(p.userId);
        if (u && u.monthlyLimits && u.monthlyLimits[data.category] > 0) {
          const limit = u.monthlyLimits[data.category];
          // Calculate existing spending for this month in this category
          let currentSpending = 0;
          this.expenses.forEach(exp => {
            const expDate = new Date(exp.date);
            if (exp.category === data.category && expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
              const pMatch = exp.participants.find(p => p.userId === u.id);
              if (pMatch) currentSpending += pMatch.shareAmount;
              else if (exp.paidBy === u.id) currentSpending += exp.amount;
            }
          });
          
          const totalNewSpending = currentSpending + p.shareAmount;
          
          if (totalNewSpending > limit) {
            this.notifications.unshift({
              id: \`notif_limit_\${Date.now()}_\${u.id}\`,
              userId: u.id,
              type: 'spending_limit_warning' as any,
              title: 'Budget Exceeded 🚨',
              message: \`You have exceeded your monthly limit for \${data.category}. Spent: ₹\${totalNewSpending} / Limit: ₹\${limit}\`,
              read: false,
              createdAt: new Date().toISOString()
            });
          } else if (totalNewSpending >= limit * 0.8) {
            this.notifications.unshift({
              id: \`notif_limit_\${Date.now()}_\${u.id}\`,
              userId: u.id,
              type: 'spending_limit_warning' as any,
              title: 'Approaching Limit ⚠️',
              message: \`You have spent ₹\${totalNewSpending} (80%+) of your ₹\${limit} monthly limit for \${data.category}.\`,
              read: false,
              createdAt: new Date().toISOString()
            });
          }
        }
      });
      // ------------------------------------

      // Send notifications to other participants
      finalParticipants.forEach((p) => {`;

if (!content.includes('CHECK MONTHLY SPENDING LIMIT')) {
  content = content.replace(targetStr, checkStr);
  fs.writeFileSync('server/db.ts', content);
}
