import { HttpStatusCode } from 'axios';

export interface IApiError extends Error {
  statusCode: number;
  rawErrors?: string[];
}

export class ApiError extends Error implements IApiError {
  statusCode: number;
  rawErrors?: string[];
  constructor(statusCode: number, message: string, rawErrors?: string[]) {
    super(message);
    this.statusCode = statusCode;
    if (rawErrors) {
      this.rawErrors = rawErrors;
    }
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HttpBadRequestError extends ApiError {
  constructor(message: string, errors?: string[]) {
    super(HttpStatusCode.BadRequest, message, errors);
  }
}

export class HttpInternalServerError extends ApiError {
  constructor(message: string, errors?: string[]) {
    super(HttpStatusCode.InternalServerError, message, errors);
  }
}

export class HttpUnAuthorizedError extends ApiError {
  constructor(message: string) {
    super(HttpStatusCode.Unauthorized, message);
  }
}

export class HttpNotFoundError extends ApiError {
  constructor(message: string, errors?: string[]) {
    super(HttpStatusCode.NotFound, message, errors);
  }
}

export class HttpForbiddenError extends ApiError {
  constructor(message: string) {
    super(HttpStatusCode.Forbidden, message);
  }
}

export class HttpConflictError extends ApiError {
  constructor(message: string) {
    super(HttpStatusCode.Conflict, message);
  }
}

export class HttpUnprocessableEntityError extends ApiError {
  constructor(message: string) {
    super(HttpStatusCode.UnprocessableEntity, message);
  }
}

export class HttpTooManyRequestsError extends ApiError {
  constructor(message: string) {
    super(HttpStatusCode.TooManyRequests, message);
  }
}

export class HttpBadGatewayError extends ApiError {
  constructor(message: string) {
    super(HttpStatusCode.BadGateway, message);
  }
}

export class HttpServiceUnavailableError extends ApiError {
  constructor(message: string) {
    super(HttpStatusCode.ServiceUnavailable, message);
  }
}

export class HttpGatewayTimeoutError extends ApiError {
  constructor(message: string) {
    super(HttpStatusCode.GatewayTimeout, message);
  }
}

export class HttpNotImplementedError extends ApiError {
  constructor(message: string) {
    super(HttpStatusCode.NotImplemented, message);
  }
}

export class HttpNotAcceptableError extends ApiError {
  constructor(message: string) {
    super(HttpStatusCode.NotAcceptable, message);
  }
}

export class HttpRequestTimeoutError extends ApiError {
  constructor(message: string) {
    super(HttpStatusCode.RequestTimeout, message);
  }
}
