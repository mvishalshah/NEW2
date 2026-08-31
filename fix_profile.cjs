const fs = require('fs');
let content = fs.readFileSync('src/components/ProfileView.tsx', 'utf-8');

content = content.replace("const [bio, monthlyLimits, setBio] = useState(currentUser?.bio || '');", "const [bio, setBio] = useState(currentUser?.bio || '');");

// Check if any other replacements failed or messed up.
fs.writeFileSync('src/components/ProfileView.tsx', content);
