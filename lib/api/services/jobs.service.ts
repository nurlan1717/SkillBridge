import { endpoints } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/http";
import type { Job, JobCreateRequest, JobMatch } from "@/lib/api/types";

export const jobsService = {
  list: () => apiRequest<Job[]>(endpoints.jobs.list),

  byId: (id: string) => apiRequest<Job>(endpoints.jobs.byId(id)),

  create: (token: string, payload: JobCreateRequest) =>
    apiRequest<Job>(endpoints.jobs.create, { method: "POST", token, body: payload }),

  update: (token: string, id: string, payload: Partial<JobCreateRequest>) =>
    apiRequest<Job>(endpoints.jobs.update(id), { method: "PUT", token, body: payload }),

  remove: (token: string, id: string) =>
    apiRequest<void>(endpoints.jobs.remove(id), { method: "DELETE", token }),

  myMatches: (token: string) => apiRequest<JobMatch[]>(endpoints.jobs.myMatches, { token }),

  calculateMatch: (token: string, jobId: string) =>
    apiRequest<JobMatch>(endpoints.jobs.calculateMatch(jobId), { method: "POST", token }),

  employerCandidates: (token: string) =>
    apiRequest<Array<{ userId: string; fullName: string; matchScore: number }>>(
      endpoints.jobs.employerCandidates,
      { token }
    ),
};
