-- Create advance phase tables
-- Migration: 20260115000007_add_advance_phase_tables.sql

-- Production technical rider table
CREATE TABLE advance_production_rider (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_requirements JSONB,
  sound_requirements JSONB,
  lighting_requirements JSONB,
  power_requirements JSONB,
  backline_requirements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Production input list table
CREATE TABLE advance_input_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  microphones JSONB,
  instruments JSONB,
  effects JSONB,
  monitoring JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Production stage plot table
CREATE TABLE advance_stage_plot (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dimensions JSONB,
  elements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Production lighting plot table
CREATE TABLE advance_lighting_plot (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fixtures JSONB,
  cues JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Logistics load-in schedule table
CREATE TABLE advance_loadin_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  time_slot TEXT NOT NULL,
  activity TEXT NOT NULL,
  responsible_party TEXT,
  equipment_needed JSONB,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Logistics parking assignments table
CREATE TABLE advance_parking_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  area_name TEXT NOT NULL,
  vehicles JSONB,
  access_time TEXT,
  restrictions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Logistics transportation table
CREATE TABLE advance_transportation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shuttle_routes JSONB,
  equipment_transport JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Logistics vendor coordination table
CREATE TABLE advance_vendor_coordination (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_name TEXT NOT NULL,
  contact_info TEXT,
  arrival_time TEXT,
  setup_location TEXT,
  requirements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Equipment orders table
CREATE TABLE advance_equipment_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  delivery_date TIMESTAMP WITH TIME ZONE,
  cost DECIMAL(10,2),
  order_status TEXT DEFAULT 'ordered' CHECK (order_status IN ('ordered', 'confirmed', 'delivered')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Equipment rentals table
CREATE TABLE advance_equipment_rentals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  items JSONB,
  rental_start TIMESTAMP WITH TIME ZONE,
  rental_end TIMESTAMP WITH TIME ZONE,
  cost DECIMAL(10,2),
  delivery_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Equipment inventory check table
CREATE TABLE advance_inventory_check (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  owned_quantity INTEGER DEFAULT 0,
  rented_quantity INTEGER DEFAULT 0,
  total_quantity INTEGER DEFAULT 0,
  status TEXT DEFAULT 'sufficient' CHECK (status IN ('sufficient', 'low', 'shortage', 'excess')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Accommodations hotels table
CREATE TABLE advance_hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hotel_name TEXT NOT NULL,
  room_count INTEGER,
  check_in_date TIMESTAMP WITH TIME ZONE,
  check_out_date TIMESTAMP WITH TIME ZONE,
  nightly_rate DECIMAL(8,2),
  amenities JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Accommodations travel flights table
CREATE TABLE advance_travel_flights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route TEXT NOT NULL,
  passengers JSONB,
  departure_time TIMESTAMP WITH TIME ZONE,
  return_time TIMESTAMP WITH TIME ZONE,
  cost DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Accommodations ground transport table
CREATE TABLE advance_ground_transport (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transport_type TEXT NOT NULL,
  passengers JSONB,
  schedule TEXT,
  cost DECIMAL(8,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Accommodations per diems table
CREATE TABLE advance_per_diems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  person_name TEXT NOT NULL,
  daily_rate DECIMAL(8,2),
  days_count INTEGER,
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Catering menu table
CREATE TABLE advance_catering_menu (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_type TEXT NOT NULL,
  servings INTEGER,
  dietary_restrictions JSONB,
  cost DECIMAL(8,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Catering beverages table
CREATE TABLE advance_catering_beverages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  beverage_type TEXT NOT NULL,
  quantity INTEGER,
  cost DECIMAL(8,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Catering service timeline table
CREATE TABLE advance_catering_timeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_time TEXT NOT NULL,
  service_type TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Catering staffing table
CREATE TABLE advance_catering_staffing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  count INTEGER,
  hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Catering vendors table
CREATE TABLE advance_catering_vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_name TEXT NOT NULL,
  service_type TEXT,
  contact_info TEXT,
  contract_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Security personnel table
CREATE TABLE advance_security_personnel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  count INTEGER,
  shifts JSONB,
  training JSONB,
  cost DECIMAL(8,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Security equipment table
CREATE TABLE advance_security_equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipment_type TEXT NOT NULL,
  quantity INTEGER,
  location TEXT,
  purpose TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Security procedures table
CREATE TABLE advance_security_procedures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  procedure_type TEXT NOT NULL,
  procedures JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Security coordination table
CREATE TABLE advance_security_coordination (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_name TEXT NOT NULL,
  contact_info TEXT,
  responsibility TEXT,
  communication_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Medical facilities table
CREATE TABLE advance_medical_facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_type TEXT NOT NULL,
  location TEXT,
  staffing_count INTEGER,
  equipment JSONB,
  operating_hours TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Medical personnel table
CREATE TABLE advance_medical_personnel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  count INTEGER,
  certifications JSONB,
  shifts TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Medical protocols table
CREATE TABLE advance_medical_protocols (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  protocol_type TEXT NOT NULL,
  procedures JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Medical supplies table
CREATE TABLE advance_medical_supplies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  items JSONB,
  quantity INTEGER,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Communication internal table
CREATE TABLE advance_communication_internal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  method TEXT NOT NULL,
  purpose TEXT,
  frequency TEXT,
  responsible_party TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Communication radio channels table
CREATE TABLE advance_radio_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_name TEXT NOT NULL,
  purpose TEXT,
  users JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Communication emergency contacts table
CREATE TABLE advance_emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Communication press releases table
CREATE TABLE advance_press_releases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  release_date TIMESTAMP WITH TIME ZONE,
  topic TEXT,
  outlets JSONB,
  release_status TEXT DEFAULT 'draft' CHECK (release_status IN ('draft', 'approved', 'sent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Communication media coordination table
CREATE TABLE advance_media_coordination (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  press_area TEXT,
  credentials JSONB,
  interviews JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Contingency weather plan table
CREATE TABLE advance_weather_plan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  triggers JSONB,
  alternatives JSONB,
  equipment JSONB,
  communication JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Contingency technical failure table
CREATE TABLE advance_technical_failure (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_systems JSONB,
  procedures JSONB,
  testing JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Contingency crowd management table
CREATE TABLE advance_crowd_management (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  capacity_limits INTEGER,
  overflow_procedures JSONB,
  evacuation_routes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS on all tables
ALTER TABLE advance_production_rider ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_input_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_stage_plot ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_lighting_plot ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_loadin_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_parking_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_transportation ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_vendor_coordination ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_equipment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_equipment_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_inventory_check ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_travel_flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_ground_transport ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_per_diems ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_catering_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_catering_beverages ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_catering_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_catering_staffing ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_catering_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_security_personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_security_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_security_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_security_coordination ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_medical_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_medical_personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_medical_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_medical_supplies ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_communication_internal ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_radio_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_media_coordination ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_weather_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_technical_failure ENABLE ROW LEVEL SECURITY;
ALTER TABLE advance_crowd_management ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_advance_loadin_schedule_time ON advance_loadin_schedule(time_slot);
CREATE INDEX idx_advance_equipment_orders_status ON advance_equipment_orders(order_status);
CREATE INDEX idx_advance_equipment_rentals_category ON advance_equipment_rentals(category);
CREATE INDEX idx_advance_hotels_check_in ON advance_hotels(check_in_date);
CREATE INDEX idx_advance_travel_flights_departure ON advance_travel_flights(departure_time);
CREATE INDEX idx_advance_press_releases_date ON advance_press_releases(release_date);

-- RLS Policies
CREATE POLICY "Users can view their own advance production rider" ON advance_production_rider
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance production rider" ON advance_production_rider
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance input list" ON advance_input_list
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance input list" ON advance_input_list
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance stage plot" ON advance_stage_plot
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance stage plot" ON advance_stage_plot
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance lighting plot" ON advance_lighting_plot
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance lighting plot" ON advance_lighting_plot
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance load-in schedule" ON advance_loadin_schedule
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance load-in schedule" ON advance_loadin_schedule
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance parking assignments" ON advance_parking_assignments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance parking assignments" ON advance_parking_assignments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance transportation" ON advance_transportation
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance transportation" ON advance_transportation
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance vendor coordination" ON advance_vendor_coordination
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance vendor coordination" ON advance_vendor_coordination
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance equipment orders" ON advance_equipment_orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance equipment orders" ON advance_equipment_orders
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance equipment rentals" ON advance_equipment_rentals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance equipment rentals" ON advance_equipment_rentals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance inventory check" ON advance_inventory_check
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance inventory check" ON advance_inventory_check
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance hotels" ON advance_hotels
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance hotels" ON advance_hotels
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance travel flights" ON advance_travel_flights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance travel flights" ON advance_travel_flights
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance ground transport" ON advance_ground_transport
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance ground transport" ON advance_ground_transport
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance per diems" ON advance_per_diems
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance per diems" ON advance_per_diems
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance catering menu" ON advance_catering_menu
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance catering menu" ON advance_catering_menu
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance catering beverages" ON advance_catering_beverages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance catering beverages" ON advance_catering_beverages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance catering timeline" ON advance_catering_timeline
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance catering timeline" ON advance_catering_timeline
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance catering staffing" ON advance_catering_staffing
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance catering staffing" ON advance_catering_staffing
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance catering vendors" ON advance_catering_vendors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance catering vendors" ON advance_catering_vendors
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance security personnel" ON advance_security_personnel
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance security personnel" ON advance_security_personnel
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance security equipment" ON advance_security_equipment
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance security equipment" ON advance_security_equipment
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance security procedures" ON advance_security_procedures
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance security procedures" ON advance_security_procedures
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance security coordination" ON advance_security_coordination
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance security coordination" ON advance_security_coordination
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance medical facilities" ON advance_medical_facilities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance medical facilities" ON advance_medical_facilities
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance medical personnel" ON advance_medical_personnel
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance medical personnel" ON advance_medical_personnel
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance medical protocols" ON advance_medical_protocols
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance medical protocols" ON advance_medical_protocols
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance medical supplies" ON advance_medical_supplies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance medical supplies" ON advance_medical_supplies
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance communication internal" ON advance_communication_internal
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance communication internal" ON advance_communication_internal
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance radio channels" ON advance_radio_channels
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance radio channels" ON advance_radio_channels
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance emergency contacts" ON advance_emergency_contacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance emergency contacts" ON advance_emergency_contacts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance press releases" ON advance_press_releases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance press releases" ON advance_press_releases
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance media coordination" ON advance_media_coordination
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance media coordination" ON advance_media_coordination
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance weather plan" ON advance_weather_plan
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance weather plan" ON advance_weather_plan
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance technical failure" ON advance_technical_failure
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance technical failure" ON advance_technical_failure
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own advance crowd management" ON advance_crowd_management
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own advance crowd management" ON advance_crowd_management
  FOR ALL USING (auth.uid() = user_id);