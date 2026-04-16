import { endpoints } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/http";
import type { Level, Task } from "@/lib/api/types";

export const tasksService = {
  bySkill: (token: string, skillId: string) =>
    apiRequest<Task[]>(endpoints.tasks.bySkill(skillId), { token }),

  byId: (token: string, id: string) => apiRequest<Task>(endpoints.tasks.byId(id), { token }),

  generate: (token: string, skillId: string, level: Level) =>
    apiRequest<Task>(endpoints.tasks.generate(skillId), {
      method: "POST",
      token,
      body: { level },
    }),

  create: (token: string, payload: Omit<Task, "id">) =>
    apiRequest<Task>(endpoints.tasks.create, { method: "POST", token, body: payload }),

  update: (token: string, id: string, payload: Partial<Task>) =>
    apiRequest<Task>(endpoints.tasks.update(id), { method: "PUT", token, body: payload }),
};
