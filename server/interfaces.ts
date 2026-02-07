export interface IDataResult<T = any> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type UploadedFile = {
  filename: string;
  type?: string;
  data: Buffer;
  size: number;
  url?: string;
};

export class UpFile {
  constructor(
    public readonly filename: string,
    public readonly data: Buffer,
    public readonly size: number,
    public readonly type: string,
    public readonly url?: string,
  ) {}
}

export enum CurrencyAvailaible {
  XOF = "XOF",
  EUR = "EUR",
  USD = "USD",
}
