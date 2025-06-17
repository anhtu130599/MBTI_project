export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    VERIFY: '/api/auth/verify',
    RESET_PASSWORD: '/api/auth/reset-password',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },
  USERS: {
    BASE: '/api/users',
    BY_ID: (id: string) => `/api/users/${id}`,
    PROFILE: '/api/users/profile',
  },
  TEST: {
    QUESTIONS: '/api/test/questions',
    SUBMIT: '/api/test/submit',
    RESULTS: '/api/test/results',
    HISTORY: '/api/test/history',
  },
  CAREERS: {
    BASE: '/api/careers',
    BY_ID: (id: string) => `/api/careers/${id}`,
    SEARCH: '/api/careers/search',
    BY_PERSONALITY: (type: string) => `/api/careers/personality/${type}`,
  },
  PERSONALITY_TYPES: {
    BASE: '/api/personality-types',
    BY_CODE: (code: string) => `/api/personality-types/${code}`,
  },
  ADMIN: {
    STATS: '/api/admin/stats',
    USERS: '/api/admin/users',
    QUESTIONS: '/api/admin/questions',
    CAREERS: '/api/admin/careers',
  }
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const; 
