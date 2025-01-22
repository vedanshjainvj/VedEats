import { Request } from "express";

export interface PaginationResult {
  skip: number;
  limit: number;
  page: number;
  totalPages: number;
  totalItems: number;
}

export const getPagination = (
  req: Request,
  totalItems: number,
  defaultLimit: number = 2
): PaginationResult => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || defaultLimit;

  const totalPages = Math.ceil(totalItems / limit);

  if (page > totalPages && totalPages > 0) {
    throw new Error("Page not found");
  }

  return {
    skip: (page - 1) * limit,
    limit,
    page,
    totalPages,
    totalItems,
  };
};
