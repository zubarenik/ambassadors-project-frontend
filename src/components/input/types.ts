import type { IDataSelect } from '@/core/types/base';

export type SelectOption = IDataSelect | IDataSelect[] | null;

export interface SelectProps {
  options: IDataSelect[];
  autocomplete?: boolean;
  modelValue?: SelectOption;
  multiple?: boolean;
  placeholder?: string;
  exclude?: Set<number>;
  clearable?: boolean;
  selectAll?: boolean;
  disabledOptions?: IDataSelect[];
  disabled?: boolean;
  loading?: boolean;
}
