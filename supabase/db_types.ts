export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      villains: {
        Row: {
          created_at: string | null
          id: number
          name: string
          specialty: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          specialty?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          specialty?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
