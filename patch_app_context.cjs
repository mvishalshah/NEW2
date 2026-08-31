const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

const oldJoin = `  const joinGroupWithCode = async (code: string): Promise<boolean> => {
    const cleaned = code.trim().toUpperCase();

    // First try Supabase join if configured
    if (isSupabaseConfigured() && currentUser) {`;

const newJoin = `  const joinGroupWithCode = async (code: string): Promise<boolean> => {
    const cleaned = code.trim().toUpperCase();

    const found = groupsState.find((g) => g.groupCode?.toUpperCase() === cleaned);
    if (found) {
      showToast(\`Entering \${found.name}...\`, 'success');
      setActiveView('group-detail', found.id);
      return true;
    }

    // First try Supabase join if configured
    if (isSupabaseConfigured() && currentUser) {`;

content = content.replace(oldJoin, newJoin);
content = content.replace(`    const found = groupsState.find((g) => g.groupCode?.toUpperCase() === cleaned);
    if (found) {
      showToast(\`Joined \${found.name} successfully! 🚀\`, 'success');
      setActiveView('group-detail', found.id);
      return true;
    }`, '');

fs.writeFileSync('src/context/AppContext.tsx', content);
