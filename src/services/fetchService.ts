import authService from "./authService";

interface FetchOptions {
    headers?: HeadersInit;
    body?: unknown;
    skipAuth?: boolean;
}

class FetchService {
    private readonly baseUrl: string;
    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    }

    private getAuthHeaders(): HeadersInit {
        const token = authService.getToken();
        if (token) {
            return {
                Authorization: `Bearer ${token}`,
            };
        }
        return {};
    }

    private async handleResponse(response: Response) {
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                errorMessage = response.statusText || errorMessage;
            }
            throw new Error(errorMessage);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            const text = await response.text();
            throw new Error(
                `Expected JSON response but got: ${text.substring(0, 100)}...`
            );
        }
    }

    async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
        let headers: HeadersInit = {
            "Content-Type": "application/json",
            ...this.getAuthHeaders(),
            ...options.headers,
        };

        if (options.skipAuth && "Authorization" in headers) {
            const { Authorization, ...restHeaders } = headers as Record<
                string,
                string
            >;

            void Authorization;
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
        data: unknown,
        options: FetchOptions = {}
    ): Promise<T> {
        let headers: HeadersInit = {
            "Content-Type": "application/json",
            ...this.getAuthHeaders(),
            ...options.headers,
        };

        if (options.skipAuth && "Authorization" in headers) {
            const { Authorization, ...restHeaders } = headers as Record<
                string,
                string
            >;

            void Authorization;
            headers = restHeaders;
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        return this.handleResponse(response);
    }

    async put<T>(
        endpoint: string,
        data: unknown,
        options: FetchOptions = {}
    ): Promise<T> {
        let headers: HeadersInit = {
            "Content-Type": "application/json",
            ...this.getAuthHeaders(),
            ...options.headers,
        };

        if (options.skipAuth && "Authorization" in headers) {
            const { Authorization, ...restHeaders } = headers as Record<
                string,
                string
            >;

            void Authorization;
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

        if (options.skipAuth && "Authorization" in headers) {
            const { Authorization, ...restHeaders } = headers as Record<
                string,
                string
            >;

            void Authorization;
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
