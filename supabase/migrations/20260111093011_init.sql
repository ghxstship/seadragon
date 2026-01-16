-- Initial migration for ATLVS + GVTEWAY super app
-- Generated from Prisma schema for PostgreSQL/Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE organizations (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  domain TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Branding settings
CREATE TABLE branding_settings (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  organization_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  logo JSONB,
  colors JSONB,
  typography JSONB,
  border_radius TEXT DEFAULT '8px',
  mode TEXT DEFAULT 'system',
  CONSTRAINT fk_branding_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Integration settings
CREATE TABLE integration_settings (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  organization_id TEXT NOT NULL UNIQUE,
  stripe JSONB,
  quickbooks JSONB,
  xero JSONB,
  slack JSONB,
  teams JSONB,
  discord JSONB,
  google JSONB,
  outlook JSONB,
  eventbrite JSONB,
  ticketmaster JSONB,
  zapier JSONB,
  CONSTRAINT fk_integration_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Permission settings
CREATE TABLE permission_settings (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  organization_id TEXT NOT NULL UNIQUE,
  CONSTRAINT fk_permission_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  email TEXT NOT NULL UNIQUE,
  username TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  avatar TEXT,
  phone TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  password_hash TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  social_links JSONB
);

-- Roles
CREATE TABLE roles (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  description TEXT,
  organization_id TEXT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '[]',
  CONSTRAINT fk_role_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- User organizations junction
CREATE TABLE user_organizations (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  CONSTRAINT fk_user_org_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_org_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_org_role FOREIGN KEY (role_id) REFERENCES roles(id),
  CONSTRAINT unique_user_org UNIQUE (user_id, organization_id)
);

-- Sessions
CREATE TABLE sessions (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Activities
CREATE TABLE activities (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_activity_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Workspaces
CREATE TABLE workspaces (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  organization_id TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_workspace_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT unique_workspace_org_slug UNIQUE (organization_id, slug)
);

-- Projects
CREATE TABLE projects (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  workspace_id TEXT NOT NULL,
  status TEXT DEFAULT 'concept',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_project_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  CONSTRAINT unique_project_workspace_slug UNIQUE (workspace_id, slug)
);

-- Teams
CREATE TABLE teams (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  description TEXT,
  organization_id TEXT NOT NULL,
  workspace_id TEXT,
  type TEXT DEFAULT 'department',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_team_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT fk_team_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
);

-- Team memberships
CREATE TABLE team_memberships (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_team_membership_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_team_membership_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_team UNIQUE (user_id, team_id)
);

-- Organization settings
CREATE TABLE organization_settings (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  organization_id TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  category TEXT DEFAULT 'general',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_org_setting_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
  CONSTRAINT unique_org_setting_key UNIQUE (organization_id, key)
);

-- Policies
CREATE TABLE policies (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  description TEXT,
  rules JSONB NOT NULL,
  organization_id TEXT NOT NULL,
  CONSTRAINT fk_policy_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Follow relationships
CREATE TABLE follows (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  follower_id TEXT NOT NULL,
  following_id TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_follow_follower FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_follow_following FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);

-- Comments
CREATE TABLE comments (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  parent_id TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_comment_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_comment_parent FOREIGN KEY (parent_id) REFERENCES comments(id)
);

-- Direct messages
CREATE TABLE messages (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  content TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_message_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Likes
CREATE TABLE likes (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_like UNIQUE (user_id, entity_type, entity_id)
);

-- Categories
CREATE TABLE categories (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL,
  parent_id TEXT,
  organization_id TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES categories(id),
  CONSTRAINT fk_category_organization FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Destinations
CREATE TABLE destinations (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL,
  address JSONB,
  coordinates JSONB,
  capacity INTEGER,
  images JSONB NOT NULL DEFAULT '[]',
  website TEXT,
  phone TEXT,
  email TEXT,
  organization_id TEXT,
  category_id TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  metadata JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_destination_organization FOREIGN KEY (organization_id) REFERENCES organizations(id),
  CONSTRAINT fk_destination_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Experiences
CREATE TABLE experiences (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL,
  duration INTEGER,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  max_capacity INTEGER,
  min_capacity INTEGER DEFAULT 1,
  organization_id TEXT,
  category_id TEXT,
  destination_id TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  metadata JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_experience_organization FOREIGN KEY (organization_id) REFERENCES organizations(id),
  CONSTRAINT fk_experience_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT fk_experience_destination FOREIGN KEY (destination_id) REFERENCES destinations(id)
);

-- Events
CREATE TABLE events (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  project_id TEXT NOT NULL,
  venue_id TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  capacity INTEGER,
  status TEXT DEFAULT 'planning',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_event_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_event_venue FOREIGN KEY (venue_id) REFERENCES destinations(id),
  CONSTRAINT unique_event_project_slug UNIQUE (project_id, slug)
);

-- Productions
CREATE TABLE productions (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  event_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_production_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Schedules
CREATE TABLE schedules (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  event_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_schedule_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Budgets
CREATE TABLE budgets (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  event_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'planned',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_budget_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- People
CREATE TABLE people (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  role TEXT,
  type TEXT DEFAULT 'contact',
  project_id TEXT NOT NULL,
  metadata JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_person_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Credentials
CREATE TABLE credentials (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  event_id TEXT NOT NULL,
  type TEXT NOT NULL,
  level TEXT NOT NULL,
  zones JSONB NOT NULL DEFAULT '[]',
  department TEXT,
  position TEXT,
  person_id TEXT NOT NULL,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_to TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_credential_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_credential_person FOREIGN KEY (person_id) REFERENCES people(id)
);

-- Assets
CREATE TABLE assets (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT,
  description TEXT,
  project_id TEXT NOT NULL,
  owner_id TEXT,
  location TEXT,
  status TEXT DEFAULT 'available',
  metadata JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_asset_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Places (venues within projects)
CREATE TABLE places (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  address JSONB,
  capacity INTEGER,
  description TEXT,
  project_id TEXT NOT NULL,
  metadata JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_place_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Tickets
CREATE TABLE tickets (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  event_id TEXT NOT NULL,
  user_id TEXT,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  quantity INTEGER DEFAULT 1,
  sold INTEGER DEFAULT 0,
  available INTEGER,
  sale_start TIMESTAMP WITH TIME ZONE,
  sale_end TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_ticket_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_ticket_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Ticket purchases
CREATE TABLE ticket_purchases (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  ticket_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'confirmed',
  payment_id TEXT,
  qr_code TEXT,
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  checked_in_by TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_ticket_purchase_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  CONSTRAINT fk_ticket_purchase_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_ticket_purchase UNIQUE (ticket_id, user_id)
);

-- Memberships
CREATE TABLE memberships (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  interval TEXT DEFAULT 'year',
  benefits JSONB NOT NULL DEFAULT '[]',
  max_members INTEGER,
  current_members INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  organization_id TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_membership_organization FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- User memberships
CREATE TABLE user_memberships (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL,
  membership_id TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  stripe_subscription_id TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user_membership_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_membership_membership FOREIGN KEY (membership_id) REFERENCES memberships(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_membership UNIQUE (user_id, membership_id)
);

-- Reservations
CREATE TABLE reservations (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  experience_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time TIMESTAMP WITH TIME ZONE,
  guests INTEGER DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'confirmed',
  payment_id TEXT,
  notes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_reservation_experience FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE,
  CONSTRAINT fk_reservation_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Itineraries
CREATE TABLE itineraries (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'planning',
  total_cost DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_itinerary_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Itinerary items
CREATE TABLE itinerary_items (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  itinerary_id TEXT NOT NULL,
  type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  cost DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'planned',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_itinerary_item_itinerary FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE
);

-- Reviews
CREATE TABLE reviews (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  helpful INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payments
CREATE TABLE payments (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  metadata JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Wallets
CREATE TABLE wallets (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL UNIQUE,
  balance DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  credits DECIMAL(10,2) DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Wallet transactions
CREATE TABLE wallet_transactions (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  wallet_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  reference_id TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_wallet_transaction_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
);

-- Products
CREATE TABLE products (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  images JSONB NOT NULL DEFAULT '[]',
  category TEXT,
  inventory INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  organization_id TEXT,
  metadata JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_product_organization FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Carts
CREATE TABLE carts (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total_amount DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Media
CREATE TABLE media (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size BIGINT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  uploaded_by TEXT NOT NULL,
  alt TEXT,
  caption TEXT,
  tags JSONB NOT NULL DEFAULT '[]',
  metadata JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_media_uploader FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications
CREATE TABLE notifications (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT,
  metadata JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_user_organizations_user_id ON user_organizations(user_id);
CREATE INDEX idx_user_organizations_organization_id ON user_organizations(organization_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_workspaces_organization_id ON workspaces(organization_id);
CREATE INDEX idx_projects_workspace_id ON projects(workspace_id);
CREATE INDEX idx_teams_organization_id ON teams(organization_id);
CREATE INDEX idx_team_memberships_user_id ON team_memberships(user_id);
CREATE INDEX idx_team_memberships_team_id ON team_memberships(team_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_entity_type_entity_id ON comments(entity_type, entity_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_entity_type_entity_id ON likes(entity_type, entity_id);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_organization_id ON categories(organization_id);
CREATE INDEX idx_destinations_organization_id ON destinations(organization_id);
CREATE INDEX idx_destinations_category_id ON destinations(category_id);
CREATE INDEX idx_experiences_organization_id ON experiences(organization_id);
CREATE INDEX idx_experiences_category_id ON experiences(category_id);
CREATE INDEX idx_experiences_destination_id ON experiences(destination_id);
CREATE INDEX idx_events_project_id ON events(project_id);
CREATE INDEX idx_events_venue_id ON events(venue_id);
CREATE INDEX idx_productions_event_id ON productions(event_id);
CREATE INDEX idx_schedules_event_id ON schedules(event_id);
CREATE INDEX idx_budgets_event_id ON budgets(event_id);
CREATE INDEX idx_people_project_id ON people(project_id);
CREATE INDEX idx_credentials_event_id ON credentials(event_id);
CREATE INDEX idx_credentials_person_id ON credentials(person_id);
CREATE INDEX idx_assets_project_id ON assets(project_id);
CREATE INDEX idx_places_project_id ON places(project_id);
CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_ticket_purchases_ticket_id ON ticket_purchases(ticket_id);
CREATE INDEX idx_ticket_purchases_user_id ON ticket_purchases(user_id);
CREATE INDEX idx_memberships_organization_id ON memberships(organization_id);
CREATE INDEX idx_user_memberships_user_id ON user_memberships(user_id);
CREATE INDEX idx_user_memberships_membership_id ON user_memberships(membership_id);
CREATE INDEX idx_reservations_experience_id ON reservations(experience_id);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX idx_itinerary_items_itinerary_id ON itinerary_items(itinerary_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_entity_type_entity_id ON reviews(entity_type, entity_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_products_organization_id ON products(organization_id);
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Enable Row Level Security for multi-tenant isolation
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE productions ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can access data from their organizations)
-- Note: These are basic policies; in production, adjust based on role permissions

-- Organizations: Users can see organizations they belong to
CREATE POLICY "Users can view their organizations" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    )
  );

-- Users: Users can view their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (id = auth.uid());

-- User organizations: Users can view their memberships
CREATE POLICY "Users can view own memberships" ON user_organizations
  FOR SELECT USING (user_id = auth.uid());

-- Workspaces: Users can access workspaces in their organizations
CREATE POLICY "Users can view workspaces in their orgs" ON workspaces
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    )
  );

-- Projects: Users can access projects in workspaces they can access
CREATE POLICY "Users can view projects in their workspaces" ON projects
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE organization_id IN (
        SELECT organization_id FROM user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- Events: Users can access events in their projects
CREATE POLICY "Users can view events in their projects" ON events
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
          SELECT organization_id FROM user_organizations
          WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Similar policies for other tables with organization/project relationships
-- For brevity, applying basic access control
-- In production, refine based on specific role permissions from the outline

CREATE POLICY "Users can view destinations in their orgs" ON destinations
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    ) OR organization_id IS NULL
  );

CREATE POLICY "Users can view experiences in their orgs" ON experiences
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    ) OR organization_id IS NULL
  );

CREATE POLICY "Users can view memberships in their orgs" ON memberships
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    ) OR organization_id IS NULL
  );

CREATE POLICY "Users can view products in their orgs" ON products
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    ) OR organization_id IS NULL
  );

-- Personal data policies
CREATE POLICY "Users can view own itineraries" ON itineraries
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own reservations" ON reservations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own wallet" ON wallets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own wallet transactions" ON wallet_transactions
  FOR SELECT USING (
    wallet_id IN (
      SELECT id FROM wallets WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own carts" ON carts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- Public content policies (no organization restriction for public experiences/destinations)
-- Already covered above with OR organization_id IS NULL

-- Enable RLS on all tables (already done above)
