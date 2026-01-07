-- Corrigir recorrências com nextOccurrence nulo
-- Execute no SQL Editor do Supabase
BEGIN;

WITH child_data AS (
  SELECT
    "parentTransactionId" AS parent_id,
    GREATEST(MAX(COALESCE("currentInstallment", 0)), COUNT(*)) AS max_child_installment
  FROM transactions
  WHERE "parentTransactionId" IS NOT NULL
  GROUP BY "parentTransactionId"
),
base AS (
  SELECT
    t.id,
    t."recurrenceType",
    (t.date::date - INTERVAL '2 days') AS base_date,
    COALESCE(cd.max_child_installment, 0) AS max_child_installment
  FROM transactions t
  LEFT JOIN child_data cd ON cd.parent_id = t.id
  WHERE t."isRecurring" = true
    AND t."nextOccurrence" IS NULL
    AND t."isCancelled" = false
    AND t."parentTransactionId" IS NULL
    AND t."recurrenceType" IS NOT NULL
),
calc AS (
  SELECT
    b.id,
    b.max_child_installment,
    CASE b."recurrenceType"
      WHEN 'daily' THEN b.base_date + INTERVAL '1 day'
      WHEN 'weekly' THEN b.base_date + INTERVAL '7 days'
      WHEN 'monthly' THEN b.base_date + INTERVAL '1 month'
      WHEN 'yearly' THEN b.base_date + INTERVAL '1 year'
    END AS next_occurrence
  FROM base b
),
updated AS (
  UPDATE transactions t
  SET
    "nextOccurrence" = (calc.next_occurrence AT TIME ZONE 'UTC'),
    "currentInstallment" = GREATEST(
      1,
      COALESCE(t."currentInstallment", 0),
      COALESCE(calc.max_child_installment, 0)
    ),
    "updatedAt" = NOW()
  FROM calc
  WHERE t.id = calc.id
  RETURNING t.id
)
SELECT COUNT(*) AS fixed_transactions FROM updated;

COMMIT;
