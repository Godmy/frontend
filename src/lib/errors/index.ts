/**
 * Error handling module
 * Provides centralized error handling for the application
 */

export { AppError } from './AppError';
export { errorHandler, ErrorHandlerService } from './ErrorHandler';
export { ErrorType, ErrorSeverity } from './types';
export type { AppError as IAppError, ErrorHandlerOptions } from './types';
