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
