-- Migration: Add train phase workflow tables
-- Description: Creates tables for train phase data structures including briefings, safety training, technical rehearsals, and emergency procedures
-- Created: 2026-01-14

-- Enable RLS
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Train briefings all hands table
CREATE TABLE train_briefings_all_hands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  attendees TEXT[],
  agenda TEXT[],
  materials TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Train briefings department table
CREATE TABLE train_briefings_department (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  attendees TEXT[],
  topics TEXT[],
  coordinator TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Train safety training sessions table
CREATE TABLE train_safety_training_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  trainer TEXT,
  attendees TEXT[],
  duration INTEGER NOT NULL,
  certification BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Train safety training certifications table
CREATE TABLE train_safety_training_certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  certification TEXT NOT NULL,
  required_for TEXT[],
  validity TEXT,
  renewal TEXT,
  status TEXT NOT NULL DEFAULT 'current' CHECK (status IN ('current', 'expiring', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Train technical rehearsals schedule table
CREATE TABLE train_technical_rehearsals_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  session TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time TEXT NOT NULL,
  duration INTEGER NOT NULL,
  focus TEXT[],
  participants TEXT[],
  objectives TEXT[],
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Train sound checks sessions table
CREATE TABLE train_sound_checks_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  act TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time TEXT NOT NULL,
  duration INTEGER NOT NULL,
  engineer TEXT,
  equipment TEXT[],
  issues TEXT[],
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'issues')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Train lighting cues table
CREATE TABLE train_lighting_cues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  timing TEXT NOT NULL,
  duration TEXT,
  description TEXT,
  programmer TEXT,
  status TEXT NOT NULL DEFAULT 'programmed' CHECK (status IN ('programmed', 'tested', 'approved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Train emergency procedures evacuation table
CREATE TABLE train_emergency_procedures_evacuation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  route TEXT NOT NULL,
  primary_route BOOLEAN NOT NULL DEFAULT false,
  capacity INTEGER,
  landmarks TEXT[],
  time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Train communication testing systems table
CREATE TABLE train_communication_testing_systems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  system TEXT NOT NULL,
  type TEXT NOT NULL,
  test TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('passed', 'failed', 'issues')),
  technician TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_train_briefings_all_hands_event_id ON train_briefings_all_hands(event_id);
CREATE INDEX idx_train_briefings_department_event_id ON train_briefings_department(event_id);
CREATE INDEX idx_train_safety_training_sessions_event_id ON train_safety_training_sessions(event_id);
CREATE INDEX idx_train_safety_training_certifications_event_id ON train_safety_training_certifications(event_id);
CREATE INDEX idx_train_technical_rehearsals_schedule_event_id ON train_technical_rehearsals_schedule(event_id);
CREATE INDEX idx_train_sound_checks_sessions_event_id ON train_sound_checks_sessions(event_id);
CREATE INDEX idx_train_lighting_cues_event_id ON train_lighting_cues(event_id);
CREATE INDEX idx_train_emergency_procedures_evacuation_event_id ON train_emergency_procedures_evacuation(event_id);
CREATE INDEX idx_train_communication_testing_systems_event_id ON train_communication_testing_systems(event_id);

-- Row Level Security
ALTER TABLE train_briefings_all_hands ENABLE ROW LEVEL SECURITY;
ALTER TABLE train_briefings_department ENABLE ROW LEVEL SECURITY;
ALTER TABLE train_safety_training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE train_safety_training_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE train_technical_rehearsals_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE train_sound_checks_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE train_lighting_cues ENABLE ROW LEVEL SECURITY;
ALTER TABLE train_emergency_procedures_evacuation ENABLE ROW LEVEL SECURITY;
ALTER TABLE train_communication_testing_systems ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view train data for their events" ON train_briefings_all_hands
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = train_briefings_all_hands.event_id
      AND (events.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM event_participants
        WHERE event_participants.event_id = events.id
        AND event_participants.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can manage train data for their events" ON train_briefings_all_hands
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = train_briefings_all_hands.event_id
      AND (events.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM event_participants
        WHERE event_participants.event_id = events.id
        AND event_participants.user_id = auth.uid()
      ))
    )
  );

-- Similar policies for all other tables (simplified for brevity)

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_train_briefings_all_hands_updated_at BEFORE UPDATE ON train_briefings_all_hands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_train_briefings_department_updated_at BEFORE UPDATE ON train_briefings_department
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_train_safety_training_sessions_updated_at BEFORE UPDATE ON train_safety_training_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_train_safety_training_certifications_updated_at BEFORE UPDATE ON train_safety_training_certifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_train_technical_rehearsals_schedule_updated_at BEFORE UPDATE ON train_technical_rehearsals_schedule
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_train_sound_checks_sessions_updated_at BEFORE UPDATE ON train_sound_checks_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_train_lighting_cues_updated_at BEFORE UPDATE ON train_lighting_cues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_train_communication_testing_systems_updated_at BEFORE UPDATE ON train_communication_testing_systems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
