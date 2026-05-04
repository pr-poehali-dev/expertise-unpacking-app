const BASE_URL = "https://functions.poehali.dev/90ae07d6-379d-4931-aa79-8af13ca29c75";

async function post<T>(action: string, body: object): Promise<T> {
  const res = await fetch(`${BASE_URL}/?action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Ошибка сервера");
  return data;
}

export async function createSession(goal: string, userRole = "expert"): Promise<{ session_id: string }> {
  return post("create_session", { goal, user_role: userRole });
}

export async function saveStep(sessionId: string, stepId: number, answers: Answer[]): Promise<{ saved: boolean; next_step: number }> {
  return post("save_step", { session_id: sessionId, step_id: stepId, answers });
}

export async function generateFollowup(sessionId: string, stepId: number, questionText: string, answerText: string): Promise<{ followup: string | null }> {
  return post("generate_followup", { session_id: sessionId, step_id: stepId, question_text: questionText, answer_text: answerText });
}

export async function generateSummary(sessionId: string, stepId: number): Promise<{ summary: string }> {
  return post("generate_summary", { session_id: sessionId, step_id: stepId });
}

export async function generateFinal(sessionId: string): Promise<{ profile: FinalProfile }> {
  return post("generate_final", { session_id: sessionId });
}

export async function generateInsights(sessionId: string): Promise<{ insights: BlindInsights; strategy: MarketingStrategy }> {
  return post("generate_insights", { session_id: sessionId });
}

export interface Answer {
  question_id: string;
  question_text: string;
  answer_text: string;
  answer_type?: string;
}

export interface SelfPresentation {
  length: string;
  text: string;
}

export interface FinalProfile {
  personal_code: string;
  expert_zone: string;
  audience_profile: string;
  positioning: string;
  tone_of_voice: string;
  content_core: string;
  rubrics: string[];
  self_presentations: SelfPresentation[];
  raw?: string;
}

export interface BlindInsights {
  hidden_strengths: { title: string; description: string }[];
  blind_spots: { title: string; description: string }[];
  patterns: string;
  underused_potential: string;
  risk_warning: string;
  raw?: string;
}

export interface MarketingChannel {
  channel: string;
  why: string;
  format: string;
}

export interface RoadmapItem {
  period: string;
  focus: string;
  goal: string;
}

export interface MarketingStrategy {
  positioning_angle: string;
  primary_channels: MarketingChannel[];
  content_strategy: {
    weekly_rhythm: string;
    hook_themes: string[];
    viral_mechanic: string;
  };
  lead_magnet: {
    idea: string;
    format: string;
    title: string;
  };
  first_product: {
    idea: string;
    format: string;
    price_range: string;
    launch_mechanic: string;
  };
  quick_wins: string[];
  growth_roadmap: RoadmapItem[];
  raw?: string;
}