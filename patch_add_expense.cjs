const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const checkLimitLogic = `
    setExpenses((prev) => [newExpense, ...prev]);
    showToast(\`Expense of ₹\${newExpense.amount} added! 🧾\`, 'success');

    // --- CHECK MONTHLY SPENDING LIMIT ---
    if (currentUser?.monthlyLimits) {
      const cat = newExpense.category;
      const limit = currentUser.monthlyLimits[cat];
      if (limit > 0) {
        // Find user's share in this expense
        const userParticipant = newExpense.participants.find(p => p.userId === currentUser.id);
        const newExpenseShare = userParticipant ? userParticipant.shareAmount : (newExpense.paidBy === currentUser.id ? newExpense.amount : 0);
        
        if (newExpenseShare > 0) {
          // Calculate existing spending for this month in this category
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          
          let currentSpending = 0;
          expenses.forEach(exp => {
            const expDate = new Date(exp.date);
            if (exp.category === cat && expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
              const p = exp.participants.find(p => p.userId === currentUser.id);
              if (p) currentSpending += p.shareAmount;
              else if (exp.paidBy === currentUser.id) currentSpending += exp.amount;
            }
          });
          
          const totalNewSpending = currentSpending + newExpenseShare;
          
          if (totalNewSpending > limit) {
            // Over limit
            const notif = {
              id: \`notif_limit_\${Date.now()}\`,
              userId: currentUser.id,
              type: 'spending_limit_warning' as any,
              title: 'Budget Exceeded 🚨',
              message: \`You have exceeded your monthly limit for \${cat}. Spent: ₹\${totalNewSpending} / Limit: ₹\${limit}\`,
              read: false,
              createdAt: new Date().toISOString()
            };
            setNotifications(prev => [notif, ...prev]);
            showToast(\`Alert: \${cat} limit exceeded!\`, 'error');
          } else if (totalNewSpending >= limit * 0.8) {
            // Approaching limit (80%)
            const notif = {
              id: \`notif_limit_\${Date.now()}\`,
              userId: currentUser.id,
              type: 'spending_limit_warning' as any,
              title: 'Approaching Limit ⚠️',
              message: \`You have spent ₹\${totalNewSpending} (80%+) of your ₹\${limit} monthly limit for \${cat}.\`,
              read: false,
              createdAt: new Date().toISOString()
            };
            setNotifications(prev => [notif, ...prev]);
            showToast(\`Warning: Approaching \${cat} limit!\`, 'info');
          }
        }
      }
    }
    // ------------------------------------
`;

const target = "setExpenses((prev) => [newExpense, ...prev]);\n    showToast(`Expense of ₹${newExpense.amount} added! 🧾`, 'success');";
content = content.replace(target, checkLimitLogic);

fs.writeFileSync('src/context/AppContext.tsx', content);
