export class EpoOpsError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'EpoOpsError';
  }
}

export class AuthenticationError extends EpoOpsError {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends EpoOpsError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends EpoOpsError {
  constructor(message: string = 'Invalid input') {
    super(message);
    this.name = 'ValidationError';
  }
} 
