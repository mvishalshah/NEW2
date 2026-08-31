const fs = require('fs');
let content = fs.readFileSync('src/lib/supabase.ts', 'utf-8');

const joinLogic = `    const { data: groupData, error: groupErr } = await supabase
      .from('groups')
      .select('*')
      .ilike('group_code', cleaned)
      .maybeSingle();

    if (groupErr || !groupData) {
      return { success: false, message: 'Invalid group join code. Group not found.' };
    }

    // Check if already a member
    const { data: existingMember } = await supabase
      .from('group_members')
      .select('status')
      .eq('group_id', groupData.id)
      .eq('user_id', user.id)
      .maybeSingle();

    const group: Group = {
      id: groupData.id,
      name: groupData.name,
      description: groupData.description || '',
      groupCode: groupData.group_code,
      category: groupData.category || 'college',
      institution: groupData.institution || '',
      city: groupData.city || '',
      privacy: groupData.privacy || 'public',
      imageUrl: groupData.image_url,
      ownerId: groupData.owner_id,
      createdAt: groupData.created_at,
      memberCount: (groupData.member_count || 1) + (existingMember ? 0 : 1)
    };

    if (existingMember) {
      if (existingMember.status === 'active' || existingMember.status === 'owner') {
        return { success: true, message: \`Entering \${group.name}...\`, group };
      } else if (existingMember.status === 'pending') {
        return { success: true, message: 'Your join request is still pending admin approval.', group };
      }
    }`;

const oldJoin = `    const { data: groupData, error: groupErr } = await supabase
      .from('groups')
      .select('*')
      .ilike('group_code', cleaned)
      .maybeSingle();

    if (groupErr || !groupData) {
      return { success: false, message: 'Invalid group join code. Group not found.' };
    }

    const group: Group = {
      id: groupData.id,
      name: groupData.name,
      description: groupData.description || '',
      groupCode: groupData.group_code,
      category: groupData.category || 'college',
      institution: groupData.institution || '',
      city: groupData.city || '',
      privacy: groupData.privacy || 'public',
      imageUrl: groupData.image_url,
      ownerId: groupData.owner_id,
      createdAt: groupData.created_at,
      memberCount: (groupData.member_count || 1) + 1
    };`;

if (content.includes("memberCount: (groupData.member_count || 1) + 1")) {
  content = content.replace(oldJoin, joinLogic);
  fs.writeFileSync('src/lib/supabase.ts', content);
}
