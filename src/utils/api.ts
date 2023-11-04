import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
import { LocationType, Resources } from './constants';
import { User } from './types';

const cookies = new Cookies();

interface GetAll {
  resource: string;
  page?: number;
  populate?: string[];
  municipalityId?: string;
  filter?: string | any;
  query?: string;
  pageSize?: string;
  search?: string;
  searchFields?: string[];
  sort?: string[];
  scope?: string;
  fields?: string[];
  id?: string;
  geom?: any;
  responseType?: any;
}

export interface GetAllResponse<T> {
  rows: T[];
  totalPages: number;
  page: number;
  pageSize: number;
  error?: any;
}

// interface TableList<T = any> {
//   filter?: T;
//   page?: number;
//   id?: string;
//   pageSize?: string;
//   scope?: string;
//   fields?: string[];
//   populate?: string[];
// }

interface AuthApiProps {
  resource: string;
  params?: any;
}

interface GetOne {
  resource: string;
  id?: string | any;
  populate?: string[];
  scope?: string;
}
interface UpdateOne {
  resource?: string;
  id?: string;
  params?: any;
}

interface Delete {
  resource: string;
  id: string;
}

interface Create {
  resource: string;
  params: any;
  id?: string;
}

class Api {
  private AuthApiAxios: AxiosInstance;

  constructor() {
    this.AuthApiAxios = Axios.create();

    this.AuthApiAxios.interceptors.request.use(
      (config: any) => {
        if (!config.url) {
          return config;
        }
        const token = cookies.get('token');
        const profileId = cookies.get('profileId');
        if (token) {
          config.headers!.Authorization = 'Bearer ' + token;

          if (!isNaN(profileId)) config.headers!['X-Profile'] = profileId;
        }

        return config;
      },
      (error: any) => {
        Promise.reject(error);
      },
    );
  }

  errorWrapper = async (endpoint: () => Promise<AxiosResponse<any, any>>) => {
    const { data } = await endpoint();
    return data;
  };

  getAll = async ({
    resource,
    page,
    populate,
    sort,
    filter,
    pageSize,
    search,
    municipalityId,
    query,
    searchFields,
    scope,
    geom,
    fields,
    id,
  }: GetAll) => {
    const config = {
      params: {
        pageSize: pageSize || 10,
        page: page || 1,
        ...(!!populate && { populate }),
        ...(!!searchFields && { searchFields }),
        ...(!!search && { search }),
        ...(!!municipalityId && { municipalityId }),
        ...(!!geom && { geom }),
        ...(!!filter && { filter }),
        ...(!!sort && { sort }),
        ...(!!geom && { geom }),
        ...(!!query && { query }),
        ...(!!scope && { scope }),
        ...(!!fields && { fields }),
      },
    };

    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/api/${resource}${id ? `/${id}` : ''}/all`, config),
    );
  };

  get = async ({
    resource,
    page,
    populate,
    sort,
    filter,
    pageSize,
    search,
    municipalityId,
    query,
    searchFields,
    scope,
    geom,
    fields,
    id,
    responseType,
  }: GetAll) => {
    const config = {
      params: {
        pageSize: pageSize || 10,
        page: page || 1,
        ...(!!populate && { populate }),
        ...(!!searchFields && { searchFields }),
        ...(!!search && { search }),
        ...(!!municipalityId && { municipalityId }),
        ...(!!geom && { geom }),
        ...(!!filter && { filter }),
        ...(!!sort && { sort }),
        ...(!!geom && { geom }),
        ...(!!query && { query }),
        ...(!!scope && { scope }),
        ...(!!fields && { fields }),
      },
      ...(!!responseType && { responseType }),
    };

    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/api/${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  getOne = async ({ resource, id, populate, scope }: GetOne) => {
    const config = {
      params: {
        ...(!!populate && { populate }),
        ...(!!scope && { scope }),
      },
    };

    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/api/${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  patch = async ({ resource, id, params }: UpdateOne) => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.patch(`/api/${resource}${id ? `/${id}` : ''}`, params),
    );
  };

  delete = async ({ resource, id }: Delete) => {
    return this.errorWrapper(() => this.AuthApiAxios.delete(`/api/${resource}/${id}`));
  };
  post = async ({ resource, id, params }: Create) => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.post(`/api/${resource}${id ? `/${id}` : ''}`, params),
    );
  };

  checkAuth = async (): Promise<User> => {
    return this.errorWrapper(() => this.AuthApiAxios.get('/api/auth/me'));
  };

  logout = async () => {
    return this.errorWrapper(() => this.AuthApiAxios.post('/api/auth/users/logout'));
  };

  authApi = async ({ resource, params }: AuthApiProps) => {
    return this.errorWrapper(() => this.AuthApiAxios.post(`/api/${resource}`, params || {}));
  };

  refreshToken = async () => {
    return this.authApi({
      resource: 'auth/refreshToken',
      params: { token: cookies.get('refreshToken') },
    });
  };

  login = async (params: any) => {
    return this.authApi({
      resource: 'auth/login',
      params,
    });
  };

  eGatesSign = async () => {
    return this.authApi({
      resource: 'auth/evartai/sign',
    });
  };

  eGatesLogin = async (params: any) => {
    return this.authApi({
      resource: 'auth/evartai/login',
      params,
    });
  };

  getCurrentFishing = async () => {
    return this.get({
      resource: 'fishings/current',
    });
  };
  getFishing = async (id: number | string) => {
    return this.get({
      resource: 'fishings',
      id: id.toString(),
    });
  };

  startFishing = async (params: { type: LocationType; coordinates: { x: number; y: number } }) => {
    return this.post({
      resource: 'fishings',
      params,
    });
  };
  skipFishing = async (params: { type: LocationType }) => {
    return this.post({
      resource: 'fishings/ship',
      params,
    });
  };
  finishFishing = async (id: number | string) => {
    return this.patch({
      resource: `fishings/${id}/finish`,
    });
  };
  toolTypes = async (params: any) => {
    return this.getAll({
      resource: 'toolTypes',
      ...params,
    });
  };
  tools = async (params: any) => {
    return this.getAll({
      resource: 'tools',
      ...params,
    });
  };

  newTool = async (params: any) => {
    return this.post({
      resource: 'tools',
      params,
    });
  };

  getLocation = async (params: any) => {
    return this.get({
      resource: 'locations',
      ...params,
    });
  };
  getAvailableTools = async () => {
    return this.get({
      resource: 'tools/available',
    });
  };

  buildTools = async (params: {
    tools: number[];
    coordinates: { x: number; y: number };
    location: number;
    locationName: string;
  }) => {
    return this.post({
      resource: 'toolGroups',
      params,
    });
  };

  returnTools = async (id: number) => {
    return this.patch({
      resource: 'toolGroups/return',
      id: id.toString(),
      params: null,
    });
  };

  getBuiltTools = async (params: { locationId: number }) => {
    console.log('params', params);
    return this.get({
      resource: 'toolGroups/current',
      query: JSON.stringify(params),
      // populate: ['tools'],
    });
  };

  updateProfile = async (params: any): Promise<User> =>
    await this.patch({
      resource: Resources.ME,
      params,
    });
}

export default new Api();
