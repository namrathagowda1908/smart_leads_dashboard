export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  status: string;
  source: string;
  userId: number;
  createdAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
