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
      assignments: {
        Row: {
          assigned_at: string
          commander_id: string
          created_at: string
          id: string
          report_id: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          commander_id: string
          created_at?: string
          id?: string
          report_id: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          commander_id?: string
          created_at?: string
          id?: string
          report_id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_commander_id_fkey"
            columns: ["commander_id"]
            isOneToOne: false
            referencedRelation: "unit_commanders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      image_analysis: {
        Row: {
          analyzed_at: string
          created_at: string
          detected_faces: Json | null
          detected_objects: Json | null
          extracted_text: string | null
          id: string
          image_url: string
          labels: Json | null
          report_id: string
          updated_at: string
        }
        Insert: {
          analyzed_at?: string
          created_at?: string
          detected_faces?: Json | null
          detected_objects?: Json | null
          extracted_text?: string | null
          id?: string
          image_url: string
          labels?: Json | null
          report_id: string
          updated_at?: string
        }
        Update: {
          analyzed_at?: string
          created_at?: string
          detected_faces?: Json | null
          detected_objects?: Json | null
          extracted_text?: string | null
          id?: string
          image_url?: string
          labels?: Json | null
          report_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_image_analysis_report_id"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          rank: string | null
          role: string | null
          state: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          rank?: string | null
          role?: string | null
          state?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          rank?: string | null
          role?: string | null
          state?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          acknowledged_at: string | null
          assigned_commander_id: string | null
          assigned_to: string | null
          created_at: string
          description: string
          file_url: string | null
          full_address: string | null
          id: string
          images: string[] | null
          is_anonymous: boolean | null
          landmark: string | null
          latitude: number | null
          local_government: string | null
          location: string | null
          location_accuracy: number | null
          longitude: number | null
          manual_location: string | null
          priority: string
          reporter_type: string | null
          response_time_hours: number | null
          state: string | null
          status: string
          threat_type: string
          timestamp: string | null
          updated_at: string
          urgency: string
          videos: string[] | null
        }
        Insert: {
          acknowledged_at?: string | null
          assigned_commander_id?: string | null
          assigned_to?: string | null
          created_at?: string
          description: string
          file_url?: string | null
          full_address?: string | null
          id?: string
          images?: string[] | null
          is_anonymous?: boolean | null
          landmark?: string | null
          latitude?: number | null
          local_government?: string | null
          location?: string | null
          location_accuracy?: number | null
          longitude?: number | null
          manual_location?: string | null
          priority?: string
          reporter_type?: string | null
          response_time_hours?: number | null
          state?: string | null
          status?: string
          threat_type: string
          timestamp?: string | null
          updated_at?: string
          urgency?: string
          videos?: string[] | null
        }
        Update: {
          acknowledged_at?: string | null
          assigned_commander_id?: string | null
          assigned_to?: string | null
          created_at?: string
          description?: string
          file_url?: string | null
          full_address?: string | null
          id?: string
          images?: string[] | null
          is_anonymous?: boolean | null
          landmark?: string | null
          latitude?: number | null
          local_government?: string | null
          location?: string | null
          location_accuracy?: number | null
          longitude?: number | null
          manual_location?: string | null
          priority?: string
          reporter_type?: string | null
          response_time_hours?: number | null
          state?: string | null
          status?: string
          threat_type?: string
          timestamp?: string | null
          updated_at?: string
          urgency?: string
          videos?: string[] | null
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          created_at: string
          id: string
          metric_name: string
          metric_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_name: string
          metric_value?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_name?: string
          metric_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      unit_commanders: {
        Row: {
          active_assignments: number | null
          average_response_time: number | null
          contact_info: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          location: string | null
          rank: string
          specialization: string | null
          state: string
          status: string | null
          success_rate: number | null
          total_assignments: number | null
          unit: string
          updated_at: string
        }
        Insert: {
          active_assignments?: number | null
          average_response_time?: number | null
          contact_info?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          rank: string
          specialization?: string | null
          state: string
          status?: string | null
          success_rate?: number | null
          total_assignments?: number | null
          unit: string
          updated_at?: string
        }
        Update: {
          active_assignments?: number | null
          average_response_time?: number | null
          contact_info?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          rank?: string
          specialization?: string | null
          state?: string
          status?: string | null
          success_rate?: number | null
          total_assignments?: number | null
          unit?: string
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
