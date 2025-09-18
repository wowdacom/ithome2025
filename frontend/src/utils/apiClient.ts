export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public response?: unknown
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

export class ApiClient {
    private baseUrl: string

    constructor(baseUrl = '/api') {
        this.baseUrl = baseUrl
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new ApiError(
                errorData.message || response.statusText,
                response.status,
                errorData
            )
        }

        return response.json()
    }

    async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin)

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value) url.searchParams.set(key, value)
            })
        }

        const response = await fetch(url.toString())
        return this.handleResponse<T>(response)
    }

    async post<T>(endpoint: string, data: unknown): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        return this.handleResponse<T>(response)
    }

    async put<T>(endpoint: string, data: unknown): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        return this.handleResponse<T>(response)
    }

    async delete<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
        })

        return this.handleResponse<T>(response)
    }
}

export const apiClient = new ApiClient()
