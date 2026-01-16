-- Create asset inventory tables
-- Migration: 20260115000006_add_asset_inventory_tables.sql

-- Assets catalog table
CREATE TABLE assets_catalog (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_name TEXT NOT NULL,
  category TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  description TEXT,
  manufacturer TEXT,
  model TEXT,
  serial_number TEXT,
  purchase_date DATE,
  purchase_price DECIMAL(12,2),
  current_value DECIMAL(12,2),
  location TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'disposed')),
  assigned_to TEXT,
  warranty_expiry DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Asset categories table
CREATE TABLE asset_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name TEXT NOT NULL,
  description TEXT,
  depreciation_rate DECIMAL(5,4) DEFAULT 0.10,
  useful_life INTEGER DEFAULT 5,
  assets_count INTEGER DEFAULT 0,
  total_value DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Inventory stock levels table
CREATE TABLE inventory_stock_levels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  current_stock INTEGER DEFAULT 0,
  minimum_stock INTEGER DEFAULT 0,
  maximum_stock INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 0,
  unit_cost DECIMAL(10,2) DEFAULT 0,
  supplier TEXT,
  last_ordered DATE,
  status TEXT DEFAULT 'optimal' CHECK (status IN ('optimal', 'low', 'overstock', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Inventory movements table
CREATE TABLE inventory_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'transfer', 'adjustment')),
  quantity INTEGER NOT NULL,
  from_location TEXT,
  to_location TEXT,
  movement_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  performed_by TEXT,
  reason TEXT,
  reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Inventory audits table
CREATE TABLE inventory_audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  audit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  location TEXT NOT NULL,
  auditor TEXT NOT NULL,
  items_checked INTEGER DEFAULT 0,
  discrepancies INTEGER DEFAULT 0,
  audit_status TEXT DEFAULT 'passed' CHECK (audit_status IN ('passed', 'minor_issues', 'major_issues')),
  findings JSONB,
  corrective_actions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Maintenance schedules table
CREATE TABLE maintenance_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES assets_catalog(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL,
  frequency TEXT NOT NULL,
  next_due TIMESTAMP WITH TIME ZONE,
  last_performed TIMESTAMP WITH TIME ZONE,
  estimated_cost DECIMAL(10,2) DEFAULT 0,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_to TEXT,
  schedule_status TEXT DEFAULT 'scheduled' CHECK (schedule_status IN ('scheduled', 'overdue', 'completed', 'in_progress')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Work orders table
CREATE TABLE work_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES assets_catalog(id) ON DELETE CASCADE,
  issue_description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  reported_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reported_by TEXT,
  assigned_to TEXT,
  work_status TEXT DEFAULT 'open' CHECK (work_status IN ('open', 'in_progress', 'completed', 'cancelled')),
  estimated_cost DECIMAL(10,2) DEFAULT 0,
  actual_cost DECIMAL(10,2),
  completion_date TIMESTAMP WITH TIME ZONE,
  notes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Preventive maintenance table
CREATE TABLE preventive_maintenance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES assets_catalog(id) ON DELETE CASCADE,
  task_description TEXT NOT NULL,
  frequency TEXT NOT NULL,
  last_completed TIMESTAMP WITH TIME ZONE,
  next_due TIMESTAMP WITH TIME ZONE,
  estimated_duration INTEGER, -- hours
  parts_required JSONB,
  pm_status TEXT DEFAULT 'due' CHECK (pm_status IN ('due', 'overdue', 'completed', 'scheduled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Depreciation methods table
CREATE TABLE depreciation_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  method_name TEXT NOT NULL,
  description TEXT,
  formula TEXT,
  applicable_categories JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Asset depreciation calculations table
CREATE TABLE asset_depreciation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES assets_catalog(id) ON DELETE CASCADE,
  method_name TEXT NOT NULL,
  original_value DECIMAL(12,2),
  accumulated_depreciation DECIMAL(12,2) DEFAULT 0,
  current_value DECIMAL(12,2),
  monthly_depreciation DECIMAL(10,2) DEFAULT 0,
  useful_life INTEGER,
  years_used DECIMAL(5,2) DEFAULT 0,
  remaining_life DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Depreciation schedules table
CREATE TABLE depreciation_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  period TEXT NOT NULL,
  total_assets INTEGER DEFAULT 0,
  total_original_value DECIMAL(15,2) DEFAULT 0,
  total_depreciation DECIMAL(15,2) DEFAULT 0,
  net_book_value DECIMAL(15,2) DEFAULT 0,
  depreciation_expense DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Asset acquisitions table
CREATE TABLE asset_acquisitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_name TEXT NOT NULL,
  category TEXT NOT NULL,
  acquisition_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cost DECIMAL(12,2),
  supplier TEXT,
  warranty_months INTEGER DEFAULT 12,
  acquisition_status TEXT DEFAULT 'active' CHECK (acquisition_status IN ('active', 'pending', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Asset disposals table
CREATE TABLE asset_disposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES assets_catalog(id) ON DELETE CASCADE,
  disposal_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  disposal_method TEXT NOT NULL CHECK (disposal_method IN ('sale', 'scrap', 'donation', 'trade')),
  proceeds DECIMAL(12,2),
  reason TEXT,
  approved_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Asset transfers table
CREATE TABLE asset_transfers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES assets_catalog(id) ON DELETE CASCADE,
  from_location TEXT,
  to_location TEXT NOT NULL,
  transfer_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT,
  approved_by TEXT,
  transfer_status TEXT DEFAULT 'completed' CHECK (transfer_status IN ('completed', 'in_transit', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Asset utilization metrics table
CREATE TABLE asset_utilization (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID REFERENCES assets_catalog(id) ON DELETE CASCADE,
  utilization_rate DECIMAL(5,2) DEFAULT 0, -- percentage
  downtime_hours DECIMAL(8,2) DEFAULT 0,
  maintenance_cost DECIMAL(10,2) DEFAULT 0,
  efficiency DECIMAL(5,2) DEFAULT 0, -- percentage
  period TEXT NOT NULL,
  recorded_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE assets_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE preventive_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE depreciation_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_depreciation ENABLE ROW LEVEL SECURITY;
ALTER TABLE depreciation_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_acquisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_disposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_utilization ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_assets_catalog_category ON assets_catalog(category);
CREATE INDEX idx_assets_catalog_status ON assets_catalog(status);
CREATE INDEX idx_assets_catalog_location ON assets_catalog(location);
CREATE INDEX idx_asset_categories_name ON asset_categories(category_name);
CREATE INDEX idx_inventory_stock_levels_category ON inventory_stock_levels(category);
CREATE INDEX idx_inventory_stock_levels_status ON inventory_stock_levels(status);
CREATE INDEX idx_inventory_movements_date ON inventory_movements(movement_date);
CREATE INDEX idx_inventory_movements_type ON inventory_movements(movement_type);
CREATE INDEX idx_inventory_audits_date ON inventory_audits(audit_date);
CREATE INDEX idx_maintenance_schedules_asset_id ON maintenance_schedules(asset_id);
CREATE INDEX idx_maintenance_schedules_next_due ON maintenance_schedules(next_due);
CREATE INDEX idx_maintenance_schedules_status ON maintenance_schedules(schedule_status);
CREATE INDEX idx_work_orders_asset_id ON work_orders(asset_id);
CREATE INDEX idx_work_orders_status ON work_orders(work_status);
CREATE INDEX idx_work_orders_priority ON work_orders(priority);
CREATE INDEX idx_preventive_maintenance_asset_id ON preventive_maintenance(asset_id);
CREATE INDEX idx_preventive_maintenance_next_due ON preventive_maintenance(next_due);
CREATE INDEX idx_asset_depreciation_asset_id ON asset_depreciation(asset_id);
CREATE INDEX idx_asset_acquisitions_date ON asset_acquisitions(acquisition_date);
CREATE INDEX idx_asset_disposals_date ON asset_disposals(disposal_date);
CREATE INDEX idx_asset_transfers_date ON asset_transfers(transfer_date);
CREATE INDEX idx_asset_utilization_asset_id ON asset_utilization(asset_id);
CREATE INDEX idx_asset_utilization_period ON asset_utilization(period);

-- RLS Policies
CREATE POLICY "Users can view their own assets catalog" ON assets_catalog
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own assets catalog" ON assets_catalog
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own asset categories" ON asset_categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own asset categories" ON asset_categories
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own inventory stock levels" ON inventory_stock_levels
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own inventory stock levels" ON inventory_stock_levels
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own inventory movements" ON inventory_movements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own inventory movements" ON inventory_movements
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own inventory audits" ON inventory_audits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own inventory audits" ON inventory_audits
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own maintenance schedules" ON maintenance_schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own maintenance schedules" ON maintenance_schedules
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own work orders" ON work_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own work orders" ON work_orders
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own preventive maintenance" ON preventive_maintenance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own preventive maintenance" ON preventive_maintenance
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own depreciation methods" ON depreciation_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own depreciation methods" ON depreciation_methods
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own asset depreciation" ON asset_depreciation
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own asset depreciation" ON asset_depreciation
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own depreciation schedules" ON depreciation_schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own depreciation schedules" ON depreciation_schedules
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own asset acquisitions" ON asset_acquisitions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own asset acquisitions" ON asset_acquisitions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own asset disposals" ON asset_disposals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own asset disposals" ON asset_disposals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own asset transfers" ON asset_transfers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own asset transfers" ON asset_transfers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own asset utilization" ON asset_utilization
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own asset utilization" ON asset_utilization
  FOR ALL USING (auth.uid() = user_id);