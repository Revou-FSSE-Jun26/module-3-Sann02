/** Thrown for non-2xx API responses; `status` lets callers branch (401, 409, ...). */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    /** Field name when the API reports a single invalid field. */
    public readonly field?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Human-readable message for any thrown value (for toasts and banners). */
export function getErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/**
 * True when the API rejected the request because the JWT is missing, expired
 * or invalid (HTTP 401). Callers use this to log out and send the user to
 * /login instead of showing a dead-end "Token has expired" error.
 */
export function isAuthExpiredError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}
