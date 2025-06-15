
ALTER TABLE public.assignments
DROP CONSTRAINT IF EXISTS assignments_status_check;

ALTER TABLE public.assignments
ADD CONSTRAINT assignments_status_check
CHECK (status IN ('pending', 'accepted', 'responded_to', 'resolved'));
