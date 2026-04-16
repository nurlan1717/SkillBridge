export type UUID = string;

export type UserRole = "USER" | "STUDENT" | "MENTOR" | "EMPLOYER" | "ADMIN";
export type RegisterRole = "MENTOR" | "EMPLOYER" | "USER" | "STUDENT";
export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type SubmissionStatus =
  | "PENDING"
  | "AI_REVIEWED"
  | "MENTOR_REVIEWED"
  | "APPROVED"
  | "REJECTED";
export type JobType = "INTERNSHIP" | "JUNIOR" | "MID" | "SENIOR";
export type LocationType = "REMOTE" | "ONSITE" | "HYBRID";

export interface User {
  id: UUID;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string | null;
  bio?: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: UUID;
  title: string;
  category: "FRONTEND" | "BACKEND" | "DATA" | "SECURITY" | "DEVOPS" | "DESIGN" | "PM";
  description?: string | null;
  difficulty: Level;
  iconUrl?: string | null;
  isActive: boolean;
}

export interface UserSkill {
  id: UUID;
  userId: UUID;
  skillId: UUID;
  currentLevel: Level;
  aiScore?: number | null;
  aiAnalysis?: string | null;
  roadmapJson?: string | null;
  assessedAt?: string | null;
}

export interface Task {
  id: UUID;
  skillId: UUID;
  title: string;
  description: string;
  expectedOutput: string;
  difficulty: Level;
  durationMinutes?: number | null;
  isAiGenerated: boolean;
}

export interface Submission {
  id: UUID;
  userId: UUID;
  taskId: UUID;
  solutionText: string;
  solutionFileUrl?: string | null;
  status: SubmissionStatus;
  aiScore?: number | null;
  aiFeedback?: string | null;
  mentorId?: UUID | null;
  mentorFeedback?: string | null;
  finalScore?: number | null;
  submittedAt: string;
  reviewedAt?: string | null;
}

export interface Certificate {
  id: UUID;
  userId: UUID;
  skillId: UUID;
  submissionId: UUID;
  level: Level;
  verificationCode: string;
  verifiedBy?: UUID | null;
  issuedAt: string;
}

export interface Job {
  id: UUID;
  employerId: UUID;
  title: string;
  company: string;
  description: string;
  requiredSkillsJson: string;
  minLevel: Level;
  jobType: JobType;
  locationType: LocationType;
  location?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface JobMatch {
  id: UUID;
  userId: UUID;
  jobId: UUID;
  matchScore: number;
  matchReason?: string | null;
  calculatedAt: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: RegisterRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  user?: User;
  data?: {
    token?: string;
    accessToken?: string;
    user?: User;
  };
}

export interface AnalyzeRequest {
  skillId: UUID;
  selfRating: number;
  answers: string[];
}

export interface AnalyzeResponse {
  level: Level;
  score: number;
  strengths: string[];
  gaps: string[];
  nextSteps: string;
  roadmap: { weeks: Array<{ week: number; focus: string; tasks: string[] }> };
}

export interface SubmissionCreateRequest {
  taskId: UUID;
  solutionText: string;
  solutionFileUrl?: string;
}

export interface MentorReviewRequest {
  mentorFeedback: string;
  finalScore: number;
}

export interface JobCreateRequest {
  title: string;
  company: string;
  description: string;
  requiredSkillsJson: string;
  minLevel: Level;
  jobType: JobType;
  locationType: LocationType;
  location?: string;
}
