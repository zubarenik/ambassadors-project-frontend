import { StringSchema as YupStringSchema } from 'yup';
import { FORMATS } from '@/core/services/Files';

declare module 'yup' {
  interface StringSchema {
    staticLink(): YupStringSchema;
  }
  interface StringSchema {
    [FORMATS.IMAGE](): YupStringSchema;
  }
  interface StringSchema {
    [FORMATS.ANIMATION](): YupStringSchema;
  }
  interface StringSchema {
    [FORMATS.VIDEO](): YupStringSchema;
  }
}
