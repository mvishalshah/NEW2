import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hkojccndwikyhvztllhm.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_rzTXkXMjxjlbKfH1iCPEXA_EBCIb-b2";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
export default supabase;
