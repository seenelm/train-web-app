import { AxiosResponse } from "axios";
import api from "./apiClient";
import { SuccessResponse } from "../types/api.types";

/**
 * Generic types for API operations
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface QueryParams extends PaginationParams {
  [key: string]: any;
}

/**
 * Abstract base class for API service classes
 * Provides common CRUD operations and error handling patterns
 */
export abstract class BaseApiService<
  TEntity,
  TCreateRequest = Partial<TEntity>,
  TUpdateRequest = Partial<TEntity>
> {
  protected readonly baseEndpoint: string;
  protected readonly serviceName: string;

  constructor(baseEndpoint: string, serviceName: string) {
    this.baseEndpoint = baseEndpoint;
    this.serviceName = serviceName;
  }

  /**
   * Generic GET request handler
   */
  protected async get<TResponse = TEntity>(
    endpoint: string,
    params?: QueryParams
  ): Promise<TResponse> {
    try {
      const queryString = params ? this.buildQueryString(params) : "";
      const url = queryString ? `${endpoint}?${queryString}` : endpoint;
      const response: AxiosResponse<TResponse> = await api.get(url);
      return response.data;
    } catch (error) {
      this.handleError(`Error fetching ${this.serviceName}`, error);
      throw error;
    }
  }

  /**
   * Generic POST request handler
   */
  protected async post<TResponse = TEntity>(
    endpoint: string,
    data?: any
  ): Promise<TResponse> {
    try {
      const response: AxiosResponse<TResponse> = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(`Error creating ${this.serviceName}`, error);
      throw error;
    }
  }

  /**
   * Generic PUT request handler
   */
  protected async put<TResponse = TEntity>(
    endpoint: string,
    data?: any
  ): Promise<TResponse> {
    try {
      const response: AxiosResponse<TResponse> = await api.put(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(`Error updating ${this.serviceName}`, error);
      throw error;
    }
  }

  /**
   * Generic PATCH request handler
   */
  protected async patch<TResponse = TEntity>(
    endpoint: string,
    data?: any
  ): Promise<TResponse> {
    try {
      const response: AxiosResponse<TResponse> = await api.patch(
        endpoint,
        data
      );
      return response.data;
    } catch (error) {
      this.handleError(`Error updating ${this.serviceName}`, error);
      throw error;
    }
  }

  /**
   * Generic DELETE request handler
   */
  protected async delete<TResponse = SuccessResponse>(
    endpoint: string
  ): Promise<TResponse> {
    try {
      const response: AxiosResponse<TResponse> = await api.delete(endpoint);
      return response.data;
    } catch (error) {
      this.handleError(`Error deleting ${this.serviceName}`, error);
      throw error;
    }
  }

  /**
   * Build query string from parameters
   */
  protected buildQueryString(params: QueryParams): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, item.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    return searchParams.toString();
  }

  /**
   * Centralized error handling
   */
  protected handleError(message: string, error: any): void {
    console.error(message, error);

    // You can extend this to include more sophisticated error handling
    // such as logging to external services, showing user notifications, etc.
  }

  /**
   * Abstract method to be implemented by concrete services
   * Defines the base endpoint for the service
   */
  protected abstract getBaseEndpoint(): string;

  // Common CRUD operations that can be overridden by concrete services

  /**
   * Get entity by ID
   */
  async getById(id: string): Promise<TEntity> {
    return this.get<TEntity>(`${this.getBaseEndpoint()}/${id}`);
  }

  /**
   * Get all entities with optional pagination
   */
  async getAll(params?: QueryParams): Promise<TEntity[]> {
    return this.get<TEntity[]>(this.getBaseEndpoint(), params);
  }

  /**
   * Create a new entity
   */
  async create(data: TCreateRequest): Promise<TEntity> {
    return this.post<TEntity>(this.getBaseEndpoint(), data);
  }

  /**
   * Update an entity by ID
   */
  async update(id: string, data: TUpdateRequest): Promise<TEntity> {
    return this.put<TEntity>(`${this.getBaseEndpoint()}/${id}`, data);
  }

  /**
   * Delete an entity by ID
   */
  async deleteById(id: string): Promise<SuccessResponse> {
    return this.delete<SuccessResponse>(`${this.getBaseEndpoint()}/${id}`);
  }

  /**
   * Check if an entity exists by ID
   */
  async exists(id: string): Promise<boolean> {
    try {
      await this.getById(id);
      return true;
    } catch (error) {
      return false;
    }
  }
}
