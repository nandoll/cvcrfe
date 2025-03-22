// src/utils/errors.ts
/**
 * Base class for all application errors
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errorCode?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    errorCode?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorCode = errorCode;

    // Capturing stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for bad requests (400)
 */
export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request", errorCode?: string) {
    super(message, 400, true, errorCode);
  }
}

/**
 * Error for unauthorized access (401)
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized", errorCode?: string) {
    super(message, 401, true, errorCode);
  }
}

/**
 * Error for forbidden access (403)
 */
export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden", errorCode?: string) {
    super(message, 403, true, errorCode);
  }
}

/**
 * Error for resources not found (404)
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", errorCode?: string) {
    super(message, 404, true, errorCode);
  }
}

/**
 * Error for validation failures (422)
 */
export class ValidationError extends AppError {
  public errors?: Record<string, string[]>;

  constructor(
    message: string = "Validation failed",
    errors?: Record<string, string[]>,
    errorCode?: string
  ) {
    super(message, 422, true, errorCode);
    this.errors = errors;
  }
}

/**
 * Error for rate limiting (429)
 */
export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests", errorCode?: string) {
    super(message, 429, true, errorCode);
  }
}

/**
 * Error for server errors (500)
 */
export class ServerError extends AppError {
  constructor(message: string = "Internal server error", errorCode?: string) {
    super(message, 500, false, errorCode);
  }
}

/**
 * Error for third-party service failures
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string = "Service unavailable", errorCode?: string) {
    super(message, 503, false, errorCode);
  }
}

/**
 * Error for database operation failures
 */
export class DatabaseError extends AppError {
  constructor(
    message: string = "Database operation failed",
    errorCode?: string
  ) {
    super(message, 500, false, errorCode);
  }
}

/**
 * Handler function to format errors for API responses
 * @param error - Error object
 * @param includeStack - Whether to include stack trace
 * @returns Formatted error response
 */
export function formatErrorResponse(error: any, includeStack: boolean = false) {
  const isDev = process.env.NODE_ENV === "development";

  // If it's an AppError
  if (error instanceof AppError) {
    const response: any = {
      success: false,
      error: {
        message: error.message,
        statusCode: error.statusCode,
        code: error.errorCode || error.name,
      },
    };

    // Include validation errors if available
    if (error instanceof ValidationError && error.errors) {
      response.error.details = error.errors;
    }

    // Include stack in development or if explicitly requested
    if ((isDev || includeStack) && error.stack) {
      response.error.stack = error.stack;
    }

    return response;
  }

  // For other errors, create a generic server error
  const serverError = new ServerError(
    isDev && error.message ? error.message : "An unexpected error occurred"
  );

  const response: any = {
    success: false,
    error: {
      message: serverError.message,
      statusCode: serverError.statusCode,
      code: serverError.name,
    },
  };

  // Include original error stack in development
  if (isDev && error.stack) {
    response.error.stack = error.stack;
  }

  return response;
}
