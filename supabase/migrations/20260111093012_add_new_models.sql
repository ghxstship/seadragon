-- Add new models for tasks, actions, fitness, and AI chat
-- Generated from Prisma schema for ATLVS + GVTEWAY super app

-- Task management
CREATE TABLE tasks (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to TEXT,
  created_by TEXT NOT NULL,
  project_id TEXT,
  workspace_id TEXT,
  organization_id TEXT NOT NULL,
  parent_id TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_task_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id),
  CONSTRAINT fk_task_created_by FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT fk_task_project FOREIGN KEY (project_id) REFERENCES projects(id),
  CONSTRAINT fk_task_workspace FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
  CONSTRAINT fk_task_organization FOREIGN KEY (organization_id) REFERENCES organizations(id),
  CONSTRAINT fk_task_parent FOREIGN KEY (parent_id) REFERENCES tasks(id)
);

-- Action items
CREATE TABLE actions (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'approval',
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to TEXT,
  created_by TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_action_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id),
  CONSTRAINT fk_action_created_by FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT fk_action_organization FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Fitness tracking (FAT Club)
CREATE TABLE fitness_programs (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  difficulty TEXT DEFAULT 'beginner',
  user_id TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_fitness_program_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE workouts (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  program_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  calories INTEGER,
  user_id TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_workout_program FOREIGN KEY (program_id) REFERENCES fitness_programs(id),
  CONSTRAINT fk_workout_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE workout_exercises (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  workout_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER,
  weight DECIMAL(10,2),
  duration INTEGER,
  CONSTRAINT fk_workout_exercise_workout FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
  CONSTRAINT fk_workout_exercise_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE TABLE exercises (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  muscle_groups JSONB NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE fitness_challenges (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  goal TEXT NOT NULL,
  user_id TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_fitness_challenge_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- AI Chat and Agent System
CREATE TABLE ai_conversations (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT NOT NULL,
  title TEXT,
  status TEXT DEFAULT 'active',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_ai_conversation_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE ai_messages (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_ai_message_conversation FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE
);

CREATE TABLE ai_knowledge_base (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]',
  organization_id TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_ai_knowledge_organization FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_workspace_id ON tasks(workspace_id);
CREATE INDEX idx_tasks_organization_id ON tasks(organization_id);
CREATE INDEX idx_tasks_parent_id ON tasks(parent_id);

CREATE INDEX idx_actions_assigned_to ON actions(assigned_to);
CREATE INDEX idx_actions_created_by ON actions(created_by);
CREATE INDEX idx_actions_organization_id ON actions(organization_id);

CREATE INDEX idx_fitness_programs_user_id ON fitness_programs(user_id);
CREATE INDEX idx_workouts_program_id ON workouts(program_id);
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise_id ON workout_exercises(exercise_id);
CREATE INDEX idx_fitness_challenges_user_id ON fitness_challenges(user_id);

CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX idx_ai_knowledge_base_organization_id ON ai_knowledge_base(organization_id);

-- Enable Row Level Security for multi-tenant isolation
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (users can access data from their organizations)
-- Tasks: Users can access tasks in their organizations or assigned to them
CREATE POLICY "Users can view tasks in their orgs or assigned" ON tasks
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    ) OR assigned_to = auth.uid() OR created_by = auth.uid()
  );

CREATE POLICY "Users can create tasks in their orgs" ON tasks
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks they created or are assigned" ON tasks
  FOR UPDATE USING (
    created_by = auth.uid() OR assigned_to = auth.uid()
  );

-- Actions: Similar to tasks
CREATE POLICY "Users can view actions in their orgs or assigned" ON actions
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    ) OR assigned_to = auth.uid() OR created_by = auth.uid()
  );

CREATE POLICY "Users can create actions in their orgs" ON actions
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update actions they created or are assigned" ON actions
  FOR UPDATE USING (
    created_by = auth.uid() OR assigned_to = auth.uid()
  );

-- Personal data policies
CREATE POLICY "Users can view own fitness programs" ON fitness_programs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own fitness programs" ON fitness_programs
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view own workouts" ON workouts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own workouts" ON workouts
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view own fitness challenges" ON fitness_challenges
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own fitness challenges" ON fitness_challenges
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view own AI conversations" ON ai_conversations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage own AI conversations" ON ai_conversations
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view AI knowledge in their orgs" ON ai_knowledge_base
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM user_organizations
      WHERE user_id = auth.uid()
    ) OR organization_id IS NULL
  );

-- Public exercises (no organization restriction)
CREATE POLICY "Public access to exercises" ON exercises
  FOR SELECT USING (true);
