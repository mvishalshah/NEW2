const fs = require('fs');
const content = fs.readFileSync('src/components/ExpensesListView.tsx', 'utf-8');
const searchString = `                  {(isPayer || exp.createdBy === currentUser?.id) && (
                    <button
                      onClick={() => {
                        if (window.confirm(\`Delete expense "\${exp.title}"?\`)) {
                          deleteExpense(exp.id);`;
const replacement = `                  <button
                    onClick={() => openAddExpenseModal(exp.source === 'ocr' ? 'ocr' : 'manual', exp.groupId, exp)}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                    title={exp.source === 'ocr' ? 'Edit / Re-split Receipt' : 'Edit Expense'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-pen-square"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>
                  </button>

                  {(isPayer || exp.createdBy === currentUser?.id) && (
                    <button
                      onClick={() => {
                        if (window.confirm(\`Delete expense "\${exp.title}"?\`)) {
                          deleteExpense(exp.id);`;
const newContent = content.replace(searchString, replacement);
fs.writeFileSync('src/components/ExpensesListView.tsx', newContent);
