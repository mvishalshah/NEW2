import { createClient } from '@supabase/supabase-js';
import { User, Group, Expense, Settlement, AppNotification, GroupMember } from '../types.js';

// Retrieve Supabase environment variables from Vite, with fallback to default credentials
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://hkojccndwikyhvztllhm.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_MPKKuKMBcqiB3mj0S9Y7rQ_wjCMZg9b';


export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('YOUR_SUPABASE')
  );
};

// Create the Supabase client (fallback client if not configured so imports don't crash)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-anon-key',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );

// --- SUPABASE STORAGE HELPERS ---

/**
 * Upload a receipt image to Supabase Storage 'receipts' bucket
 */
export async function uploadReceiptToSupabase(
  file: File | Blob,
  fileName?: string
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { url: null, error: 'Supabase is not configured yet.' };
  }

  try {
    const ext = file.type.split('/')[1] || 'jpg';
    const name = fileName || `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const filePath = `receipts/${name}`;

    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn('Supabase storage upload error:', error);
      return { url: null, error: error.message };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('receipts')
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Failed to upload receipt image' };
  }
}

/**
 * Upload a user avatar to Supabase Storage 'avatars' bucket
 */
export async function uploadAvatarToSupabase(
  file: File | Blob,
  userId: string
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { url: null, error: 'Supabase is not configured yet.' };
  }

  try {
    const ext = file.type.split('/')[1] || 'jpg';
    const filePath = `avatars/${userId}_${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      return { url: null, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Failed to upload avatar' };
  }
}

// --- SUPABASE DATABASE SYNC HELPERS ---

export async function fetchProfileFromSupabase(userId: string): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return {
      id: data.id,
      googleId: data.google_id || '',
      name: data.name || '',
      username: data.username || '',
      email: data.email || '',
      avatarUrl: data.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      institution: data.institution || '',
      course: data.course || '',
      year: data.year || data.year_of_study || '',
      yearOfStudy: data.year_of_study || data.year || '',
      city: data.city || '',
      address: data.address || '',
      phone: data.phone || '',
      upiId: data.upi_id || '',
      bio: data.bio || '',
      createdAt: data.created_at || new Date().toISOString()
    };
  } catch {
    return null;
  }
}

export async function upsertProfileToSupabase(user: User): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      google_id: user.googleId || '',
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      avatar_url: user.avatarUrl || '',
      institution: user.institution || '',
      course: user.course || '',
      year: user.year || user.yearOfStudy || '',
      year_of_study: user.yearOfStudy || user.year || '',
      city: user.city || '',
      address: user.address || '',
      phone: user.phone || '',
      upi_id: user.upiId || '',
      bio: user.bio || '',
      updated_at: new Date().toISOString()
    });
    return !error;
  } catch {
    return false;
  }
}

export async function fetchAllUsersFromSupabase(): Promise<User[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((d: any) => ({
      id: d.id,
      googleId: d.google_id || '',
      name: d.name || '',
      username: d.username || '',
      email: d.email || '',
      avatarUrl: d.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      institution: d.institution || '',
      course: d.course || '',
      year: d.year || d.year_of_study || '',
      yearOfStudy: d.year_of_study || d.year || '',
      city: d.city || '',
      address: d.address || '',
      phone: d.phone || '',
      upiId: d.upi_id || '',
      bio: d.bio || '',
      honestyScore: d.honesty_score || 98,
      createdAt: d.created_at || new Date().toISOString()
    }));
  } catch {
    return [];
  }
}

export async function fetchGroupsFromSupabase(): Promise<Group[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((g: any) => ({
      id: g.id,
      name: g.name,
      description: g.description || '',
      groupCode: g.group_code,
      category: g.category || 'college',
      institution: g.institution || '',
      city: g.city || '',
      privacy: g.privacy || 'public',
      imageUrl: g.image_url,
      ownerId: g.owner_id,
      createdAt: g.created_at,
      memberCount: g.member_count || 1
    }));
  } catch {
    return [];
  }
}

export async function insertGroupToSupabase(group: Group): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('groups').upsert({
      id: group.id,
      name: group.name,
      description: group.description,
      group_code: group.groupCode,
      category: group.category,
      institution: group.institution,
      city: group.city,
      privacy: group.privacy,
      image_url: group.imageUrl,
      owner_id: group.ownerId,
      member_count: group.memberCount || 1,
      created_at: group.createdAt
    });

    if (!error && group.ownerId) {
      await insertGroupMemberToSupabase({
        groupId: group.id,
        userId: group.ownerId,
        role: 'owner',
        status: 'pending'
      });
    }

    return !error;
  } catch {
    return false;
  }
}

export async function fetchGroupMembersFromSupabase(groupId: string): Promise<GroupMember[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', groupId);

    if (error || !data) return [];
    return data.map((m: any) => ({
      id: m.id || `${m.group_id}_${m.user_id}`,
      groupId: m.group_id,
      userId: m.user_id,
      role: m.role || 'member',
      status: m.status || 'active',
      joinedAt: m.joined_at || m.created_at || new Date().toISOString()
    }));
  } catch {
    return [];
  }
}

export async function insertGroupMemberToSupabase(member: {
  id?: string;
  groupId: string;
  userId: string;
  role?: 'owner' | 'admin' | 'member';
  status?: 'active' | 'pending';
}): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const memberId = member.id || `gm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const { error } = await supabase.from('group_members').upsert({
      id: memberId,
      group_id: member.groupId,
      user_id: member.userId,
      role: member.role || 'member',
      status: member.status || 'active',
      joined_at: new Date().toISOString()
    });

    try {
      const { count } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', member.groupId);

      if (count && count > 0) {
        await supabase
          .from('groups')
          .update({ member_count: count })
          .eq('id', member.groupId);
      }
    } catch {}

    return !error;
  } catch {
    return false;
  }
}

export async function joinGroupByCodeInSupabase(
  groupCode: string,
  user: User
): Promise<{ success: boolean; message: string; group?: Group }> {
  if (!isSupabaseConfigured()) return { success: false, message: 'Supabase not configured' };
  try {
    const cleaned = groupCode.trim().toUpperCase();
    const { data: groupData, error: groupErr } = await supabase
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
    };

    await insertGroupMemberToSupabase({
      groupId: group.id,
      userId: user.id,
      role: 'member',
      status: 'active'
    });

    return {
      success: true,
      message: `Join request for "${group.name}" sent to admin for approval!`,
      group
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to join group in Supabase' };
  }
}

export async function fetchExpensesFromSupabase(userId?: string, groupId?: string): Promise<Expense[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    let query = supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false });

    if (groupId) {
      query = query.eq('group_id', groupId);
    }

    const { data, error } = await query;

    if (error || !data) return [];
    return data.map((e: any) => ({
      id: e.id,
      groupId: e.group_id || undefined,
      groupName: e.group_name || undefined,
      title: e.title,
      description: e.description,
      amount: Number(e.amount),
      category: e.category,
      date: e.date,
      paidBy: e.paid_by,
      createdBy: e.created_by,
      receiptUrl: e.receipt_url,
      source: e.source || 'manual',
      splitMethod: e.split_method || 'equal',
      items: e.items || [],
      participants: e.participants || [],
      createdAt: e.created_at
    }));
  } catch {
    return [];
  }
}


export async function insertExpenseToSupabase(expense: Expense): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('expenses').insert({
      id: expense.id,
      group_id: expense.groupId || null,
      title: expense.title,
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      paid_by: expense.paidBy,
      created_by: expense.createdBy,
      receipt_url: expense.receiptUrl,
      source: expense.source,
      split_method: expense.splitMethod,
      items: expense.items || [],
      participants: expense.participants,
      created_at: expense.createdAt
    });
    return !error;
  } catch {
    return false;
  }
}

export async function deleteExpenseFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchSettlementsFromSupabase(): Promise<Settlement[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('settlements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((s: any) => ({
      id: s.id,
      groupId: s.group_id,
      fromUserId: s.from_user_id,
      toUserId: s.to_user_id,
      amount: Number(s.amount),
      status: s.status,
      paymentMethod: s.payment_method || 'money_exchange',
      payerAgreed: s.payer_agreed ?? (s.status === 'completed'),
      receiverAgreed: s.receiver_agreed ?? (s.status === 'completed'),
      completedAt: s.completed_at || s.paid_at,
      note: s.note,
      createdAt: s.created_at,
      paidAt: s.paid_at
    }));
  } catch {
    return [];
  }
}

export async function insertSettlementToSupabase(settlement: Settlement): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('settlements').insert({
      id: settlement.id,
      group_id: settlement.groupId || null,
      from_user_id: settlement.fromUserId,
      to_user_id: settlement.toUserId,
      amount: settlement.amount,
      status: settlement.status,
      payment_method: settlement.paymentMethod,
      payer_agreed: settlement.payerAgreed,
      receiver_agreed: settlement.receiverAgreed,
      completed_at: settlement.completedAt || settlement.paidAt,
      note: settlement.note,
      created_at: settlement.createdAt,
      paid_at: settlement.paidAt
    });
    return !error;
  } catch {
    return false;
  }
}

export async function fetchNotificationsFromSupabase(userId: string): Promise<AppNotification[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((n: any) => ({
      id: n.id,
      userId: n.user_id,
      type: n.type,
      title: n.title,
      message: n.message,
      read: n.read,
      data: n.data,
      createdAt: n.created_at
    }));
  } catch {
    return [];
  }
}
