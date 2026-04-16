import { endpoints } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/http";
import type { AnalyzeRequest, AnalyzeResponse, UserSkill } from "@/lib/api/types";

export const assessmentsService = {
  analyze: (token: string, payload: AnalyzeRequest) =>
    apiRequest<AnalyzeResponse>(endpoints.assessments.analyze, {
      method: "POST",
      token,
      body: payload,
    }),

  roadmap: (token: string, skillId: string) =>
    apiRequest<{ weeks: Array<{ week: number; focus: string; tasks: string[] }> }>(
      endpoints.assessments.roadmap(skillId),
      { method: "POST", token }
    ),

  mine: (token: string) => apiRequest<UserSkill[]>(endpoints.assessments.mine, { token }),

  skillWallet: (token: string) =>
    apiRequest<UserSkill[]>(endpoints.assessments.skillWallet, { token }),
};
