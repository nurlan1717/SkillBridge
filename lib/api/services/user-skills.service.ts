import { endpoints } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/http";

export async function addSkillToUser(userId: string, skillId: string, token: string) {
  await apiRequest<unknown>(endpoints.users.addSkill(userId, skillId), {
    method: "POST",
    token,
  });
}
