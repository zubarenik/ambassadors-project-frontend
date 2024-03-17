export enum SortDirections {
  ASC = 'asc',
  DESC = 'desc',
}

export type SortValue = string | number | unknown;

type SortItem<T> = {
  [K in keyof T]: SortValue;
};

export type SortParams = {
  direction: SortDirections;
  field: string;
  api: string;
};

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
const helper = (value1: SortValue, value2: SortValue) => {
  if (typeof value1 === 'string' && typeof value2 === 'string') {
    return collator.compare(value1, value2);
  }
  if (typeof value1 === 'number' && typeof value2 === 'number') {
    return value1 > value2 ? 1 : -1;
  }
  return 0;
};

export function sortArray<T>(arr: SortItem<T>[], key: string, direction: SortDirections) {
  arr.sort((a, b) => {
    const valueA = a[key as keyof T];
    const valueB = b[key as keyof T];
    return direction === SortDirections.ASC ? helper(valueA, valueB) : helper(valueB, valueA);
  });
  return arr as T[];
}
