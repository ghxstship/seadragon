-- Seed demo organization, role, user, profile, and membership
-- Applies to both local and remote environments (idempotent)

-- Requires: uuid-ossp, pgcrypto (for crypt)
DO $$
DECLARE
  v_email CONSTANT TEXT := 'admin@demo.com';
  v_password CONSTANT TEXT := 'demo123';
  v_org_slug CONSTANT TEXT := 'demo';
  v_org_name CONSTANT TEXT := 'Demo Organization';
  v_user_id TEXT;
  v_org_id TEXT;
  v_role_id TEXT;
  v_handle CONSTANT TEXT := 'demo-admin';
  v_slug CONSTANT TEXT := 'demo-admin';
BEGIN
  -- Ensure pgcrypto is available for password hashing
  PERFORM 1 FROM pg_extension WHERE extname = 'pgcrypto';
  IF NOT FOUND THEN
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
  END IF;

  -- Upsert organization
  INSERT INTO organizations (slug, name)
  VALUES (v_org_slug, v_org_name)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_org_id;

  -- Ensure admin role for the organization
  SELECT id INTO v_role_id
  FROM roles
  WHERE organization_id = v_org_id AND name = 'admin'
  LIMIT 1;

  IF v_role_id IS NULL THEN
    INSERT INTO roles (name, description, organization_id, permissions)
    VALUES ('admin', 'Demo administrator', v_org_id, '["*"]'::jsonb)
    RETURNING id INTO v_role_id;
  ELSE
    UPDATE roles
    SET description = 'Demo administrator',
        permissions = '["*"]'::jsonb
    WHERE id = v_role_id;
  END IF;

  -- Ensure auth user exists (password is bcrypt-hashed via crypt)
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email
  LIMIT 1;

  IF v_user_id IS NULL THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      aud,
      role
    )
    VALUES (
      uuid_generate_v4(),
      '00000000-0000-0000-0000-000000000000',
      v_email,
      crypt(v_password, gen_salt('bf')),
      now(),
      now(),
      now(),
      jsonb_build_object('first_name', 'Demo', 'last_name', 'Admin'),
      'authenticated',
      'authenticated'
    )
    RETURNING id INTO v_user_id;
  ELSE
    UPDATE auth.users
    SET encrypted_password = crypt(v_password, gen_salt('bf')),
        email_confirmed_at = now(),
        updated_at = now(),
        raw_user_meta_data = jsonb_build_object('first_name', 'Demo', 'last_name', 'Admin')
    WHERE id = v_user_id;
  END IF;

  -- Upsert application user record
  INSERT INTO users (id, email, first_name, last_name, email_verified)
  VALUES (v_user_id, v_email, 'Demo', 'Admin', TRUE)
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        email_verified = TRUE;

  -- Upsert membership
  INSERT INTO user_organizations (user_id, organization_id, role_id, is_active)
  VALUES (v_user_id, v_org_id, v_role_id, TRUE)
  ON CONFLICT (user_id, organization_id) DO UPDATE
    SET role_id = EXCLUDED.role_id,
        is_active = TRUE;

  -- Upsert profile
  INSERT INTO profiles (
    user_id,
    profile_type,
    handle,
    display_name,
    avatar_url,
    bio,
    visibility,
    verified,
    featured,
    slug,
    billing_status
  )
  VALUES (
    v_user_id,
    'member',
    v_handle,
    'Demo Admin',
    NULL,
    'Demo administrator account',
    'public',
    TRUE,
    FALSE,
    v_slug,
    'free'
  )
  ON CONFLICT (user_id) DO UPDATE
    SET handle = EXCLUDED.handle,
        display_name = EXCLUDED.display_name,
        bio = EXCLUDED.bio,
        visibility = EXCLUDED.visibility,
        verified = TRUE,
        featured = FALSE,
        slug = EXCLUDED.slug,
        billing_status = EXCLUDED.billing_status;
END;
$$;
