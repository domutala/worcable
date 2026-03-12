export interface IDataResult<T = any> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
