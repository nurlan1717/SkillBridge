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

  aiReview: (token: string, id: string) =>
    apiRequest<Submission>(endpoints.submissions.aiReview(id), { method: "POST", token }),

  mentorReview: (token: string, id: string, payload: MentorReviewRequest) =>
    apiRequest<Submission>(endpoints.submissions.mentorReview(id), {
      method: "POST",
      token,
      body: payload,
    }),

  mine: (token: string) => apiRequest<Submission[]>(endpoints.submissions.mine, { token }),

  pending: (token: string) =>
    apiRequest<Submission[]>(endpoints.submissions.pending, { token }),

  byId: (token: string, id: string) =>
    apiRequest<Submission>(endpoints.submissions.byId(id), { token }),
};
