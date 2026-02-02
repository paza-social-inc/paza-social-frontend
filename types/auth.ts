// Authentication request and response types

import { AuthResponse } from "./common";

// Login types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends AuthResponse {}

// Signup types
export interface SignupRequest {
  firstname: string;
  lastname: string;
  email: string;
  birthday: string;
  gender: "Male" | "Female" | "Other";
  phone: string;
  city: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  success: boolean;
}

// Forgot Password types
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

// Reset Password types
export interface ResetPasswordRequest {
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Account Type Selection
export interface AccountTypeSelection {
  accountType: "Brand" | "Creator";
}

// OAuth types
export interface OAuthInitiateRequest {
  provider: "google" | "linkedin" | "youtube";
}

export interface OAuthCallbackResponse extends AuthResponse {}

// Email verification
export interface EmailVerificationRequest {
  token: string;
}

export interface EmailVerificationResponse {
  message: string;
  verified: boolean;
}
