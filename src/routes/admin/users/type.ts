export enum UserRole {
	USER = 'USER',
	ADMIN = 'ADMIN'
}

export interface User {
	id: string;
	email: string;
	username: string | null;
	firstName: string | null;
	lastName: string | null;
	role: UserRole;
	department: string;
	currentPosition: string | null;
	isActive: boolean;
	isEmailVerified: boolean;
	createdAt: string;
	updatedAt: string;
	lastLoggedIn: string | null;
}
