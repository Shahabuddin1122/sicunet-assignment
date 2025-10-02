interface FetchOptions {
    headers?: HeadersInit;
    body?: any;
}

class FetchService {
    private readonly baseUrl: string;
    constructor() {
        // Use Next.js environment variable
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL;
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
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });
        return this.handleResponse(response);
    }
    async post<T>(
        endpoint: string,
        data: any,
        options: FetchOptions = {}
    ): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
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
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            body: JSON.stringify(data),
        });
        return this.handleResponse(response);
    }

    async delete<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        });
        return this.handleResponse(response);
    }
}

const fetchService = new FetchService();
export default fetchService;