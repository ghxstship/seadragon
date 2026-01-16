-- Create content management tables
-- Migration: 20260115000010_add_content_management_tables.sql

-- Content items table
CREATE TABLE content_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('document', 'image', 'video', 'audio', 'archive', 'other')),
  file_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  tags TEXT[],
  category TEXT,
  content_status TEXT DEFAULT 'draft' CHECK (content_status IN ('draft', 'review', 'published', 'archived')),
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Content collections table
CREATE TABLE content_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  collection_type TEXT DEFAULT 'library' CHECK (collection_type IN ('library', 'project', 'campaign', 'department')),
  permissions TEXT DEFAULT 'private' CHECK (permissions IN ('private', 'team', 'organization', 'public')),
  owner_id UUID REFERENCES profiles(id),
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Content collection members table
CREATE TABLE content_collection_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID REFERENCES content_collections(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  added_by UUID REFERENCES profiles(id),
  UNIQUE(collection_id, user_id)
);

-- Content item collaborators table
CREATE TABLE content_item_collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  added_by UUID REFERENCES profiles(id),
  UNIQUE(content_item_id, user_id)
);

-- Content approval workflows table
CREATE TABLE content_approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  workflow_id TEXT NOT NULL,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'revision')),
  current_step TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Content approval approvers table
CREATE TABLE content_approval_approvers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  approval_id UUID REFERENCES content_approvals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  approver_status TEXT DEFAULT 'pending' CHECK (approver_status IN ('pending', 'approved', 'rejected')),
  comments TEXT,
  decided_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(approval_id, user_id)
);

-- Content workflow configurations table
CREATE TABLE content_workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_name TEXT NOT NULL,
  description TEXT,
  workflow_config JSONB,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_collection_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_item_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_approval_approvers ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_workflows ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_content_items_type ON content_items(content_type);
CREATE INDEX idx_content_items_status ON content_items(content_status);
CREATE INDEX idx_content_items_category ON content_items(category);
CREATE INDEX idx_content_items_created_by ON content_items(created_by);
CREATE INDEX idx_content_collections_type ON content_collections(collection_type);
CREATE INDEX idx_content_collections_permissions ON content_collections(permissions);
CREATE INDEX idx_content_approvals_status ON content_approvals(approval_status);
CREATE INDEX idx_content_workflows_active ON content_workflows(is_active);

-- RLS Policies
CREATE POLICY "Users can view their own content items" ON content_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own content items" ON content_items
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own content collections" ON content_collections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own content collections" ON content_collections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view collection members for collections they have access to" ON content_collection_members
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM content_collections cc
      WHERE cc.id = collection_id AND cc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage collection members for collections they own" ON content_collection_members
  FOR ALL USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM content_collections cc
      WHERE cc.id = collection_id AND cc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view collaborators for content items they have access to" ON content_item_collaborators
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM content_items ci
      WHERE ci.id = content_item_id AND ci.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage collaborators for content items they own" ON content_item_collaborators
  FOR ALL USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM content_items ci
      WHERE ci.id = content_item_id AND ci.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own content approvals" ON content_approvals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own content approvals" ON content_approvals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view approval approvers for approvals they have access to" ON content_approval_approvers
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM content_approvals ca
      WHERE ca.id = approval_id AND ca.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage approval approvers for approvals they own" ON content_approval_approvers
  FOR ALL USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM content_approvals ca
      WHERE ca.id = approval_id AND ca.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own content workflows" ON content_workflows
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own content workflows" ON content_workflows
  FOR ALL USING (auth.uid() = user_id);