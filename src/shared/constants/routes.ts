export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  TEST: '/test',
  TEST_QUESTIONS: '/test/questions',
  TEST_RESULT: '/test/result',
  CAREERS: '/careers',
  CAREER_DETAIL: (id: string) => `/careers/${id}`,
  PERSONALITY_TYPES: '/personality-types',
  PERSONALITY_TYPE_DETAIL: (type: string) => `/personality-types/${type}`,
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  // Authenticated user routes
  PROFILE: '/profile',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_CHANGE_PASSWORD: '/settings/change-password',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAIL: (id: string) => `/admin/users/${id}`,
  ADMIN_QUESTIONS: '/admin/questions',
  ADMIN_CAREERS: '/admin/careers',
  ADMIN_PERSONALITY_TYPES: '/admin/personality-types',
  ADMIN_STATS: '/admin/stats',
} as const; 
