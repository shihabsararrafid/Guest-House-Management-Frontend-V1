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
export interface UserExtended {
	id: string;
	email: string;
	username: string | null;
	firstName: string | null;
	lastName: string | null;
	role: UserRole;
	department: string | null;
	roll: string | null;
	phone: string | null;
	currentPosition: string | null;
	currentRole: string | null;
	address: string | null;
	thana: string | null;
	district: string | null;
	isActive: boolean;
	isEmailVerified: boolean;
	createdAt: string;
	updatedAt: string;
	lastLoggedIn: string | null;
}
