import type { IAuthProvider } from '$module/auth';

export type GoogleAuthData = Parameters<IAuthProvider['loginWithGoogle']>[0];
