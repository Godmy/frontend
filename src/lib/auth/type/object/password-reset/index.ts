import type { IPasswordManager } from '$module/auth';

export type PasswordReset = Parameters<IPasswordManager['resetPassword']>[0];
