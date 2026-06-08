/**
 * Database types — manually authored for Slice 1 only.
 *
 * Once the `supabase` CLI is installed, replace this file by running:
 *   supabase gen types typescript --linked > src/types/supabase.ts
 * After every new migration.
 */

export type Database = {
  public: {
    Tables: {
      merchants: {
        Row: {
          id: string;
          slug: string;
          name: string;
          theme_json: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          theme_json?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          theme_json?: Record<string, unknown>;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
