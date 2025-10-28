/**
 * User entity types
 * Business domain types for User entity
 */

export type User = {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserRole = 'admin' | 'moderator' | 'user' | 'guest';

export type UserInput = {
  email: string;
  username: string;
  password: string;
};

export type UserProfile = Pick<User, 'id' | 'email' | 'username' | 'role'>;
