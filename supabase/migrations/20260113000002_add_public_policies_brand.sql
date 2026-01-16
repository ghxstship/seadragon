-- Enable RLS on brand tables used by public brand pages
ALTER TABLE IF EXISTS brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS brand_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS brand_services ENABLE ROW LEVEL SECURITY;

-- Public read access for brand-facing content
CREATE POLICY "Public can view brand profiles" ON brand_profiles
  FOR SELECT USING (true);

CREATE POLICY "Public can view brand portfolio" ON brand_portfolio
  FOR SELECT USING (true);

CREATE POLICY "Public can view brand services" ON brand_services
  FOR SELECT USING (true);

-- Owners (profile owners) can manage their brand content
-- Assumes profiles.user_id holds the auth user; adjust if different
CREATE POLICY "Owners manage brand profiles" ON brand_profiles
  FOR ALL USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Owners manage brand portfolio" ON brand_portfolio
  FOR ALL USING (brand_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Owners manage brand services" ON brand_services
  FOR ALL USING (brand_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
