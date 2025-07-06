// Re-export from core domain entities
export { default as User } from '@/core/infrastructure/database/models/User';
export { default as Question } from '@/core/infrastructure/database/models/Question';
export { default as Career } from '@/core/infrastructure/database/models/Career';
export { default as MBTIDimensionInfo } from '@/core/infrastructure/database/models/MBTIDimensionInfo';
export { default as PersonalityDetailInfo } from '@/core/infrastructure/database/models/PersonalityDetailInfo';

// TestResult sử dụng model riêng cho user test history
export { default as TestResult } from './TestResult';
export type { UserTestResult } from './TestResult'; 
