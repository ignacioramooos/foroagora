export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          certificate_code: string | null
          id: string
          issued_at: string | null
          user_id: string
        }
        Insert: {
          certificate_code?: string | null
          id?: string
          issued_at?: string | null
          user_id: string
        }
        Update: {
          certificate_code?: string | null
          id?: string
          issued_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cohorts: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          location: string
          max_capacity: number
          name: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string
          max_capacity?: number
          name: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string
          max_capacity?: number
          name?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_items: {
        Row: {
          content_body: string | null
          created_at: string
          created_by: string
          description: string | null
          duration_minutes: number | null
          file_url: string | null
          id: string
          is_published: boolean
          module_name: string | null
          sort_order: number
          thumbnail_url: string | null
          title: string
          type: Database["public"]["Enums"]["content_type"]
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          content_body?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          duration_minutes?: number | null
          file_url?: string | null
          id?: string
          is_published?: boolean
          module_name?: string | null
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          content_body?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          duration_minutes?: number | null
          file_url?: string | null
          id?: string
          is_published?: boolean
          module_name?: string | null
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          event_id: string
          id: string
          registered_at: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          id: string
          image_url: string | null
          is_active: boolean
          location: string
          speaker_name: string | null
          speaker_role: string | null
          spots_taken: number
          spots_total: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location: string
          speaker_name?: string | null
          speaker_role?: string | null
          spots_taken?: number
          spots_total?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string
          speaker_name?: string | null
          speaker_role?: string | null
          spots_taken?: number
          spots_total?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string
          created_at: string | null
          estimated_minutes: number | null
          id: string
          is_published: boolean | null
          lesson_number: number
          module_number: number
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          estimated_minutes?: number | null
          id?: string
          is_published?: boolean | null
          lesson_number: number
          module_number: number
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          estimated_minutes?: number | null
          id?: string
          is_published?: boolean | null
          lesson_number?: number
          module_number?: number
          title?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          source?: string | null
        }
        Relationships: []
      }
      portfolio_holdings: {
        Row: {
          avg_cost_per_share: number
          company_name: string
          id: string
          portfolio_id: string
          shares: number
          ticker: string
        }
        Insert: {
          avg_cost_per_share: number
          company_name: string
          id?: string
          portfolio_id: string
          shares?: number
          ticker: string
        }
        Update: {
          avg_cost_per_share?: number
          company_name?: string
          id?: string
          portfolio_id?: string
          shares?: number
          ticker?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_holdings_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_transactions: {
        Row: {
          company_name: string
          executed_at: string
          id: string
          portfolio_id: string
          price_per_share: number
          shares: number
          ticker: string
          total_amount: number
          transaction_type: string
        }
        Insert: {
          company_name: string
          executed_at?: string
          id?: string
          portfolio_id: string
          price_per_share: number
          shares: number
          ticker: string
          total_amount: number
          transaction_type: string
        }
        Update: {
          company_name?: string
          executed_at?: string
          id?: string
          portfolio_id?: string
          price_per_share?: number
          shares?: number
          ticker?: string
          total_amount?: number
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_transactions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          cash_balance: number
          cohort_id: string | null
          created_at: string
          id: string
          last_portfolio_value: number | null
          user_id: string
        }
        Insert: {
          cash_balance?: number
          cohort_id?: string | null
          created_at?: string
          id?: string
          last_portfolio_value?: number | null
          user_id: string
        }
        Update: {
          cash_balance?: number
          cohort_id?: string | null
          created_at?: string
          id?: string
          last_portfolio_value?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accepted_terms: boolean
          age_range: string | null
          avatar_url: string | null
          created_at: string
          department: string | null
          display_name: string | null
          email: string | null
          full_name: string | null
          how_found_us: string | null
          id: string
          institution: string | null
          interests: string[] | null
          onboarding_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted_terms?: boolean
          age_range?: string | null
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          how_found_us?: string | null
          id?: string
          institution?: string | null
          interests?: string[] | null
          onboarding_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          accepted_terms?: boolean
          age_range?: string | null
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          how_found_us?: string | null
          id?: string
          institution?: string | null
          interests?: string[] | null
          onboarding_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      content_type: "video" | "article" | "material"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      content_type: ["video", "article", "material"],
    },
  },
} as const
