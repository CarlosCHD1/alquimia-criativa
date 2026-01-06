-- 1. STORAGE BUCKETS SETUP
-- We need to insert into storage.buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('brand-assets', 'brand-assets', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('generated', 'generated', true) ON CONFLICT (id) DO NOTHING;

-- Policies for AVATARS bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- Policies for BRAND ASSETS bucket
CREATE POLICY "Brand assets are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'brand-assets');
CREATE POLICY "Users can upload brand assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'brand-assets' AND auth.uid() = owner);

-- Policies for GENERATED bucket
CREATE POLICY "Generated images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'generated');
CREATE POLICY "Users can upload generated images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'generated' AND auth.uid() = owner);


-- 2. ADMIN AUDIT LOGS
-- Track critical actions taken by admins
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL, -- e.g., 'banned_user', 'added_credits'
    target_user_id UUID REFERENCES public.profiles(id),
    details JSONB DEFAULT '{}'::JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Audit Logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit logs" ON public.admin_audit_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
     
-- 3. FUNCTION TO CHECK ADMIN STATUS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
