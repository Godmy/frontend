/**
 * Auth Store (Writable Store - для совместимости)
 * SRP: Управляет состоянием авторизации
 */

import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { AuthState, User, AuthTokens, Role } from '../types';

function createAuthStore() {
	const initialState: AuthState = {
		user: null,
		tokens: null,
		isAuthenticated: false,
		isLoading: false,
		error: null,
		roles: []
	};

	const { subscribe, set, update }: Writable<AuthState> = writable(initialState);

	return {
		subscribe,

		setAuthenticated: (user: User, tokens: AuthTokens, roles: Role[] = []) => {
			update(state => ({
				...state,
				user,
				tokens,
				isAuthenticated: true,
				roles,
				error: null
			}));
		},

		setUnauthenticated: () => {
			update(state => ({
				...state,
				user: null,
				tokens: null,
				isAuthenticated: false,
				roles: [],
				error: null
			}));
		},

		setLoading: (isLoading: boolean) => {
			update(state => ({ ...state, isLoading }));
		},

		setError: (error: string | null) => {
			update(state => ({ ...state, error }));
		},

		setRoles: (roles: Role[]) => {
			update(state => ({ ...state, roles }));
		},

		updateUser: (userData: Partial<User>) => {
			update(state => ({
				...state,
				user: state.user ? { ...state.user, ...userData } : null
			}));
		},

		reset: () => {
			set(initialState);
		}
	};
}

export const authStoreWritable = createAuthStore();

// Derived stores для удобного доступа
export const user: Readable<User | null> = derived(authStoreWritable, $auth => $auth.user);
export const isAuthenticated: Readable<boolean> = derived(authStoreWritable, $auth => $auth.isAuthenticated);
export const isLoading: Readable<boolean> = derived(authStoreWritable, $auth => $auth.isLoading);
export const error: Readable<string | null> = derived(authStoreWritable, $auth => $auth.error);
export const roles: Readable<Role[]> = derived(authStoreWritable, $auth => $auth.roles);
