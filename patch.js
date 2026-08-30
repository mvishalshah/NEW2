const fs = require('fs');
const content = fs.readFileSync('src/components/ExpensesListView.tsx', 'utf-8');
const newContent = content.replace(
  "  const [selectedGroupId, setSelectedGroupId] = useState('all');",
  "  const [selectedGroupId, setSelectedGroupId] = useState('all');\n  const [activeTab, setActiveTab] = useState<'all' | 'receipts'>('all');"
).replace(
  "    if (!exp) return false;\n    const matchesCat",
  "    if (!exp) return false;\n    if (activeTab === 'receipts' && exp.source !== 'ocr' && !exp.receiptUrl && !(exp.items && exp.items.length > 0)) return false;\n    const matchesCat"
);
fs.writeFileSync('src/components/ExpensesListView.tsx', newContent);
