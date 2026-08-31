const fs = require('fs');
let content = fs.readFileSync('server/db.ts', 'utf-8');

const oldCheck = `    const existingMember = this.groupMembers.find((gm) => gm.groupId === group.id && gm.userId === userId);
    if (existingMember && existingMember.status === 'active') {
      return { success: false, message: \`You are already a member of \${group.name}.\`, group };
    }`;

const newCheck = `    const existingMember = this.groupMembers.find((gm) => gm.groupId === group.id && gm.userId === userId);
    if (existingMember && (existingMember.status === 'active' || existingMember.status === 'owner')) {
      return { success: true, message: \`Entering \${group.name}...\`, group };
    }`;

content = content.replace(oldCheck, newCheck);
fs.writeFileSync('server/db.ts', content);
