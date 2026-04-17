export const API_PREFIX = "/api/v1";

export const endpoints = {
  auth: {
    register: `${API_PREFIX}/auth/register`,
    login: `${API_PREFIX}/auth/login`,
    logout: `${API_PREFIX}/auth/logout`,
    verifyEmail: `${API_PREFIX}/auth/verify-email`,
    forgotPassword: `${API_PREFIX}/auth/forgot-password`,
  },
  users: {
    me: `${API_PREFIX}/users/me`,
    byId: (id: string) => `${API_PREFIX}/users/${id}`,
    list: `${API_PREFIX}/users`,
    addSkill: (userId: string, skillId: string) => `${API_PREFIX}/users/${userId}/skills/${skillId}`,
  },
  skills: {
    list: `${API_PREFIX}/skills`,
    byId: (id: string) => `${API_PREFIX}/skills/${id}`,
  },
  assessments: {
    analyze: `${API_PREFIX}/assessments/analyze`,
    roadmap: (skillId: string) => `${API_PREFIX}/assessments/roadmap/${skillId}`,
    testsBySkill: (skillId: string) => `${API_PREFIX}/skills/${skillId}/tests`,
    mine: `${API_PREFIX}/assessments/me`,
    skillWallet: `${API_PREFIX}/assessments/me/skill-wallet`,
  },
  roadmap: {
    generate: `${API_PREFIX}/roadmap`,
  },
  tasks: {
    bySkill: (skillId: string) => `${API_PREFIX}/tasks/skill/${skillId}`,
    byId: (id: string) => `${API_PREFIX}/tasks/${id}`,
    generate: (skillId: string) => `${API_PREFIX}/tasks/generate/${skillId}`,
    create: `${API_PREFIX}/tasks`,
    update: (id: string) => `${API_PREFIX}/tasks/${id}`,
  },
  submissions: {
    create: `${API_PREFIX}/submissions`,
    aiReview: (userId: string) => `${API_PREFIX}/submissions/user/${userId}/ai-review`,
    mentorReview: (id: string) => `${API_PREFIX}/submissions/${id}/mentor-review`,
    mine: `${API_PREFIX}/submissions/me`,
    byUser: (userId: string) => `${API_PREFIX}/submissions/user/${userId}`,
    activateSkills: (userId: string) => `${API_PREFIX}/submissions/user/${userId}/activate-skills`,
    pending: `${API_PREFIX}/submissions/pending`,
    byId: (id: string) => `${API_PREFIX}/submissions/${id}`,
  },
  certificates: {
    mine: `${API_PREFIX}/certificates/me`,
    byUser: (userId: string) => `${API_PREFIX}/certificates/user/${userId}`,
    verify: (code: string) => `${API_PREFIX}/certificates/verify/${code}`,
    byId: (id: string) => `${API_PREFIX}/certificates/${id}`,
  },
  jobs: {
    list: `${API_PREFIX}/jobs`,
    byId: (id: string) => `${API_PREFIX}/jobs/${id}`,
    create: `${API_PREFIX}/jobs`,
    update: (id: string) => `${API_PREFIX}/jobs/${id}`,
    remove: (id: string) => `${API_PREFIX}/jobs/${id}`,
    myMatches: `${API_PREFIX}/jobs/me/matches`,
    calculateMatch: (id: string) => `${API_PREFIX}/jobs/${id}/calculate-match`,
    employerCandidates: `${API_PREFIX}/jobs/employer/candidates`,
  },
} as const;
