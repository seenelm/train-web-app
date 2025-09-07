import { QueryParams } from "./BaseApiService";

/**
 * Utility functions for API services
 */
export class ApiServiceUtils {
  /**
   * Build pagination parameters
   */
  static buildPaginationParams(
    page?: number,
    limit?: number,
    cursor?: string
  ): QueryParams {
    const params: QueryParams = {};

    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;
    if (cursor !== undefined) params.cursor = cursor;

    return params;
  }

  /**
   * Build search parameters
   */
  static buildSearchParams(
    searchTerm?: string,
    filters?: Record<string, any>,
    pagination?: { page?: number; limit?: number; cursor?: string }
  ): QueryParams {
    const params: QueryParams = { ...pagination };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });
    }

    return params;
  }

  /**
   * Validate required parameters
   */
  static validateRequiredParams(
    params: Record<string, any>,
    requiredFields: string[]
  ): void {
    const missingFields = requiredFields.filter(
      (field) => params[field] === undefined || params[field] === null
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required parameters: ${missingFields.join(", ")}`
      );
    }
  }

  /**
   * Sanitize string parameters
   */
  static sanitizeString(value: string): string {
    return value.trim().replace(/[<>]/g, "");
  }

  /**
   * Format date for API
   */
  static formatDateForApi(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toISOString();
  }

  /**
   * Parse API date
   */
  static parseApiDate(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Debounce function for search
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Throttle function for API calls
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

/**
 * Common error types for services
 */
export class ApiServiceError extends Error {
  public readonly statusCode?: number;
  public readonly code?: string;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = "ApiServiceError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * Service response wrapper
 */
export class ApiServiceResponse<T> {
  public readonly data: T;
  public readonly success: boolean;
  public readonly message?: string;
  public readonly timestamp: Date;

  constructor(data: T, success: boolean = true, message?: string) {
    this.data = data;
    this.success = success;
    this.message = message;
    this.timestamp = new Date();
  }

  static success<T>(data: T, message?: string): ApiServiceResponse<T> {
    return new ApiServiceResponse(data, true, message);
  }

  static error<T>(data: T, message: string): ApiServiceResponse<T> {
    return new ApiServiceResponse(data, false, message);
  }
}
