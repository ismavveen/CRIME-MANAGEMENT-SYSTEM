
-- Create audit log tables for comprehensive tracking

-- Main audit log table for all system activities
CREATE TABLE public.audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'report', 'user', 'assignment', etc.
    entity_id UUID NOT NULL, -- ID of the entity being logged
    action_type TEXT NOT NULL, -- 'create', 'update', 'view', 'delete', 'assign', etc.
    actor_id UUID, -- ID of user performing action (null for anonymous)
    actor_type TEXT NOT NULL DEFAULT 'user', -- 'user', 'system', 'anonymous'
    old_values JSONB, -- Previous state of the entity
    new_values JSONB, -- New state after change
    metadata JSONB, -- Additional context (IP, user agent, etc.)
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    session_id TEXT, -- Session identifier
    ip_address INET, -- User's IP address
    user_agent TEXT, -- Browser/client information
    access_method TEXT, -- 'web', 'mobile', 'api', etc.
    severity_level TEXT DEFAULT 'info', -- 'info', 'warning', 'critical'
    is_sensitive BOOLEAN DEFAULT false, -- Flag for sensitive operations
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Report-specific audit trail
CREATE TABLE public.report_audit_trail (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID NOT NULL,
    audit_log_id UUID NOT NULL REFERENCES public.audit_logs(id),
    field_changed TEXT, -- Specific field that was modified
    previous_value TEXT, -- Previous value as string
    new_value TEXT, -- New value as string
    change_reason TEXT, -- Reason for the change
    approved_by UUID, -- Who approved the change (if applicable)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Access logs for report viewing and interactions
CREATE TABLE public.report_access_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID NOT NULL,
    audit_log_id UUID NOT NULL REFERENCES public.audit_logs(id),
    access_type TEXT NOT NULL, -- 'view', 'download', 'export', 'print'
    duration_seconds INTEGER, -- How long they viewed it
    accessed_sections JSONB, -- Which parts of the report were accessed
    purpose TEXT, -- Stated purpose for access
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User activity logs for authentication and session management
CREATE TABLE public.user_activity_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    audit_log_id UUID NOT NULL REFERENCES public.audit_logs(id),
    activity_type TEXT NOT NULL, -- 'login', 'logout', 'password_change', etc.
    success BOOLEAN NOT NULL DEFAULT true,
    failure_reason TEXT, -- If success = false
    login_method TEXT, -- 'password', 'sso', etc.
    device_fingerprint TEXT, -- Device identification
    location_data JSONB, -- Geolocation if available
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- System operation logs for automated processes
CREATE TABLE public.system_operation_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    audit_log_id UUID NOT NULL REFERENCES public.audit_logs(id),
    operation_type TEXT NOT NULL, -- 'auto_assignment', 'notification_sent', etc.
    component TEXT NOT NULL, -- Which system component performed the action
    status TEXT NOT NULL DEFAULT 'success', -- 'success', 'error', 'warning'
    error_details JSONB, -- Error information if status != success
    execution_time_ms INTEGER, -- How long the operation took
    resource_usage JSONB, -- Memory, CPU usage if applicable
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for efficient querying
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp);
CREATE INDEX idx_audit_logs_action_type ON public.audit_logs(action_type);
CREATE INDEX idx_audit_logs_sensitive ON public.audit_logs(is_sensitive);

CREATE INDEX idx_report_audit_trail_report ON public.report_audit_trail(report_id);
CREATE INDEX idx_report_audit_trail_timestamp ON public.report_audit_trail(created_at);

CREATE INDEX idx_report_access_logs_report ON public.report_access_logs(report_id);
CREATE INDEX idx_report_access_logs_timestamp ON public.report_access_logs(created_at);

CREATE INDEX idx_user_activity_logs_user ON public.user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_timestamp ON public.user_activity_logs(created_at);

-- Enable Row Level Security on audit tables
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_operation_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user has admin role in profiles or unit_commanders table
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ) OR EXISTS (
    SELECT 1 FROM public.unit_commanders WHERE id = auth.uid() AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies - Only admins and system can access audit logs
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
    FOR SELECT USING (public.is_admin_user());

CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true); -- Allow system to insert

CREATE POLICY "Admins can view report audit trail" ON public.report_audit_trail
    FOR SELECT USING (public.is_admin_user());

CREATE POLICY "System can insert report audit trail" ON public.report_audit_trail
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view access logs" ON public.report_access_logs
    FOR SELECT USING (public.is_admin_user());

CREATE POLICY "System can insert access logs" ON public.report_access_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own activity logs" ON public.user_activity_logs
    FOR SELECT USING (user_id = auth.uid() OR public.is_admin_user());

CREATE POLICY "System can insert user activity logs" ON public.user_activity_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view system operation logs" ON public.system_operation_logs
    FOR SELECT USING (public.is_admin_user());

CREATE POLICY "System can insert operation logs" ON public.system_operation_logs
    FOR INSERT WITH CHECK (true);

-- Create audit trigger function for reports table
CREATE OR REPLACE FUNCTION public.audit_report_changes()
RETURNS TRIGGER AS $$
DECLARE
    audit_log_id UUID;
    changed_fields JSONB := '{}';
    field_name TEXT;
    old_val TEXT;
    new_val TEXT;
BEGIN
    -- Create main audit log entry
    INSERT INTO public.audit_logs (
        entity_type,
        entity_id,
        action_type,
        actor_id,
        old_values,
        new_values,
        metadata,
        ip_address,
        user_agent,
        is_sensitive
    ) VALUES (
        'report',
        COALESCE(NEW.id, OLD.id),
        CASE 
            WHEN TG_OP = 'INSERT' THEN 'create'
            WHEN TG_OP = 'UPDATE' THEN 'update'
            WHEN TG_OP = 'DELETE' THEN 'delete'
        END,
        auth.uid(),
        CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END,
        jsonb_build_object(
            'operation', TG_OP,
            'table', TG_TABLE_NAME,
            'schema', TG_TABLE_SCHEMA
        ),
        inet_client_addr(),
        current_setting('request.headers', true)::jsonb ->> 'user-agent',
        true -- Reports are always sensitive
    ) RETURNING id INTO audit_log_id;

    -- For updates, log specific field changes
    IF TG_OP = 'UPDATE' THEN
        -- Check each field for changes and log them
        FOR field_name IN 
            SELECT unnest(ARRAY['description', 'threat_type', 'urgency', 'priority', 'status', 'assigned_to', 'validation_status'])
        LOOP
            EXECUTE format('SELECT ($1).%I::text, ($2).%I::text', field_name, field_name) 
            USING OLD, NEW INTO old_val, new_val;
            
            IF old_val IS DISTINCT FROM new_val THEN
                INSERT INTO public.report_audit_trail (
                    report_id,
                    audit_log_id,
                    field_changed,
                    previous_value,
                    new_value,
                    change_reason
                ) VALUES (
                    NEW.id,
                    audit_log_id,
                    field_name,
                    old_val,
                    new_val,
                    'System update' -- Can be enhanced to capture user input
                );
            END IF;
        END LOOP;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for reports table
CREATE TRIGGER reports_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION public.audit_report_changes();

-- Create function to log report access
CREATE OR REPLACE FUNCTION public.log_report_access(
    p_report_id UUID,
    p_access_type TEXT DEFAULT 'view',
    p_duration_seconds INTEGER DEFAULT NULL,
    p_accessed_sections JSONB DEFAULT NULL,
    p_purpose TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    audit_log_id UUID;
    access_log_id UUID;
BEGIN
    -- Create main audit log entry
    INSERT INTO public.audit_logs (
        entity_type,
        entity_id,
        action_type,
        actor_id,
        metadata,
        ip_address,
        user_agent,
        is_sensitive
    ) VALUES (
        'report',
        p_report_id,
        'access',
        auth.uid(),
        jsonb_build_object(
            'access_type', p_access_type,
            'purpose', p_purpose
        ),
        inet_client_addr(),
        current_setting('request.headers', true)::jsonb ->> 'user-agent',
        true
    ) RETURNING id INTO audit_log_id;

    -- Create specific access log entry
    INSERT INTO public.report_access_logs (
        report_id,
        audit_log_id,
        access_type,
        duration_seconds,
        accessed_sections,
        purpose
    ) VALUES (
        p_report_id,
        audit_log_id,
        p_access_type,
        p_duration_seconds,
        p_accessed_sections,
        p_purpose
    ) RETURNING id INTO access_log_id;

    RETURN access_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log user activities
CREATE OR REPLACE FUNCTION public.log_user_activity(
    p_user_id UUID,
    p_activity_type TEXT,
    p_success BOOLEAN DEFAULT true,
    p_failure_reason TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    audit_log_id UUID;
    activity_log_id UUID;
BEGIN
    INSERT INTO public.audit_logs (
        entity_type,
        entity_id,
        action_type,
        actor_id,
        metadata,
        ip_address,
        user_agent
    ) VALUES (
        'user',
        p_user_id,
        p_activity_type,
        p_user_id,
        p_metadata,
        inet_client_addr(),
        current_setting('request.headers', true)::jsonb ->> 'user-agent'
    ) RETURNING id INTO audit_log_id;

    INSERT INTO public.user_activity_logs (
        user_id,
        audit_log_id,
        activity_type,
        success,
        failure_reason
    ) VALUES (
        p_user_id,
        audit_log_id,
        p_activity_type,
        p_success,
        p_failure_reason
    ) RETURNING id INTO activity_log_id;

    RETURN activity_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime for audit logs (for admin dashboards)
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.report_audit_trail;
ALTER PUBLICATION supabase_realtime ADD TABLE public.report_access_logs;
