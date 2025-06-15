
-- Reset assignment-related system metrics to 0
UPDATE public.system_metrics
SET metric_value = 0
WHERE metric_name = 'active_operations';

-- Recalculate pending reports metric
WITH pending_count AS (
  SELECT count(*) as total FROM public.reports WHERE status = 'pending'
)
UPDATE public.system_metrics
SET metric_value = (SELECT total FROM pending_count)
WHERE metric_name = 'pending_reports';

-- Recalculate resolved reports metric
WITH resolved_count AS (
  SELECT count(*) as total FROM public.reports WHERE status = 'resolved'
)
UPDATE public.system_metrics
SET metric_value = (SELECT total FROM resolved_count)
WHERE metric_name = 'resolved_reports';
