// User account types for Brand and Creator accounts

import { AccountType } from "./common";

export interface BaseAccount {
  id?: string;
  code?: string;
  avatar?: string;
  preview?: string;
  about?: string;
  milestones?: string;
  topics?: string[];
  collabs?: string[];
  corevalue?: string;
  coreValues?: string[];
  subCoreValues?: string[];
  type: AccountType;
}

export interface BrandAccount extends BaseAccount {
  type: "Brand";
  company: string;
  email: string;
  website?: string;
  phone?: string;
  location?: string;
  role?: string;
  vision?: string;
  mission?: string;
}

export interface CreatorAccount extends BaseAccount {
  type: "Creator";
  creatorname: string;
  experience?: string;
  main?: string;
  followers?: string;
  social?: string;
  category?: string;
  subCategory?: string[];
}

export type UserAccount = BrandAccount | CreatorAccount;

export interface BrandAccountRequest {
  company: string;
  email: string;
  website?: string;
  phone?: string;
  location?: string;
  role?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  facebook?: string;
  about?: string;
  milestones?: string;
  topics?: string[];
  collabs?: string[];
  vision?: string;
  mission?: string;
  corevalue?: string;
  coreValues?: string[];
  subCoreValues?: string[];
  code?: string;
  preview?: string;
  avatar?: string;
  type: "Brand";
}

export interface CreatorAccountRequest {
  creatorname: string;
  about?: string;
  experience?: string;
  main?: string;
  followers?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  facebook?: string;
  milestones?: string;
  social?: string;
  category?: string;
  subCategory?: string[];
  corevalue?: string;
  coreValues?: string[];
  subCoreValues?: string[];
  topics?: string[];
  collabs?: string[];
  preview?: string;
  avatar?: string;
  type: "Creator";
}

export interface AccountUpdateResponse {
  success: boolean;
  message: string;
  account?: UserAccount;
}

export interface AccountCreationResponse {
  success: boolean;
  message: string;
  account?: UserAccount;
}
