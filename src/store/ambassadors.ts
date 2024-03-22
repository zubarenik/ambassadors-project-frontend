import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Api, { ApiError } from '@/core/services/Api';
import { IData, IDataSelect, UNKNOWN_ERROR, ErrorBase } from '@/core/types/base';

const URL_CRUD = '/ambassadors';

enum AmbassadorCategoryEnum {
  TRAVELER = 1,
  SCIENCE = 2,
  MEDIA = 3,
}

export interface IAmbassadorCategory extends IDataSelect {
  value: AmbassadorCategoryEnum;
}

export const ambassadorCategories: IAmbassadorCategory[] = [
  { id: 1, name: 'Путешественник-энтузиаст', value: AmbassadorCategoryEnum.TRAVELER },
  { id: 2, name: 'Популяризатор науки', value: AmbassadorCategoryEnum.SCIENCE },
  { id: 3, name: 'Медиалидер', value: AmbassadorCategoryEnum.MEDIA },
];

export interface IQuestion {
  question: string;
  answer?: string;
}

export interface IAmbassadorBase extends IData {
  id: number;
  fullName: string;
  age: number;
  sex: boolean;
  placeBorn: string;
  placeLive: string;
  social: string;
  typeTourist: string;
  category: number | IAmbassadorCategory;
  generalQuestions: Required<IQuestion>[];
  specialQuestions: Required<IQuestion>[];
  winner: boolean;
  photos: string[];
}

export interface IAmbassador extends IAmbassadorBase {
  category: IAmbassadorCategory;
}

export interface IAmbassadorList extends IAmbassadorBase {
  category: IAmbassadorCategory;
}

export interface IAmbassadorApi extends IAmbassadorBase {
  category: number;
}

export interface IAmbassadorFilters {
  category?: IAmbassadorCategory | null;
}

export interface IAmbassadorFiltersApi {
  category?: number;
  page: number;
}

export default defineStore('ambassadors', () => {
  // Helpers
  function apiToBase(item: IAmbassadorApi): IAmbassador {
    return {
      ...item,
      category: ambassadorCategories.find((el) => el.value === item.category) ?? ambassadorCategories[0],
    };
  }

  function getNormalizedFilters(filters: IAmbassadorFilters): IAmbassadorFiltersApi {
    return {
      ...filters,
      page: 0,
      category: filters.category?.value,
    };
  }

  function handleResponse(data: IAmbassadorApi): IAmbassador {
    return apiToBase(data);
  }

  function getError(error: unknown) {
    const isApiError = error instanceof ApiError;
    const message = isApiError ? error.message : UNKNOWN_ERROR;

    return new ErrorBase(UNKNOWN_ERROR, message);
  }

  // State
  const ambassador = ref<IAmbassador>({} as IAmbassador);
  const ambassadors = ref<IAmbassador[]>([]);

  // Getters
  const getAmbassador = computed<IAmbassador>(() => ambassador.value);
  const getAmbassadorList = computed<IAmbassador[]>(() => ambassadors.value);

  // Setters
  const setAmbassador = (item: IAmbassador) => (ambassador.value = item);
  const setAmbassadorList = (items: IAmbassador[]) => (ambassadors.value = items);

  // Actions
  async function fetchAmbassadors(params: IAmbassadorFiltersApi) {
    try {
      const result = await Api.getInstance.get<IAmbassadorApi[]>(URL_CRUD, params);

      setAmbassadorList(result.map(handleResponse));
    } catch (error) {
      throw getError(error);
    }
  }

  async function fetchAmbassadorsWinners() {
    try {
      const result = await Api.getInstance.get<IAmbassadorApi[]>('/winners');

      setAmbassadorList(result.map(handleResponse));
    } catch (error) {
      throw getError(error);
    }
  }

  async function fetchAmbassador(id: number) {
    try {
      const result = await Api.getInstance.getByID<IAmbassadorApi>(URL_CRUD, id);

      setAmbassador(handleResponse(result));
    } catch (error) {
      throw getError(error);
    }
  }

  return {
    fetchAmbassadors,
    fetchAmbassador,
    getAmbassador,
    getAmbassadorList,
    getNormalizedFilters,
    fetchAmbassadorsWinners,
  };
});
