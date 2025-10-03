import fetchService from './fetchService';
import { LoginCredentials, LoginResponse, AuthUser, AuthError } from '@/types/auth';

class AuthService {
    private endpoint = "/auth";
    private tokenKey = 'auth_token';
    private userKey = 'auth_user';

    // Login user with username and password
    async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: AuthUser; error?: AuthError }> {
        try {
            const response = await fetchService.post<LoginResponse>(`${this.endpoint}/login`, credentials);
            
            // Create user object from response
            const user: AuthUser = {
                id: response.id,
                username: response.username,
                email: response.email,
                firstName: response.firstName,
                lastName: response.lastName,
                gender: response.gender,
                image: response.image,
                isAuthenticated: true
            };

            // Store token and user data
            this.setToken(response.token);
            this.setUser(user);

            return { success: true, user };
        } catch (error: unknown) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: { 
                    message: error instanceof Error ? error.message : 'Login failed', 
                    status: (error as { status?: number })?.status 
                } 
            };
        }
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        const token = this.getToken();
        const user = this.getUser();
        return !!(token && user && user.isAuthenticated);
    }

    // Get current user from localStorage
    getCurrentUser(): AuthUser | null {
        return this.getUser();
    }

    // Get stored token
    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(this.tokenKey);
        }
        return null;
    }

    // Set token in localStorage
    private setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.tokenKey, token);
        }
    }

    // Get user from localStorage
    private getUser(): AuthUser | null {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem(this.userKey);
            if (userStr) {
                try {
                    return JSON.parse(userStr);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    return null;
                }
            }
        }
        return null;
    }

    // Set user in localStorage
    private setUser(user: AuthUser): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.userKey, JSON.stringify(user));
        }
    }

    // Logout user
    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(this.tokenKey);
            localStorage.removeItem(this.userKey);
        }
    }

    // Refresh token (if your API supports it)
    async refreshToken(): Promise<{ success: boolean; token?: string; error?: AuthError }> {
        try {
            const currentToken = this.getToken();
            if (!currentToken) {
                return { success: false, error: { message: 'No token to refresh' } };
            }

            const response = await fetchService.post<{ token: string }>(`${this.endpoint}/refresh`, {
                token: currentToken
            });

            this.setToken(response.token);
            return { success: true, token: response.token };
        } catch (error: unknown) {
            console.error('Token refresh error:', error);
            return { 
                success: false, 
                error: { 
                    message: error instanceof Error ? error.message : 'Token refresh failed', 
                    status: (error as { status?: number })?.status 
                } 
            };
        }
    }

    // Validate current token
    async validateToken(): Promise<boolean> {
        try {
            const token = this.getToken();
            if (!token) return false;

            await fetchService.get(`${this.endpoint}/validate`);
            return true;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }
}

const authService = new AuthService();
export default authService;