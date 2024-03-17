export interface IData {
  [key: string]: unknown;
}

export interface IDataSelect<T = string> extends IData {
  id: number;
  name: T;
}

export const UNKNOWN_ERROR = 'Unknown error';
export class ErrorBase<T extends string> extends Error {
  name: T;
  message: string;

  constructor(name: T, message: string) {
    super();
    this.name = name;
    this.message = message;
  }
}
