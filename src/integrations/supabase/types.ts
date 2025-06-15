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
          accepted_at: string | null
          assigned_at: string
          casualties: number | null
          civilians_rescued: number | null
          commander_id: string
          created_at: string
          custom_message: string | null
          id: string
          injured_personnel: number | null
          operation_outcome: string | null
          rejection_reason: string | null
          report_id: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          response_timeframe: number | null
          response_timestamp: string | null
          status: string | null
          updated_at: string
          weapons_recovered: number | null
        }
        Insert: {
          accepted_at?: string | null
          assigned_at?: string
          casualties?: number | null
          civilians_rescued?: number | null
          commander_id: string
          created_at?: string
          custom_message?: string | null
          id?: string
          injured_personnel?: number | null
          operation_outcome?: string | null
          rejection_reason?: string | null
          report_id: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          response_timeframe?: number | null
          response_timestamp?: string | null
          status?: string | null
          updated_at?: string
          weapons_recovered?: number | null
        }
        Update: {
          accepted_at?: string | null
          assigned_at?: string
          casualties?: number | null
          civilians_rescued?: number | null
          commander_id?: string
          created_at?: string
          custom_message?: string | null
          id?: string
          injured_personnel?: number | null
          operation_outcome?: string | null
          rejection_reason?: string | null
          report_id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          response_timeframe?: number | null
          response_timestamp?: string | null
          status?: string | null
          updated_at?: string
          weapons_recovered?: number | null
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
      audit_logs: {
        Row: {
          access_method: string | null
          action_type: string
          actor_id: string | null
          actor_type: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          ip_address: unknown | null
          is_sensitive: boolean | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          session_id: string | null
          severity_level: string | null
          timestamp: string
          user_agent: string | null
        }
        Insert: {
          access_method?: string | null
          action_type: string
          actor_id?: string | null
          actor_type?: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: unknown | null
          is_sensitive?: boolean | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          session_id?: string | null
          severity_level?: string | null
          timestamp?: string
          user_agent?: string | null
        }
        Update: {
          access_method?: string | null
          action_type?: string
          actor_id?: string | null
          actor_type?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          is_sensitive?: boolean | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          session_id?: string | null
          severity_level?: string | null
          timestamp?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      file_scan_logs: {
        Row: {
          created_at: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          report_id: string | null
          scan_details: Json | null
          scan_result: string
          scan_timestamp: string
          scanner_version: string | null
          threats_detected: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          report_id?: string | null
          scan_details?: Json | null
          scan_result?: string
          scan_timestamp?: string
          scanner_version?: string | null
          threats_detected?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          report_id?: string | null
          scan_details?: Json | null
          scan_result?: string
          scan_timestamp?: string
          scanner_version?: string | null
          threats_detected?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_scan_logs_report_id_fkey"
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
      report_access_logs: {
        Row: {
          access_type: string
          accessed_sections: Json | null
          audit_log_id: string
          created_at: string
          duration_seconds: number | null
          id: string
          purpose: string | null
          report_id: string
        }
        Insert: {
          access_type: string
          accessed_sections?: Json | null
          audit_log_id: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          purpose?: string | null
          report_id: string
        }
        Update: {
          access_type?: string
          accessed_sections?: Json | null
          audit_log_id?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          purpose?: string | null
          report_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_access_logs_audit_log_id_fkey"
            columns: ["audit_log_id"]
            isOneToOne: false
            referencedRelation: "audit_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      report_audit_trail: {
        Row: {
          approved_by: string | null
          audit_log_id: string
          change_reason: string | null
          created_at: string
          field_changed: string | null
          id: string
          new_value: string | null
          previous_value: string | null
          report_id: string
        }
        Insert: {
          approved_by?: string | null
          audit_log_id: string
          change_reason?: string | null
          created_at?: string
          field_changed?: string | null
          id?: string
          new_value?: string | null
          previous_value?: string | null
          report_id: string
        }
        Update: {
          approved_by?: string | null
          audit_log_id?: string
          change_reason?: string | null
          created_at?: string
          field_changed?: string | null
          id?: string
          new_value?: string | null
          previous_value?: string | null
          report_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_audit_trail_audit_log_id_fkey"
            columns: ["audit_log_id"]
            isOneToOne: false
            referencedRelation: "audit_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          acknowledged_at: string | null
          assigned_commander_id: string | null
          assigned_to: string | null
          contact_info: string | null
          created_at: string
          crime_type: string | null
          description: string
          device_info: Json | null
          documents: string[] | null
          evidence: Json | null
          file_url: string | null
          full_address: string | null
          id: string
          images: string[] | null
          incident_time: string | null
          is_anonymous: boolean | null
          landmark: string | null
          latitude: number | null
          local_government: string | null
          location: string | null
          location_accuracy: number | null
          longitude: number | null
          manual_location: string | null
          metadata: Json | null
          priority: string
          reporter_contact: string | null
          reporter_email: string | null
          reporter_name: string | null
          reporter_phone: string | null
          reporter_type: string | null
          reporting_method: string | null
          response_time_hours: number | null
          serial_number: string | null
          specific_area: string | null
          state: string | null
          status: string
          submission_source: string | null
          threat_type: string
          timestamp: string | null
          updated_at: string
          urgency: string
          validation_status: string | null
          videos: string[] | null
          witness_info: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          assigned_commander_id?: string | null
          assigned_to?: string | null
          contact_info?: string | null
          created_at?: string
          crime_type?: string | null
          description: string
          device_info?: Json | null
          documents?: string[] | null
          evidence?: Json | null
          file_url?: string | null
          full_address?: string | null
          id?: string
          images?: string[] | null
          incident_time?: string | null
          is_anonymous?: boolean | null
          landmark?: string | null
          latitude?: number | null
          local_government?: string | null
          location?: string | null
          location_accuracy?: number | null
          longitude?: number | null
          manual_location?: string | null
          metadata?: Json | null
          priority?: string
          reporter_contact?: string | null
          reporter_email?: string | null
          reporter_name?: string | null
          reporter_phone?: string | null
          reporter_type?: string | null
          reporting_method?: string | null
          response_time_hours?: number | null
          serial_number?: string | null
          specific_area?: string | null
          state?: string | null
          status?: string
          submission_source?: string | null
          threat_type: string
          timestamp?: string | null
          updated_at?: string
          urgency?: string
          validation_status?: string | null
          videos?: string[] | null
          witness_info?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          assigned_commander_id?: string | null
          assigned_to?: string | null
          contact_info?: string | null
          created_at?: string
          crime_type?: string | null
          description?: string
          device_info?: Json | null
          documents?: string[] | null
          evidence?: Json | null
          file_url?: string | null
          full_address?: string | null
          id?: string
          images?: string[] | null
          incident_time?: string | null
          is_anonymous?: boolean | null
          landmark?: string | null
          latitude?: number | null
          local_government?: string | null
          location?: string | null
          location_accuracy?: number | null
          longitude?: number | null
          manual_location?: string | null
          metadata?: Json | null
          priority?: string
          reporter_contact?: string | null
          reporter_email?: string | null
          reporter_name?: string | null
          reporter_phone?: string | null
          reporter_type?: string | null
          reporting_method?: string | null
          response_time_hours?: number | null
          serial_number?: string | null
          specific_area?: string | null
          state?: string | null
          status?: string
          submission_source?: string | null
          threat_type?: string
          timestamp?: string | null
          updated_at?: string
          urgency?: string
          validation_status?: string | null
          videos?: string[] | null
          witness_info?: string | null
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
      system_operation_logs: {
        Row: {
          audit_log_id: string
          component: string
          created_at: string
          error_details: Json | null
          execution_time_ms: number | null
          id: string
          operation_type: string
          resource_usage: Json | null
          status: string
        }
        Insert: {
          audit_log_id: string
          component: string
          created_at?: string
          error_details?: Json | null
          execution_time_ms?: number | null
          id?: string
          operation_type: string
          resource_usage?: Json | null
          status?: string
        }
        Update: {
          audit_log_id?: string
          component?: string
          created_at?: string
          error_details?: Json | null
          execution_time_ms?: number | null
          id?: string
          operation_type?: string
          resource_usage?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_operation_logs_audit_log_id_fkey"
            columns: ["audit_log_id"]
            isOneToOne: false
            referencedRelation: "audit_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_commanders: {
        Row: {
          active_assignments: number | null
          arm_of_service: string | null
          average_response_time: number | null
          category: string | null
          contact_info: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          location: string | null
          password_hash: string | null
          profile_image: string | null
          rank: string
          service_number: string | null
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
          arm_of_service?: string | null
          average_response_time?: number | null
          category?: string | null
          contact_info?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          password_hash?: string | null
          profile_image?: string | null
          rank: string
          service_number?: string | null
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
          arm_of_service?: string | null
          average_response_time?: number | null
          category?: string | null
          contact_info?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          password_hash?: string | null
          profile_image?: string | null
          rank?: string
          service_number?: string | null
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
      user_activity_logs: {
        Row: {
          activity_type: string
          audit_log_id: string
          created_at: string
          device_fingerprint: string | null
          failure_reason: string | null
          id: string
          location_data: Json | null
          login_method: string | null
          success: boolean
          user_id: string | null
        }
        Insert: {
          activity_type: string
          audit_log_id: string
          created_at?: string
          device_fingerprint?: string | null
          failure_reason?: string | null
          id?: string
          location_data?: Json | null
          login_method?: string | null
          success?: boolean
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          audit_log_id?: string
          created_at?: string
          device_fingerprint?: string | null
          failure_reason?: string | null
          id?: string
          location_data?: Json | null
          login_method?: string | null
          success?: boolean
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_audit_log_id_fkey"
            columns: ["audit_log_id"]
            isOneToOne: false
            referencedRelation: "audit_logs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_report_access: {
        Args: {
          p_report_id: string
          p_access_type?: string
          p_duration_seconds?: number
          p_accessed_sections?: Json
          p_purpose?: string
        }
        Returns: string
      }
      log_user_activity: {
        Args: {
          p_user_id: string
          p_activity_type: string
          p_success?: boolean
          p_failure_reason?: string
          p_metadata?: Json
        }
        Returns: string
      }
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
