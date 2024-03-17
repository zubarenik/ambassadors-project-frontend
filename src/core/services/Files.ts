import Api, { ApiError } from '@/core/services/Api';
import { ErrorBase } from '@/core/types/base';
import { AxiosRequestConfig } from 'axios';

export const BASE_MEDIA_URL = `${import.meta.env.VITE_APP_API_URL}/media`;
export const STATIC_MEDIA_URL = `${import.meta.env.VITE_APP_API_URL}/static`;

const API_URL = '/upload-file';
const API_FIELD_NAME = 'file';

export enum FORMATS {
  'IMAGE' = 'image',
  'ANIMATION' = 'animation',
  'VIDEO' = 'video',
}

export type ALL_FORMATS = FORMATS.IMAGE | FORMATS.ANIMATION | FORMATS.VIDEO;

export const PERMITTED_FORMATS: Record<ALL_FORMATS, string[]> = {
  image: ['.png', '.jpg', '.jpeg'],
  animation: ['.json'],
  video: ['.mp4'],
};

const MIME_FORMATS: Record<ALL_FORMATS, string[]> = {
  image: ['image/png', 'image/jpeg'],
  animation: ['application/json'],
  video: ['video/mp4'],
};

interface FileApiResponse {
  url: string;
}

interface FileInitialParams {
  file?: File;
  path?: string;
}

interface FileProperties {
  name: string;
  type: ALL_FORMATS;
  path?: string;
}

export enum COMPARISON_OPERATOR {
  '<',
  '>',
  '<=',
  '>=',
  '!==',
  '===',
  '~',
}

interface ComparisonValue {
  value: number;
  operator: COMPARISON_OPERATOR;
  accuracy?: number;
}

function compare(value: number, permission?: ComparisonValue): boolean {
  if (!permission) {
    return true;
  }

  const { operator, value: reference, accuracy } = permission;

  switch (operator) {
    case COMPARISON_OPERATOR['<']:
      return value < reference;
    case COMPARISON_OPERATOR['>']:
      return value > reference;
    case COMPARISON_OPERATOR['<=']:
      return value <= reference;
    case COMPARISON_OPERATOR['>=']:
      return value >= reference;
    case COMPARISON_OPERATOR['!==']:
      return value !== reference;
    case COMPARISON_OPERATOR['===']:
      return value === reference;
    case COMPARISON_OPERATOR['~']:
      return !!accuracy && value >= reference - accuracy && value <= reference + accuracy;
    default:
      return false;
  }
}

export interface ImagePermissions {
  width?: ComparisonValue;
  height?: ComparisonValue;
}

type FileErrorName = 'INCORRECT_FILE_TYPE' | 'FILE_DOES_NOT_EXIST' | 'INCORRECT_INITIAL_PARAMS';

export abstract class FileManager {
  protected readonly BASE_MEDIA_URL: string;
  protected readonly STATIC_MEDIA_URL: string;

  protected constructor(mediaURL: string, staticURL: string) {
    this.BASE_MEDIA_URL = mediaURL;
    this.STATIC_MEDIA_URL = staticURL;
  }

  protected async uploadFile(file: File, config?: AxiosRequestConfig): Promise<string> {
    try {
      const data = new FormData();
      data.append(API_FIELD_NAME, file);

      config = {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      };

      const result = await Api.getInstance.post<FileApiResponse>(API_URL, data, config);
      return result.url;
    } catch (error) {
      const isApiError = error instanceof ApiError;
      const message = isApiError ? error.message : 'Unknown error';

      throw new ErrorBase('Unknown error', message);
    }
  }

  public static escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  public static createStrictRegexPattern(base: string, existingRegex?: string): RegExp {
    const escapedStr = this.escapeRegExp(base);
    const pattern = `^${escapedStr}${existingRegex ? existingRegex : '$'}`;
    return new RegExp(pattern);
  }

  public static createRegexPatternForLink(base: string): RegExp {
    const existingRegex = '/.+(\\.[^.]+)$';
    return this.createStrictRegexPattern(base, existingRegex);
  }

  public isCorrectLink(link: string): boolean {
    const basePattern = FileManager.createRegexPatternForLink(this.BASE_MEDIA_URL);
    const staticPattern = FileManager.createRegexPatternForLink(this.STATIC_MEDIA_URL);

    return basePattern.test(link) || staticPattern.test(link);
  }

  public getCorrectLink(link: string): string {
    return this.isCorrectLink(link) ? link : `${this.BASE_MEDIA_URL}/${link}`;
  }

  public isValidType(permittedType: ALL_FORMATS | ALL_FORMATS[], currentType: ALL_FORMATS): boolean {
    const format = Array.isArray(permittedType) ? permittedType : [permittedType];
    return format.includes(currentType);
  }

  public isValidImage(permissions: ImagePermissions, file: File): Promise<boolean> {
    return this.isValidImageSize(file, permissions.width, permissions.height);
  }

  public isValidImageSize(file: File, width?: ComparisonValue, height?: ComparisonValue): Promise<boolean> {
    const promise = new Promise<boolean>(function (resolve) {
      const img = document.createElement('img');

      const objectURL = URL.createObjectURL(file);

      img.onload = function handleLoad() {
        resolve(compare(img.width, width) && compare(img.height, height));

        URL.revokeObjectURL(objectURL);
      };

      img.src = objectURL;
    });

    return promise;
  }

  public fromMIMEtoType(mimeType: string): ALL_FORMATS {
    const result = (Object.keys(MIME_FORMATS) as ALL_FORMATS[]).find((format) =>
      MIME_FORMATS[format].includes(mimeType)
    );

    if (!result) {
      throw new ErrorBase<FileErrorName>('INCORRECT_FILE_TYPE', 'Incorrect format of your file');
    }

    return result;
  }

  public fromStringToType(strType: string): ALL_FORMATS {
    strType = `.${strType}`;

    const result = (Object.keys(PERMITTED_FORMATS) as ALL_FORMATS[]).find((format) =>
      PERMITTED_FORMATS[format].includes(strType)
    );

    if (!result) {
      throw new ErrorBase<FileErrorName>('INCORRECT_FILE_TYPE', 'Incorrect format of your file');
    }

    return result;
  }

  public fromTypeToAcceptString(type: ALL_FORMATS | ALL_FORMATS[]): string {
    const formats = Array.isArray(type) ? type : [type];
    return formats.map((current) => PERMITTED_FORMATS[current].join(',')).join(',');
  }
}

export class FileService extends FileManager {
  private file?: File;
  private fileProperties: FileProperties;
  private pending: boolean;

  public get getFileName(): string {
    return this.fileProperties.name;
  }

  public get getFileType(): ALL_FORMATS {
    return this.fileProperties.type;
  }

  public get getFilePath(): string {
    return this.fileProperties.path ?? this.fileProperties.name;
  }

  public get isPending(): boolean {
    return this.pending;
  }

  public constructor(rawValue: FileInitialParams) {
    super(BASE_MEDIA_URL, STATIC_MEDIA_URL);

    if (rawValue.file) {
      this.fileProperties = this.initByFile(rawValue.file, rawValue.path);
    } else if (rawValue.path) {
      this.fileProperties = this.initByPath(rawValue.path);
    } else {
      throw new ErrorBase<FileErrorName>('INCORRECT_INITIAL_PARAMS', 'Incorrect initial params');
    }

    this.pending = false;
  }

  private initByFile(file: File, path?: string): FileProperties {
    this.file = file;
    path ??= URL.createObjectURL(file);

    return {
      name: file.name,
      type: this.fromMIMEtoType(file.type),
      path,
    };
  }

  private initByPath(path: string): FileProperties {
    if (!this.isCorrectLink(path)) {
      throw new ErrorBase<FileErrorName>('INCORRECT_INITIAL_PARAMS', 'Incorrect initial params');
    }

    const endOfPath = path.split('/').pop() ?? '';
    const type = this.fromStringToType(endOfPath.split('.').pop() ?? '');

    return {
      name: endOfPath,
      type,
      path,
    };
  }

  public async saveFile(apiPrefix: string): Promise<void> {
    if (!this.file) {
      throw new ErrorBase<FileErrorName>('FILE_DOES_NOT_EXIST', 'The file does not exist');
    }

    this.pending = true;

    const result = await super.uploadFile(this.file, {
      params: {
        x_prefix: apiPrefix,
      },
    });

    this.pending = false;

    this.fileProperties.name = result;
    this.fileProperties.path = `${this.BASE_MEDIA_URL}/${result}`;
  }

  public isValidType(permittedType: ALL_FORMATS | ALL_FORMATS[], currentType = this.fileProperties.type): boolean {
    return super.isValidType(permittedType, currentType);
  }

  public isValidImage(permissions: ImagePermissions, file = this.file): Promise<boolean> {
    if (file && this.isValidType(FORMATS.IMAGE)) {
      return super.isValidImage(permissions, file);
    }
    return Promise.resolve(false);
  }
}

export class SingletonFileManager extends FileManager {
  private static classInstance?: SingletonFileManager;

  private constructor() {
    super(BASE_MEDIA_URL, STATIC_MEDIA_URL);
  }

  public static get getInstance(): SingletonFileManager {
    if (!this.classInstance) {
      this.classInstance = new SingletonFileManager();
    }
    return this.classInstance;
  }
}
