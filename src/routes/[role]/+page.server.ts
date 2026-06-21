import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { role } = params;
	
	// Валидация роли
	const validRoles = ['user', 'admin'];
	if (!validRoles.includes(role)) {
		throw new Error('Invalid role');
	}
	
	return {
		role
	};
};