import type { IAuthProvider } from '$module/auth';

export type TelegramAuthData = Parameters<IAuthProvider['loginWithTelegram']>[0];
