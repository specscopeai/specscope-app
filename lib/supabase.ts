import { createClient } from '@supabase/supabase-js';

// Public client credentials
const supabaseUrl = 'https://oeroflnhlhrstbzgsbez.supabase.co/rest/v1/';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lcm9mbG5obGhyc3RiemdzYmV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2OTE5MzEsImV4cCI6MjEwMzI2NzkzMX0.R1e6EAWy4bB0SJckjKgiaNiUQCtZssla996p6HpeTFY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
