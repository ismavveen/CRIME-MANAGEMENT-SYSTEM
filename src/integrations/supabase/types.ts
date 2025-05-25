export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          commander_id: string
          created_at: string
          details: string | null
          effective_from: string | null
          effective_until: string | null
          id: string
          reason: string
        }
        Insert: {
          action_type: string
          admin_id: string
          commander_id: string
          created_at?: string
          details?: string | null
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          reason: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          commander_id?: string
          created_at?: string
          details?: string | null
          effective_from?: string | null
          effective_until?: string | null
          id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_commander_id_fkey"
            columns: ["commander_id"]
            isOneToOne: false
            referencedRelation: "unit_commanders"
            referencedColumns: ["id"]
          },
        ]
      }
      commander_notifications: {
        Row: {
          commander_id: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
        }
        Insert: {
          commander_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: string
        }
        Update: {
          commander_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "commander_notifications_commander_id_fkey"
            columns: ["commander_id"]
            isOneToOne: false
            referencedRelation: "unit_commanders"
            referencedColumns: ["id"]
          },
        ]
      }
      commander_warnings: {
        Row: {
          acknowledged: boolean
          acknowledged_at: string | null
          commander_id: string
          created_at: string
          id: string
          issued_by: string
          message: string | null
          reason: string
          severity: string
        }
        Insert: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          commander_id: string
          created_at?: string
          id?: string
          issued_by: string
          message?: string | null
          reason: string
          severity?: string
        }
        Update: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          commander_id?: string
          created_at?: string
          id?: string
          issued_by?: string
          message?: string | null
          reason?: string
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "commander_warnings_commander_id_fkey"
            columns: ["commander_id"]
            isOneToOne: false
            referencedRelation: "unit_commanders"
            referencedColumns: ["id"]
          },
        ]
      }
      military_units: {
        Row: {
          commander: string
          created_at: string
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          commander: string
          created_at?: string
          id: string
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          commander?: string
          created_at?: string
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          report_id: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          report_id?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          report_id?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      report_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          assigned_to_commander: string
          assigned_to_unit_id: string
          created_at: string
          id: string
          report_id: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          assigned_to_commander: string
          assigned_to_unit_id: string
          created_at?: string
          id?: string
          report_id: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          assigned_to_commander?: string
          assigned_to_unit_id?: string
          created_at?: string
          id?: string
          report_id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_assignments_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          acknowledged_at: string | null
          assigned_commander_id: string | null
          assigned_to: string | null
          created_at: string | null
          description: string | null
          file_url: string | null
          id: string
          is_anonymous: boolean | null
          latitude: number | null
          location: string | null
          location_accuracy: number | null
          longitude: number | null
          manual_location: string | null
          priority: string | null
          reporter_type: string
          response_time_hours: number | null
          state: string | null
          status: string | null
          threat_type: string | null
          timestamp: string | null
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          assigned_commander_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          is_anonymous?: boolean | null
          latitude?: number | null
          location?: string | null
          location_accuracy?: number | null
          longitude?: number | null
          manual_location?: string | null
          priority?: string | null
          reporter_type?: string
          response_time_hours?: number | null
          state?: string | null
          status?: string | null
          threat_type?: string | null
          timestamp?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          assigned_commander_id?: string | null
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          is_anonymous?: boolean | null
          latitude?: number | null
          location?: string | null
          location_accuracy?: number | null
          longitude?: number | null
          manual_location?: string | null
          priority?: string | null
          reporter_type?: string
          response_time_hours?: number | null
          state?: string | null
          status?: string | null
          threat_type?: string | null
          timestamp?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_assigned_commander_id_fkey"
            columns: ["assigned_commander_id"]
            isOneToOne: false
            referencedRelation: "unit_commanders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          id: string
          last_updated: string
          metric_name: string
          metric_value: number
        }
        Insert: {
          id?: string
          last_updated?: string
          metric_name: string
          metric_value?: number
        }
        Update: {
          id?: string
          last_updated?: string
          metric_name?: string
          metric_value?: number
        }
        Relationships: []
      }
      unit_commanders: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          password_hash: string
          phone_number: string
          state: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          password_hash: string
          phone_number: string
          state: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          password_hash?: string
          phone_number?: string
          state?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
