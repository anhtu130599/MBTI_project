# MBTI Career Test

A comprehensive MBTI personality test and career guidance platform built with Next.js, TypeScript, and Material-UI.

## Features

- 🧠 **MBTI Personality Test** - Complete 16-personality assessment
- 💼 **Career Guidance** - Personalized career recommendations based on MBTI type
- 👤 **User Profiles** - Personal test history and results
- 🔐 **Authentication** - Secure user registration and login
- 📊 **Admin Dashboard** - Comprehensive management interface
- 🎨 **Modern UI** - Beautiful Material-UI components

## Architecture

This project follows Clean Architecture principles with feature-based organization:

```
src/
├── app/           # Next.js App Router
├── core/          # Clean Architecture core
│   ├── domain/    # Entities and business logic
│   ├── application/ # Use cases and repositories
│   └── infrastructure/ # External services
├── features/      # Feature-based modules
│   ├── auth/      # Authentication
│   ├── test/      # MBTI testing
│   ├── user/      # User management
│   ├── admin/     # Admin functionality
│   ├── career/    # Career guidance
│   └── personality/ # Personality types
└── shared/        # Shared utilities and components
```

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Material-UI (MUI)
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Authentication**: JWT with cookies
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB
- Redis (optional, for caching)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd MBTI_project
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/mbti_db
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 