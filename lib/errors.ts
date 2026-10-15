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
