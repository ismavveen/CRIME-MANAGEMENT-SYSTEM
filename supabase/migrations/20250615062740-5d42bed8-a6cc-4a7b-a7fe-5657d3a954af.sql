
-- Create file_scan_logs table to store virus scan results
CREATE TABLE public.file_scan_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_url TEXT NOT NULL,
  report_id UUID REFERENCES public.reports(id),
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  scan_result TEXT NOT NULL DEFAULT 'pending',
  threats_detected TEXT[] DEFAULT ARRAY[]::TEXT[],
  scan_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  scanner_version TEXT DEFAULT 'VirusTotal v3',
  scan_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS to file_scan_logs table
ALTER TABLE public.file_scan_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all scan logs
CREATE POLICY "Admins can view all file scan logs" ON public.file_scan_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) OR 
  EXISTS (
    SELECT 1 FROM public.unit_commanders 
    WHERE id = auth.uid() AND status = 'active'
  )
);

-- Create policy for system to insert scan logs
CREATE POLICY "System can insert file scan logs" ON public.file_scan_logs
FOR INSERT WITH CHECK (true);

-- Create policy for system to update scan logs
CREATE POLICY "System can update file scan logs" ON public.file_scan_logs
FOR UPDATE USING (true);
