import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import api from './apiClient';
import { AxiosError, AxiosResponse } from 'axios';

/**
 * Generic type for API request objects
 * All request objects from seenelm/train-core should extend this
 */
export interface ApiRequest {}

/**
 * Generic type for API response objects
 * All response objects from seenelm/train-core should extend this
 */
export interface ApiResponse {}

/**
 * Generic type for API error responses
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

/**
 * Options for API calls
 */
interface ApiCallOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  params?: Record<string, any>;
  data?: ApiRequest;
  headers?: Record<string, string>;
}

/**
 * Make an API call using the provided options
 * @param options API call options
 * @returns Promise with the response data
 */
export async function apiCall<TResponse extends ApiResponse>(
  options: ApiCallOptions
): Promise<TResponse> {
  try {
    let response: AxiosResponse;

    switch (options.method) {
      case 'GET':
        response = await api.get<TResponse>(options.endpoint, {
          params: options.params,
          headers: options.headers,
        });
        break;
      case 'POST':
        response = await api.post<TResponse>(options.endpoint, options.data, {
          params: options.params,
          headers: options.headers,
        });
        break;
      case 'PUT':
        response = await api.put<TResponse>(options.endpoint, options.data, {
          params: options.params,
          headers: options.headers,
        });
        break;
      case 'PATCH':
        response = await api.patch<TResponse>(options.endpoint, options.data, {
          params: options.params,
          headers: options.headers,
        });
        break;
      case 'DELETE':
        response = await api.delete<TResponse>(options.endpoint, {
          params: options.params,
          headers: options.headers,
          data: options.data,
        });
        break;
      default:
        throw new Error(`Unsupported method: ${options.method}`);
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const apiError: ApiError = {
        message: error.response.data?.message || 'An unknown error occurred',
        code: error.response.data?.code,
        details: error.response.data?.details,
      };
      throw apiError;
    }
    throw error;
  }
}

/**
 * Hook for making query API calls (GET)
 * @param key Query key for React Query
 * @param endpoint API endpoint
 * @param params Query parameters
 * @param options Additional React Query options
 * @returns Query result
 */
export function useApiQuery<TResponse extends ApiResponse>(
  key: readonly unknown[],
  endpoint: string,
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<TResponse, ApiError, TResponse, readonly unknown[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TResponse, ApiError, TResponse, readonly unknown[]>({
    queryKey: key,
    queryFn: async () => {
      return apiCall<TResponse>({
        method: 'GET',
        endpoint,
        params,
      });
    },
    ...options,
  });
}

/**
 * Hook for making mutation API calls (POST, PUT, DELETE, PATCH)
 * @param method HTTP method
 * @param endpoint API endpoint
 * @param options Additional React Query options
 * @returns Mutation result
 */
export function useApiMutation<TRequest extends ApiRequest, TResponse extends ApiResponse>(
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  endpoint: string,
  options?: Omit<UseMutationOptions<TResponse, ApiError, TRequest, unknown>, 'mutationFn'>
) {
  return useMutation<TResponse, ApiError, TRequest, unknown>({
    mutationFn: async (data: TRequest) => {
      return apiCall<TResponse>({
        method,
        endpoint,
        data,
      });
    },
    ...options,
  });
}

/**
 * Hook for making GET requests with dynamic endpoints
 * @param key Query key for React Query
 * @param getEndpoint Function to generate the endpoint based on params
 * @param params Parameters for the endpoint function
 * @param options Additional React Query options
 * @returns Query result
 */
export function useDynamicApiQuery<TParams, TResponse extends ApiResponse>(
  key: readonly unknown[],
  getEndpoint: (params: TParams) => string,
  params: TParams,
  options?: Omit<UseQueryOptions<TResponse, ApiError, TResponse, readonly unknown[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TResponse, ApiError, TResponse, readonly unknown[]>({
    queryKey: [...key, params],
    queryFn: async () => {
      return apiCall<TResponse>({
        method: 'GET',
        endpoint: getEndpoint(params),
      });
    },
    ...options,
  });
}

/**
 * Hook for making mutation API calls with dynamic endpoints
 * @param method HTTP method
 * @param getEndpoint Function to generate the endpoint based on params
 * @param options Additional React Query options
 * @returns Mutation result
 */
export function useDynamicApiMutation<TParams, TRequest extends ApiRequest, TResponse extends ApiResponse>(
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  getEndpoint: (params: TParams) => string,
  options?: Omit<UseMutationOptions<TResponse, ApiError, { params: TParams; data: TRequest }, unknown>, 'mutationFn'>
) {
  return useMutation<TResponse, ApiError, { params: TParams; data: TRequest }, unknown>({
    mutationFn: async ({ params, data }: { params: TParams; data: TRequest }) => {
      return apiCall<TResponse>({
        method,
        endpoint: getEndpoint(params),
        data,
      });
    },
    ...options,
  });
}
