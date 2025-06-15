
-- Step 1: Unassign any reports that are currently assigned to a commander and are not yet resolved.
-- This will set them back to a 'pending' status so they can be reassigned later.
UPDATE public.reports
SET
  assigned_commander_id = NULL,
  assigned_to = NULL,
  status = 'pending'
WHERE
  assigned_commander_id IS NOT NULL AND status <> 'resolved';

-- Step 2: Delete all existing assignment records from the system.
DELETE FROM public.assignments;

-- Step 3: Delete all unit commanders from the system.
DELETE FROM public.unit_commanders;
