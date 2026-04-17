import { endpoints } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/http";
import type {
  MentorReviewRequest,
  Submission,
  SubmissionCreateRequest,
} from "@/lib/api/types";

export const submissionsService = {
  create: (token: string, payload: SubmissionCreateRequest) =>
    apiRequest<Submission>(endpoints.submissions.create, {
      method: "POST",
      token,
      body: payload,
    }),

  aiReview: (token: string, userId: string) =>
    apiRequest<Submission>(endpoints.submissions.aiReview(userId), { method: "POST", token }),

  mentorReview: (token: string, id: string, payload: MentorReviewRequest) => {
    const params = new URLSearchParams({
      id: String(payload.id),
      feedback: payload.feedback,
      score: String(payload.score),
    });
    return apiRequest<Submission>(`${endpoints.submissions.mentorReview(id)}?${params.toString()}`, {
      method: "POST",
      token,
    });
  },

  byUser: (token: string, userId: string) =>
    apiRequest<Submission[]>(endpoints.submissions.byUser(userId), { token }),

  activateSkills: (token: string, userId: string) =>
    apiRequest<void>(endpoints.submissions.activateSkills(userId), {
      method: "POST",
      token,
    }),

  mine: (token: string) => apiRequest<Submission[]>(endpoints.submissions.mine, { token }),

  pending: (token: string) =>
    apiRequest<Submission[]>(endpoints.submissions.pending, { token }),

  byId: (token: string, id: string) =>
    apiRequest<Submission>(endpoints.submissions.byId(id), { token }),
};
