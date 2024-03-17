import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import router from '@/router';
import { ErrorBase } from '../types/base';
import useModalConfirm from '@/core/plugins/useModalConfirm';
import { ModalConfirmTypes } from '@/components/modal/types';
import { i18n } from '@/core/services/I18n';

const BASE_API_URL = `${import.meta.env.VITE_APP_API_URL}/api/v3.2/admin-panel`;

/**
 ** Pagination
 */
export interface Pagination {
  page: number; // Номер текущей страницы.
  page_size: number; // Сколько элементов на одной странице.
  total_count: number; // Сколько всего элементов.
}

export type PaginationRequest = Omit<Pagination, 'total_count'>;

/**
 ** Success response
 */
export interface ResponseSuccessBody<T = unknown> {
  pagination?: Pagination;
  result: T;
}

/**
 ** Error response
 */
interface ResponseErrorDescriptionItem {
  loc: string[];
  msg: string;
}

interface ResponseError<T> {
  title: string;
  detail: string;
  error_descriptions: T;
}

interface ResponseErrorBody {
  error: ResponseError<ResponseErrorDescriptionItem[]>;
}

export const enum ApiErrorNames {
  'API_RESPONSE_ERROR' = 'API Response Error',
}

export class ApiError extends ErrorBase<ApiErrorNames> {
  code: number;

  constructor(name: ApiErrorNames, statusCode: number, statusText: string) {
    super(name, `${statusCode} ${statusText}`);
    this.code = statusCode;
  }
}

export abstract class HttpClient {
  protected readonly instance: AxiosInstance;

  protected constructor(baseURL: string) {
    const config: AxiosRequestConfig = {
      baseURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    this.instance = axios.create(config);
    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor(): void {
    this.instance.interceptors.response.use(this._handleResponse, this._handleError);
  }

  protected _handleResponse({ data }: AxiosResponse<ResponseSuccessBody>) {
    if (data.pagination) {
      return data;
    }
    return data.result;
  }

  protected async _handleError(error: AxiosError<ResponseErrorBody>) {
    const confirmError = useModalConfirm(`${i18n.global.t('error')}!`, `${i18n.global.t('error_save')}!`, {
      onlyConfirm: true,
      clickToClose: false,
      type: ModalConfirmTypes.ERROR,
    });

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Network error
    if (!error.response) {
      confirmError.open();
      return Promise.reject(error);
    }

    const { status, data: body } = error.response;
    const data = body.error;

    if (status >= 500) {
      await router.push({ name: '500' });
    } else if (status === 404) {
      await router.push({ name: '404' });
    } else if (status === 401) {
      await router.push({ name: 'login' });
    } else {
      confirmError.open({ title: data.title, subTitle: data.detail });

      const apiError = new ApiError(ApiErrorNames.API_RESPONSE_ERROR, status, data.detail);
      return Promise.reject(apiError);
    }
  }

  public setLanguage(locale: string): void {
    this.instance.defaults.headers.common['Accept-Language'] = locale;
  }

  public get<T>(url: string, params?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<never, T>(url, {
      ...config,
      params,
    });
  }

  public getByID<T>(url: string, id: number, params?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<never, T>(`${url}/${id}`, {
      ...config,
      params,
    });
  }

  public post<T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<never, T>(url, data, config);
  }

  public update<T>(url: string, id: number, data: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<never, T>(`${url}/${id}`, data, config);
  }

  public updatePartial<T>(url: string, id: number, data: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch<never, T>(`${url}/${id}`, data, config);
  }

  public delete<T>(url: string, id: number, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<never, T>(`${url}/${id}`, config);
  }
}

export default class Api extends HttpClient {
  private static classInstance?: Api;

  private constructor() {
    super(BASE_API_URL);
  }

  public static get getInstance(): Api {
    if (!this.classInstance) {
      this.classInstance = new Api();
    }
    return this.classInstance;
  }
}
