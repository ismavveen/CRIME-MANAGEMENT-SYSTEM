
-- Add columns to the assignments table for resolution reports
ALTER TABLE public.assignments
ADD COLUMN IF NOT EXISTS witness_info TEXT NULL,
ADD COLUMN IF NOT EXISTS resolution_evidence JSONB NULL;

-- Create a storage bucket for resolution evidence with specific file types and size limit
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('resolution-evidence', 'resolution-evidence', true, 10485760, ARRAY['image/jpeg', 'image/png', 'video/mp4', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO UPDATE 
SET public = true, 
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'video/mp4', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

-- RLS Policies for the new bucket, allowing authenticated users to manage their own files.
CREATE POLICY "Enable read access for all users on resolution evidence" ON storage.objects
FOR SELECT USING (bucket_id = 'resolution-evidence');

CREATE POLICY "Enable insert for authenticated users on resolution evidence" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resolution-evidence');

CREATE POLICY "Enable update for own files on resolution evidence" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'resolution-evidence' AND auth.uid() = owner);

CREATE POLICY "Enable delete for own files on resolution evidence" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'resolution-evidence' AND auth.uid() = owner);

