import { API_BASE_URL } from '../config';

export class BaseApiClient {
  protected async fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  protected async get<T>(endpoint: string): Promise<T> {
    return this.fetchJson<T>(endpoint);
  }

  protected async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.fetchJson<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  protected async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.fetchJson<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    return this.fetchJson<T>(endpoint, {
      method: 'DELETE',
    });
  }
}