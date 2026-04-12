export interface IDataResult<T = any> {
  items: T[];
  page: number;
  pageSize: number;
  totalPages: number;

  /** le total des items récupéré */
  total: number;

  /** le total des items qui occrespond à la rechche */
  totalItems: number;
}
