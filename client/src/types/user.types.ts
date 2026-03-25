export interface User {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfile extends User {
    bio?: string;
    phone?: string;
    location?: string;
    website?: string;
}

export interface UserCredentials {
    email: string;
    password: string;
}

export interface UserRegister extends UserCredentials {
    username: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}

export type UserRole = 'admin' | 'user' | 'moderator';

export interface UserWithRole extends User {
    role: UserRole;
}