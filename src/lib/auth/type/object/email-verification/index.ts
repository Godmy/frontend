import type { IEmailVerification } from '$module/auth';

export type EmailVerification = Parameters<IEmailVerification['verifyEmail']>[0];
