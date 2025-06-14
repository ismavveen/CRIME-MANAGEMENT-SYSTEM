
-- Add missing fields to the reports table
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS serial_number TEXT,
ADD COLUMN IF NOT EXISTS reporter_name TEXT,
ADD COLUMN IF NOT EXISTS reporter_contact TEXT,
ADD COLUMN IF NOT EXISTS reporter_phone TEXT,
ADD COLUMN IF NOT EXISTS reporter_email TEXT,
ADD COLUMN IF NOT EXISTS submission_source TEXT DEFAULT 'internal_portal',
ADD COLUMN IF NOT EXISTS validation_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS metadata JSONB,
ADD COLUMN IF NOT EXISTS documents TEXT[];

-- Update existing reports to have serial numbers using a different approach
DO $$
DECLARE
    rec RECORD;
    counter INTEGER := 1;
BEGIN
    FOR rec IN SELECT id, created_at FROM public.reports WHERE serial_number IS NULL ORDER BY created_at LOOP
        UPDATE public.reports 
        SET serial_number = 'DHQ-' || EXTRACT(YEAR FROM rec.created_at) || '-' || LPAD(counter::TEXT, 6, '0')
        WHERE id = rec.id;
        counter := counter + 1;
    END LOOP;
END $$;

-- Create index for faster serial number lookups
CREATE INDEX IF NOT EXISTS idx_reports_serial_number ON public.reports(serial_number);
