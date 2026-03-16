-- Fluxo de feedback com moderação administrativa

BEGIN;

CREATE TABLE IF NOT EXISTS public.feedbacks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
    customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 2 AND 80),
    comment text NOT NULL CHECK (char_length(comment) BETWEEN 10 AND 800),
    rating smallint NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    moderated_at timestamptz,
    moderated_by text
);

CREATE INDEX IF NOT EXISTS idx_feedbacks_status_created_at
    ON public.feedbacks(status, created_at DESC);

DROP TRIGGER IF EXISTS trg_feedbacks_updated_at ON public.feedbacks;
CREATE TRIGGER trg_feedbacks_updated_at
BEFORE UPDATE ON public.feedbacks
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "feedbacks_public_read_approved" ON public.feedbacks;
DROP POLICY IF EXISTS "feedbacks_public_insert_pending" ON public.feedbacks;
DROP POLICY IF EXISTS "feedbacks_admin_read_all" ON public.feedbacks;
DROP POLICY IF EXISTS "feedbacks_admin_update" ON public.feedbacks;
DROP POLICY IF EXISTS "feedbacks_admin_delete" ON public.feedbacks;
DROP POLICY IF EXISTS "feedbacks_admin_insert" ON public.feedbacks;

CREATE POLICY "feedbacks_public_read_approved" ON public.feedbacks
FOR SELECT TO public
USING (status = 'approved');

CREATE POLICY "feedbacks_public_insert_pending" ON public.feedbacks
FOR INSERT TO public
WITH CHECK (status = 'pending');

CREATE POLICY "feedbacks_admin_read_all" ON public.feedbacks
FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY "feedbacks_admin_insert" ON public.feedbacks
FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "feedbacks_admin_update" ON public.feedbacks
FOR UPDATE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "feedbacks_admin_delete" ON public.feedbacks
FOR DELETE TO authenticated
USING (public.is_admin());

COMMIT;
