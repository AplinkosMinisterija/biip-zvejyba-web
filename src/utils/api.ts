import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
import { LocationType, Populations, Resources } from './constants';
import { TenantUser, User } from './types';

const cookies = new Cookies();

interface GetAll {
  resource?: string;
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
  private fishingAxios: AxiosInstance;
  private uetkAxios: AxiosInstance;
  private readonly fishingProxy: string = '/fishing/api';
  private readonly uetkProxy: string = '/uetk/api';

  constructor() {
    this.fishingAxios = Axios.create();
    this.uetkAxios = Axios.create();

    this.uetkAxios.interceptors.request.use(
      (config: any) => {
        config.url = this.uetkProxy + config.url;
        return config;
      },
      (error: any) => {
        Promise.reject(error);
      },
    );

    this.fishingAxios.interceptors.request.use(
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
        config.url = this.fishingProxy + config.url;

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

  getCommonConfigs = ({
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
    responseType,
  }: GetAll) => {
    return {
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
        ...(!!responseType && { responseType }),
      },
    };
  };

  getAll = async ({ resource, id, ...rest }: GetAll) => {
    const config = this.getCommonConfigs(rest);
    return this.errorWrapper(() =>
      this.fishingAxios.get(`${resource}${id ? `/${id}` : ''}/all`, config),
    );
  };

  get = async ({ resource, id, ...rest }: GetAll) => {
    const config = this.getCommonConfigs(rest);
    return this.errorWrapper(() =>
      this.fishingAxios.get(`${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  getUetk = async ({ resource, id, ...rest }: GetAll) => {
    const config = this.getCommonConfigs(rest);
    return this.errorWrapper(() => this.uetkAxios.get(`${resource}${id ? `/${id}` : ''}`, config));
  };

  getOne = async ({ resource, id, populate, scope }: GetOne) => {
    const config = {
      params: {
        ...(!!populate && { populate }),
        ...(!!scope && { scope }),
      },
    };

    return this.errorWrapper(() =>
      this.fishingAxios.get(`${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  patch = async ({ resource, id, params }: UpdateOne) => {
    return this.errorWrapper(() =>
      this.fishingAxios.patch(`${resource}${id ? `/${id}` : ''}`, params),
    );
  };

  delete = async ({ resource, id }: Delete) => {
    return this.errorWrapper(() => this.fishingAxios.delete(`/api/${resource}/${id}`));
  };
  post = async ({ resource, id, params }: Create) => {
    return this.errorWrapper(() =>
      this.fishingAxios.post(`${resource}${id ? `/${id}` : ''}`, params),
    );
  };

  userInfo = async (): Promise<User> => {
    return this.errorWrapper(() => this.fishingAxios.get('auth/me'));
  };

  logout = async () => {
    return this.errorWrapper(() => this.fishingAxios.post('auth/users/logout'));
  };

  authApi = async ({ resource, params }: AuthApiProps) => {
    return this.errorWrapper(() => this.fishingAxios.post(`${resource}`, params || {}));
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

  getUsers = async ({ page }: any): Promise<GetAllResponse<TenantUser>> =>
    await this.get({
      resource: Resources.TENANT_USERS,
      populate: [Populations.USER],
      page,
    });

  getUser = async (id: string): Promise<TenantUser> =>
    await this.getOne({
      resource: Resources.TENANT_USERS,
      populate: [Populations.USER],
      id,
    });

  createUser = async (params: any): Promise<User[]> =>
    await this.post({
      resource: Resources.USER_INVITE,
      params,
    });

  updateTenantUser = async (params: any, id?: string): Promise<User> => {
    return await this.patch({
      resource: Resources.USERS,
      params,
      id,
    });
  };

  deleteUser = async (id: string) =>
    await this.delete({
      resource: Resources.TENANT_USERS,
      id,
    });

  getLocations = async ({ search, page, query }: any): Promise<any> =>
    await this.getAll({
      resource: Resources.SEARCH,
      query,
      search,
      page,
    });
}

export default new Api();
