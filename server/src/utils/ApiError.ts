class ApiError extends Error {
  code: number;
  data: null;
  success: boolean;
  errors: unknown[];

  constructor(
    code: number,
    message: string = "Something went wrong",
    errors: unknown[] = [],
    stack?: string
  ) {
    super(message);

    this.code = code;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
