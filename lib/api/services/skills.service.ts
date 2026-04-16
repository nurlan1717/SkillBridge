import { endpoints } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/http";
import type { Skill } from "@/lib/api/types";

type SkillApiModel = {
  id: string;
  title: string;
  category: Skill["category"];
  description?: string | null;
  difficulty: Skill["difficulty"];
  iconUrl?: string | null;
  isActive?: boolean;
  active?: boolean;
};

export type SkillWritePayload = {
  title: string;
  category: Skill["category"];
  description?: string | null;
  difficulty: Skill["difficulty"];
  iconUrl?: string | null;
  active: boolean;
};

function normalizeSkill(skill: SkillApiModel): Skill {
  return {
    id: skill.id,
    title: skill.title,
    category: skill.category,
    description: skill.description ?? null,
    difficulty: skill.difficulty,
    iconUrl: skill.iconUrl ?? null,
    isActive: skill.isActive ?? skill.active ?? false,
  };
}

export const skillsService = {
  list: async (token?: string) => {
    const response = await apiRequest<SkillApiModel[]>(endpoints.skills.list, { token });
    return response.map(normalizeSkill);
  },

  byId: async (id: string, token?: string) => {
    const response = await apiRequest<SkillApiModel>(endpoints.skills.byId(id), { token });
    return normalizeSkill(response);
  },

  create: async (token: string, payload: SkillWritePayload) => {
    const response = await apiRequest<SkillApiModel>(endpoints.skills.list, {
      method: "POST",
      token,
      body: payload,
    });
    return normalizeSkill(response);
  },

  update: async (token: string, id: string, payload: Partial<SkillWritePayload>) => {
    const response = await apiRequest<SkillApiModel>(endpoints.skills.byId(id), {
      method: "PUT",
      token,
      body: payload,
    });
    return normalizeSkill(response);
  },

  remove: async (token: string, id: string) => {
    await apiRequest<unknown>(endpoints.skills.byId(id), {
      method: "DELETE",
      token,
    });
  },
};
