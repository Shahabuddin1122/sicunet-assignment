import authService from './authService';

interface FetchOptions {
    headers?: HeadersInit;
    body?: any;
    skipAuth?: boolean; // Option to skip adding auth header for specific requests
}

class FetchService {
    private readonly baseUrl: string;
    constructor() {
        // Use Next.js environment variable
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    }

    private getAuthHeaders(): HeadersInit {
        const token = authService.getToken();
        if (token) {
            return {
                'Authorization': `Bearer ${token}`
            };
        }
        return {};
    }

    private async handleResponse(response: Response) {
        if (!response.ok) {
            // Try to get error message from response
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                // If response is not JSON (like HTML error page), use status text
                errorMessage = response.statusText || errorMessage;
            }
            throw new Error(errorMessage);
        }
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            // If not JSON, return the text content
            const text = await response.text();
            throw new Error(`Expected JSON response but got: ${text.substring(0, 100)}...`);
        }
    }

    async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
        let headers: HeadersInit = {
            "Content-Type": "application/json",
            ...this.getAuthHeaders(),
            ...options.headers,
        };

        // Remove auth headers if skipAuth is true
        if (options.skipAuth && 'Authorization' in headers) {
            const { Authorization, ...restHeaders } = headers as Record<string, string>;
            headers = restHeaders;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "GET",
            headers,
        });
        return this.handleResponse(response);
    }
    async post<T>(
        endpoint: string,
        data: any,
        options: FetchOptions = {}
    ): Promise<T> {
        let headers: HeadersInit = {
            "Content-Type": "application/json",
            ...this.getAuthHeaders(),
            ...options.headers,
        };

        // Remove auth headers if skipAuth is true
        if (options.skipAuth && 'Authorization' in headers) {
            const { Authorization, ...restHeaders } = headers as Record<string, string>;
            headers = restHeaders;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        return this.handleResponse(response);
    }

    // PUT method for updating resources
    async put<T>(
        endpoint: string,
        data: any,
        options: FetchOptions = {}
    ): Promise<T> {
        let headers: HeadersInit = {
            "Content-Type": "application/json",
            ...this.getAuthHeaders(),
            ...options.headers,
        };

        // Remove auth headers if skipAuth is true
        if (options.skipAuth && 'Authorization' in headers) {
            const { Authorization, ...restHeaders } = headers as Record<string, string>;
            headers = restHeaders;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });
        return this.handleResponse(response);
    }

    async delete<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
        let headers: HeadersInit = {
            "Content-Type": "application/json",
            ...this.getAuthHeaders(),
            ...options.headers,
        };

        // Remove auth headers if skipAuth is true
        if (options.skipAuth && 'Authorization' in headers) {
            const { Authorization, ...restHeaders } = headers as Record<string, string>;
            headers = restHeaders;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "DELETE",
            headers,
        });
        return this.handleResponse(response);
    }
}

const fetchService = new FetchService();
export default fetchService;