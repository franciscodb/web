import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para las tablas
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          privy_user_id: string;
          wallet_address: string;
          phone_number?: string;
          email?: string;
          ens_subdomain?: string;
          credit_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          privy_user_id: string;
          wallet_address: string;
          phone_number?: string;
          email?: string;
          ens_subdomain?: string;
          credit_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          privy_user_id?: string;
          wallet_address?: string;
          phone_number?: string;
          email?: string;
          ens_subdomain?: string;
          credit_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      loans: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          interest_rate: number;
          duration_months: number;
          status: 'pending' | 'active' | 'completed' | 'defaulted';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          interest_rate: number;
          duration_months: number;
          status?: 'pending' | 'active' | 'completed' | 'defaulted';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          interest_rate?: number;
          duration_months?: number;
          status?: 'pending' | 'active' | 'completed' | 'defaulted';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};