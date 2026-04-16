import { endpoints } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/http";
import type { Certificate } from "@/lib/api/types";

export const certificatesService = {
  mine: (token: string) => apiRequest<Certificate[]>(endpoints.certificates.mine, { token }),

  byUser: (token: string, userId: string) =>
    apiRequest<Certificate[]>(endpoints.certificates.byUser(userId), { token }),

  verify: (code: string) =>
    apiRequest<{ valid: boolean; certificate: Certificate | null }>(
      endpoints.certificates.verify(code)
    ),

  byId: (token: string, id: string) =>
    apiRequest<Certificate>(endpoints.certificates.byId(id), { token }),
};
