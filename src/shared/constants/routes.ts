export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  TEST: '/test',
  TEST_RESULT: '/test/result',
  CAREERS: '/careers',
  CAREER_DETAIL: (id: string) => `/careers/${id}`,
  PERSONALITY_TYPES: '/personality-types',
  PERSONALITY_TYPE_DETAIL: (type: string) => `/personality-types/${type}`,
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  CHANGE_PASSWORD: '/change-password',
  
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    USER_DETAIL: (id: string) => `/admin/users/${id}`,
    QUESTIONS: '/admin/questions',
    CAREERS: '/admin/careers',
    PERSONALITY_TYPES: '/admin/personality-types',
    STATS: '/admin/stats',
  }
} as const; 
