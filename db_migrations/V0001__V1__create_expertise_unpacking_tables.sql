
CREATE TABLE IF NOT EXISTS sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_role VARCHAR(50) DEFAULT 'expert',
    goal TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed')),
    current_step INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS answers (
    answer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(session_id),
    step_id INTEGER NOT NULL,
    question_id VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    answer_text TEXT,
    answer_type VARCHAR(30) DEFAULT 'text',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS summaries (
    summary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(session_id),
    step_id INTEGER NOT NULL,
    summary_text TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS final_profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(session_id),
    personal_code TEXT,
    expert_zone TEXT,
    audience_profile TEXT,
    positioning TEXT,
    tone_of_voice TEXT,
    content_core TEXT,
    rubrics JSONB DEFAULT '[]',
    self_presentations JSONB DEFAULT '[]',
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_answers_session ON answers(session_id);
CREATE INDEX IF NOT EXISTS idx_summaries_session ON summaries(session_id);
CREATE INDEX IF NOT EXISTS idx_profiles_session ON final_profiles(session_id);
