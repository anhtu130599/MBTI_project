# MBTI Project Architecture

## 🏗️ Tổng quan Kiến trúc

Dự án MBTI được tái cấu trúc theo 4 nguyên tắc kiến trúc chính:

### 1. **Features-based Architecture** 🎯
- Tổ chức code theo tính năng/domain
- Mỗi feature độc lập với nhau
- Dễ dàng mở rộng và bảo trì

### 2. **Components-based Architecture** 🧩
- UI được chia thành các component nhỏ, tái sử dụng
- Separation of concerns rõ ràng
- Shared components cho toàn bộ ứng dụng

### 3. **Clean Architecture** 🔄
- Domain-driven design
- Dependency inversion
- Use cases và repositories pattern

### 4. **Serverless Architecture** ☁️
- API Routes theo Next.js App Router
- Stateless functions
- Auto-scaling và cost-effective

## 📁 Cấu trúc Thư mục

```
src/
├── 🎯 features/           # Features-based modules
│   ├── auth/
│   │   ├── components/    # Feature-specific UI components
│   │   ├── hooks/         # Feature-specific hooks
│   │   ├── services/      # Feature business logic
│   │   ├── pages/         # Feature page components
│   │   └── index.ts       # Barrel exports
│   ├── test/
│   ├── user/
│   ├── career/
│   ├── personality/
│   └── admin/
│
├── 🔧 core/               # Clean Architecture Core
│   ├── domain/
│   │   └── entities/      # Business entities
│   ├── application/
│   │   ├── repositories/  # Repository interfaces
│   │   ├── use-cases/     # Business use cases
│   │   └── services/      # Application services
│   └── infrastructure/
│       ├── database/      # Data access implementations
│       ├── cache/         # Caching implementations
│       └── external/      # External service integrations
│
├── 🔄 shared/             # Shared resources
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Common React hooks
│   ├── utils/             # Utility functions
│   ├── constants/         # App constants
│   ├── types/             # TypeScript types
│   └── ui/                # Base UI components
│
└── 🌐 app/                # Next.js App Router
    ├── (main)/            # Main application routes
    ├── api/               # Serverless API routes
    │   └── (v1)/          # API versioning
    ├── admin/             # Admin panel routes
    └── layout.tsx         # Root layout
```

## 🎯 Features Architecture

Mỗi feature được tổ chức theo cấu trúc:

```
features/[feature-name]/
├── components/     # UI components cho feature này
├── hooks/          # React hooks cho feature này
├── services/       # Business logic và API calls
├── pages/          # Page components (nếu cần)
├── types/          # TypeScript types cho feature này
└── index.ts        # Barrel exports
```

### Ví dụ: Auth Feature
```typescript
// features/auth/index.ts
export * from './components/LoginForm';
export * from './hooks/useAuth';
export * from './services/authService';
```

## 🔧 Core Architecture (Clean Architecture)

### Domain Layer
- **Entities**: Business objects thuần túy
- **Value Objects**: Immutable objects representing concepts

### Application Layer
- **Use Cases**: Business logic operations
- **Repository Interfaces**: Data access contracts
- **Services**: Application-specific business rules

### Infrastructure Layer
- **Repository Implementations**: Concrete data access
- **External Services**: Third-party integrations
- **Caching**: Performance optimizations

```typescript
// Ví dụ: Dependency Injection
const userRepository = new UserRepository();
const loginUseCase = new LoginUseCase(userRepository, hashService, tokenService);
```

## 🔄 Shared Resources

### Components
- Reusable UI components không thuộc về feature cụ thể nào
- Design system components
- Layout components

### Hooks
- Common React hooks được sử dụng bởi nhiều features
- Utility hooks

### Constants & Types
- Application-wide constants
- Shared TypeScript interfaces
- API endpoints definitions

```typescript
// shared/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users'
  }
} as const;
```

## ☁️ Serverless API Architecture

### API Versioning
```
app/api/
└── (v1)/
    ├── auth/
    ├── users/
    ├── test/
    └── careers/
```

### API Route Pattern
```typescript
// app/api/(v1)/auth/login/route.ts
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<AuthResponse>>> {
  // Use cases và dependency injection
  const result = await loginUseCase.execute(data);
  return NextResponse.json({ success: true, data: result });
}
```

## 🧩 Component Organization

### Shared UI Components
```typescript
// shared/ui/Button/Button.tsx
export interface ButtonProps extends MuiButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // Component implementation
};
```

### Feature Components
```typescript
// features/auth/components/LoginForm.tsx
export const LoginForm: React.FC<LoginFormProps> = ({ ... }) => {
  // Feature-specific component
};
```

## 📝 Naming Conventions

### Files & Folders
- **PascalCase**: Components, entities, use cases
- **camelCase**: Functions, variables, files
- **kebab-case**: URLs, API endpoints
- **SCREAMING_SNAKE_CASE**: Constants

### TypeScript
- **Interfaces**: `IUserRepository`, `LoginDto`
- **Types**: `ApiResponse<T>`, `PaginatedResponse<T>`
- **Enums**: `UserRole`, `TestStatus`

## 🔗 Import Paths

```typescript
// TypeScript paths configuration
{
  "paths": {
    "@/*": ["./src/*"],
    "@/core/*": ["./src/core/*"],
    "@/features/*": ["./src/features/*"],
    "@/shared/*": ["./src/shared/*"],
    "@/app/*": ["./src/app/*"]
  }
}
```

### Import Examples
```typescript
// Core imports
import { User } from '@/core/domain/entities';
import { IUserRepository } from '@/core/application/repositories';

// Feature imports
import { useAuth } from '@/features/auth';
import { LoginForm } from '@/features/auth/components/LoginForm';

// Shared imports
import { Button } from '@/shared/ui';
import { ROUTES } from '@/shared/constants';
```

## 🚀 Benefits

### Maintainability
- ✅ Clear separation of concerns
- ✅ Easy to locate and modify code
- ✅ Reduced coupling between modules

### Scalability
- ✅ Easy to add new features
- ✅ Independent development of features
- ✅ Reusable components and logic

### Testability
- ✅ Isolated business logic
- ✅ Mockable dependencies
- ✅ Clear boundaries for unit testing

### Developer Experience
- ✅ Intuitive folder structure
- ✅ Auto-import with path mapping
- ✅ Type-safe development

## 🛠️ Development Guidelines

### Adding New Features
1. Create feature folder in `src/features/`
2. Follow the standard feature structure
3. Export main items in `index.ts`
4. Create corresponding API routes if needed

### Creating Components
1. Shared components → `src/shared/ui/`
2. Feature-specific → `src/features/[feature]/components/`
3. Always include TypeScript interfaces
4. Use Material-UI as base design system

### Business Logic
1. Entities → `src/core/domain/entities/`
2. Use Cases → `src/core/application/use-cases/`
3. Repository interfaces → `src/core/application/repositories/`
4. Implementations → `src/core/infrastructure/`

### API Development
1. Versioned endpoints in `app/api/(v1)/`
2. Use dependency injection pattern
3. Consistent response format
4. Proper error handling

---

*Kiến trúc này được thiết kế để hỗ trợ tối đa cho việc phát triển và bảo trì ứng dụng MBTI với quy mô lớn.* 