-- Migration: Add procurement workflow tables
-- Description: Creates tables for procurement requests, approval workflows, and related data structures
-- Created: 2026-01-14

-- Enable RLS
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Procurement requests table
CREATE TABLE procurement_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('equipment', 'supplies', 'services', 'software', 'facilities', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  estimated_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  vendor_name TEXT,
  vendor_contact TEXT,
  vendor_rating DECIMAL(2,1) CHECK (vendor_rating >= 0 AND vendor_rating <= 5),
  justification TEXT,
  required_by DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'ordered', 'received')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Procurement request items table
CREATE TABLE procurement_request_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES procurement_requests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Procurement approval workflows table
CREATE TABLE procurement_approval_workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Procurement approval workflow levels table
CREATE TABLE procurement_approval_workflow_levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES procurement_approval_workflows(id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  required_approvals INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Procurement approval workflow approvers table
CREATE TABLE procurement_approval_workflow_approvers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level_id UUID NOT NULL REFERENCES procurement_approval_workflow_levels(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(level_id, approver_id)
);

-- Procurement request approvals table
CREATE TABLE procurement_request_approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES procurement_requests(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES procurement_approval_workflow_levels(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'escalated')),
  decision TEXT CHECK (decision IN ('approve', 'reject', 'escalate')),
  comments TEXT,
  decided_at TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_procurement_requests_event_id ON procurement_requests(event_id);
CREATE INDEX idx_procurement_requests_requester_id ON procurement_requests(requester_id);
CREATE INDEX idx_procurement_requests_status ON procurement_requests(status);
CREATE INDEX idx_procurement_requests_category ON procurement_requests(category);
CREATE INDEX idx_procurement_request_items_request_id ON procurement_request_items(request_id);
CREATE INDEX idx_procurement_approval_workflows_event_id ON procurement_approval_workflows(event_id);
CREATE INDEX idx_procurement_approval_workflow_levels_workflow_id ON procurement_approval_workflow_levels(workflow_id);
CREATE INDEX idx_procurement_approval_workflow_approvers_level_id ON procurement_approval_workflow_approvers(level_id);
CREATE INDEX idx_procurement_request_approvals_request_id ON procurement_request_approvals(request_id);
CREATE INDEX idx_procurement_request_approvals_approver_id ON procurement_request_approvals(approver_id);
CREATE INDEX idx_procurement_request_approvals_status ON procurement_request_approvals(status);

-- Row Level Security
ALTER TABLE procurement_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_approval_workflow_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_approval_workflow_approvers ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_request_approvals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view procurement requests for their events" ON procurement_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = procurement_requests.event_id
      AND (events.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM event_participants
        WHERE event_participants.event_id = events.id
        AND event_participants.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can create procurement requests for their events" ON procurement_requests
  FOR INSERT WITH CHECK (
    auth.uid() = requester_id AND
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = procurement_requests.event_id
      AND (events.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM event_participants
        WHERE event_participants.event_id = events.id
        AND event_participants.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can update procurement requests they created or can approve" ON procurement_requests
  FOR UPDATE USING (
    auth.uid() = requester_id OR
    EXISTS (
      SELECT 1 FROM procurement_request_approvals
      WHERE procurement_request_approvals.request_id = procurement_requests.id
      AND procurement_request_approvals.approver_id = auth.uid()
    )
  );

CREATE POLICY "Users can view items for accessible procurement requests" ON procurement_request_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM procurement_requests
      WHERE procurement_requests.id = procurement_request_items.request_id
      AND EXISTS (
        SELECT 1 FROM events
        WHERE events.id = procurement_requests.event_id
        AND (events.owner_id = auth.uid() OR EXISTS (
          SELECT 1 FROM event_participants
          WHERE event_participants.event_id = events.id
          AND event_participants.user_id = auth.uid()
        ))
      )
    )
  );

CREATE POLICY "Users can manage items for requests they created" ON procurement_request_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM procurement_requests
      WHERE procurement_requests.id = procurement_request_items.request_id
      AND procurement_requests.requester_id = auth.uid()
    )
  );

CREATE POLICY "Users can view approval workflows for their events" ON procurement_approval_workflows
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = procurement_approval_workflows.event_id
      AND (events.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM event_participants
        WHERE event_participants.event_id = events.id
        AND event_participants.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can view workflow levels for accessible workflows" ON procurement_approval_workflow_levels
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM procurement_approval_workflows
      WHERE procurement_approval_workflows.id = procurement_approval_workflow_levels.workflow_id
      AND EXISTS (
        SELECT 1 FROM events
        WHERE events.id = procurement_approval_workflows.event_id
        AND (events.owner_id = auth.uid() OR EXISTS (
          SELECT 1 FROM event_participants
          WHERE event_participants.event_id = events.id
          AND event_participants.user_id = auth.uid()
        ))
      )
    )
  );

CREATE POLICY "Users can view workflow approvers for accessible workflows" ON procurement_approval_workflow_approvers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM procurement_approval_workflow_levels
      WHERE procurement_approval_workflow_levels.id = procurement_approval_workflow_approvers.level_id
      AND EXISTS (
        SELECT 1 FROM procurement_approval_workflows
        WHERE procurement_approval_workflows.id = procurement_approval_workflow_levels.workflow_id
        AND EXISTS (
          SELECT 1 FROM events
          WHERE events.id = procurement_approval_workflows.event_id
          AND (events.owner_id = auth.uid() OR EXISTS (
            SELECT 1 FROM event_participants
            WHERE event_participants.event_id = events.id
            AND event_participants.user_id = auth.uid()
          ))
        )
      )
    )
  );

CREATE POLICY "Users can view approvals for accessible requests" ON procurement_request_approvals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM procurement_requests
      WHERE procurement_requests.id = procurement_request_approvals.request_id
      AND EXISTS (
        SELECT 1 FROM events
        WHERE events.id = procurement_requests.event_id
        AND (events.owner_id = auth.uid() OR EXISTS (
          SELECT 1 FROM event_participants
          WHERE event_participants.event_id = events.id
          AND event_participants.user_id = auth.uid()
        ))
      )
    )
  );

CREATE POLICY "Approvers can update their approval decisions" ON procurement_request_approvals
  FOR UPDATE USING (auth.uid() = approver_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_procurement_requests_updated_at BEFORE UPDATE ON procurement_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_procurement_approval_workflows_updated_at BEFORE UPDATE ON procurement_approval_workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
