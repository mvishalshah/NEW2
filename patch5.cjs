const fs = require('fs');
const content = fs.readFileSync('src/components/ExpensesListView.tsx', 'utf-8');
const searchString = `      {/* Filters Toolbar */}`;
const replacement = `      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('all')}
          className={\`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors \${activeTab === 'all' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
        >
          All Expenses
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={\`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 \${activeTab === 'receipts' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
        >
          <Receipt className="w-4 h-4" />
          Receipt History
        </button>
      </div>

      {/* Filters Toolbar */}`;
const newContent = content.replace(searchString, replacement);
fs.writeFileSync('src/components/ExpensesListView.tsx', newContent);
