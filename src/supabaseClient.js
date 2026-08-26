import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hkojccndwikyhvztllhm.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_MPKKuKMBcqiB3mj0S9Y7rQ_wjCMZg9b";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
export default supabase;

