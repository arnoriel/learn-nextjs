// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hwtkyxwxnzamhfjjbmrn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dGt5eHd4bnphbWhmampibXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1NTgxOTYsImV4cCI6MjA0NzEzNDE5Nn0.JR194H-FzLBQwGZwoSPVRWHu5rNij7JukZ2_RC0kEeQ';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
