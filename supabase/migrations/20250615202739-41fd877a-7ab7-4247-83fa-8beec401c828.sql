
-- Add columns to the assignments table to support acceptance, rejection, and operational outcomes
ALTER TABLE public.assignments
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT NULL,
ADD COLUMN IF NOT EXISTS response_timestamp TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS response_timeframe INTEGER NULL,
ADD COLUMN IF NOT EXISTS operation_outcome TEXT NULL,
ADD COLUMN IF NOT EXISTS casualties INTEGER NULL,
ADD COLUMN IF NOT EXISTS injured_personnel INTEGER NULL,
ADD COLUMN IF NOT EXISTS civilians_rescued INTEGER NULL,
ADD COLUMN IF NOT EXISTS weapons_recovered INTEGER NULL,
ADD COLUMN IF NOT EXISTS custom_message TEXT NULL;
