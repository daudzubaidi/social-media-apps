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

export interface ValidationError {
  field: string;
  message: string;
}

export function extractPaginatedList<T>(
  data: Record<string, unknown>,
): { items: T[]; pagination: Pagination } {
  const { pagination, ...rest } = data;
  const items = (Object.values(rest).find(Array.isArray) as T[]) ?? [];
  return { items, pagination: pagination as Pagination };
}
