import { default as createFastifyError } from '@fastify/error';

export enum ErrorCodes {
  DB_CREATE_NEW_USER = 'DB_CREATE_NEW_USER',
  USERNAME_TAKEN = 'USERNAME_TAKEN',
  EMAIL_TAKEN = 'EMAIL_TAKEN',
  COUNCL_ERR_VALIDATE = 'COUNCL_ERR_VALIDATE',
  DB_CREATE_MONITOR = 'DB_CREATE_MONITOR',
  DB_UPDATE_MONITOR = 'DB_UPDATE_MONITOR',
  FAST_JWT_ERR = 'FAST_JWT_ERROR',
  FAST_JWT_ERR_VALIDATE = 'FAST_JWT_VALIDATION_ERROR',
  SESSION_CANNOT_BE_SIGNED_IN = 'SESSION_CANNOT_BE_SIGNED_IN',
}

const createError = (code: ErrorCodes, message: string, statusCode?: number) =>
  createFastifyError(code, message, statusCode);

const errors = {
  DB_CREATE_NEW_USER: createError(
    ErrorCodes.DB_CREATE_NEW_USER,
    'Could not create new user: %s',
    500
  ),
  USERNAME_TAKEN: createError(ErrorCodes.USERNAME_TAKEN, "Username '%s' is taken", 400),
  EMAIL_TAKEN: createError(ErrorCodes.EMAIL_TAKEN, "Email '%s' is taken", 400),
  COUNCL_ERR_VALIDATE: createError(
    ErrorCodes.COUNCL_ERR_VALIDATE,
    'New user validation failed: %s',
    400
  ),
  DB_CREATE_MONITOR: createError(
    ErrorCodes.DB_CREATE_MONITOR,
    'Could not create new monitor: %s',
    500
  ),
  DB_UPDATE_MONITOR: createError(ErrorCodes.DB_UPDATE_MONITOR, 'Could not update monitor: %s', 500),
  FAST_JWT_ERR: createError(ErrorCodes.FAST_JWT_ERR, '%s', 500),
  FAST_JWT_ERR_VALIDATE: createError(ErrorCodes.FAST_JWT_ERR_VALIDATE, '%s', 400),
  SESSION_CANNOT_BE_SIGNED_IN: createError(
    ErrorCodes.SESSION_CANNOT_BE_SIGNED_IN,
    'Cannot be signed in to access this route',
    400
  ),
};

export { errors };
