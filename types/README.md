# Authentication Types Documentation

This `types` folder contains TypeScript type definitions for all authentication-related data structures used in the Paza frontend application.

## File Structure

```
types/
├── index.ts          # Main exports file
├── common.ts         # Shared types and interfaces
├── auth.ts           # Authentication request/response types
└── user.ts           # User account types (Brand/Creator)
```

## Usage

Import types in your components:

```typescript
import {
  LoginRequest,
  SignupRequest,
  BrandAccount,
  CreatorAccount,
  AuthResponse
} from '../types';
```

## Type Categories

### Common Types (`common.ts`)

- **BaseUser**: Basic user information structure
- **AuthResponse**: Standard authentication response format
- **ApiError**: Error response structure
- **AccountType**: Union type for 'Brand' | 'Creator'
- **SocialMediaLinks**: Social media URL structure
- **LocationData**: Geographic location information

### Authentication Types (`auth.ts`)

- **LoginRequest**: Email/password login data
- **SignupRequest**: User registration data
- **ForgotPasswordRequest**: Password reset email request
- **ResetPasswordRequest**: New password submission
- **OAuthInitiateRequest**: Social authentication initiation

### User Account Types (`user.ts`)

- **BrandAccount**: Complete brand account data structure
- **CreatorAccount**: Complete creator account data structure
- **UserAccount**: Union type for all account types
- **BrandAccountRequest**: Brand account creation/update data
- **CreatorAccountRequest**: Creator account creation/update data

## Example Usage

```typescript
// Login request
const loginData: LoginRequest = {
  email: 'user@example.com',
  password: 'password123'
};

// Brand account creation
const brandData: BrandAccountRequest = {
  company: 'Acme Corp',
  email: 'contact@acme.com',
  website: 'https://acme.com',
  type: 'Brand',
  // ... other fields
};

// API response handling
const handleLoginResponse = (response: AuthResponse) => {
  localStorage.setItem('token', response.token);
  // response.user.account will be BrandAccount | CreatorAccount | undefined
};
```

## Backend Integration

These types correspond to the following API endpoints:

- `POST /auth/login` - LoginRequest → AuthResponse
- `POST /auth/signup` - SignupRequest → SignupResponse
- `POST /auth/forgot-password` - ForgotPasswordRequest → ForgotPasswordResponse
- `POST /auth/reset-password` - ResetPasswordRequest → ResetPasswordResponse
- `POST /auth/account/brand` - BrandAccountRequest → AccountCreationResponse
- `POST /auth/account/creator` - CreatorAccountRequest → AccountCreationResponse
