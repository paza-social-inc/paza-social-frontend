// Common types used across authentication flows
import { BrandAccount, CreatorAccount } from "./user";

export interface BaseUser {
  id?: string;
  email: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  preview?: string;
}

export interface AuthResponse {
  token: string;
  user: BaseUser & {
    account?: BrandAccount | CreatorAccount;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface SocialAuthProvider {
  provider: "google" | "linkedin" | "youtube";
  loading: boolean;
}

export type AccountType = "Brand" | "Creator";

export interface LocationData {
  city: string;
  latitude?: number;
  longitude?: number;
}

export interface SocialMediaLinks {
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  facebook?: string;
}
