import { endpoints } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/http";

export type SkillTestsResponse = unknown;

export async function fetchSkillTestsBySkillId(token: string, skillId: string) {
  return apiRequest<SkillTestsResponse>(endpoints.assessments.testsBySkill(skillId), {
    token,
  });
}

export async function generateRoadmapForSkill(token: string, skillTitle: string) {
  return apiRequest<string>(endpoints.roadmap.generate, {
    method: "POST",
    token,
    body: {
      skill: skillTitle,
    },
  });
}
