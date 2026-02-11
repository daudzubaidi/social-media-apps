export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiError {
  success: false;
  message: string;
  data: null | ValidationError[];
}

export interface LegacyValidationError {
  field: string;
  message: string;
}

export interface PathValidationError {
  path: string;
  msg: string;
  type?: string;
  location?: string;
  value?: unknown;
}

export type ValidationError = LegacyValidationError | PathValidationError;

export function getValidationErrorField(error: ValidationError): string | null {
  if ("field" in error) return error.field;
  if ("path" in error) return error.path;
  return null;
}

export function getValidationErrorMessage(error: ValidationError): string | null {
  if ("message" in error) return error.message;
  if ("msg" in error) return error.msg;
  return null;
}

export function extractPaginatedList<T>(
  data: Record<string, unknown>,
): { items: T[]; pagination: Pagination } {
  const { pagination, ...rest } = data;
  const items = (Object.values(rest).find(Array.isArray) as T[]) ?? [];
  return { items, pagination: pagination as Pagination };
}
