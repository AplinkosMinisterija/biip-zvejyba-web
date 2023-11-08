import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
import { LocationType, Populations, Resources } from './constants';
import { TenantUser, Tool, ToolFormProps, User } from './types';

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
  params?: any;
  id?: string;
}

class Api {
  private fishingAxios: AxiosInstance;
  private uetkAxios: AxiosInstance;
  private readonly fishingProxy: string = '/api';
  private readonly riversLakesSearchUrl: string = 'https://uetk.biip.lt/api/objects/search';
  private readonly barSearchUrl: string =
    'https://dev.gis.biip.lt/api/zuvinimas_barai/collections/fishing_sections/items.json?limit=1000';

  constructor() {
    this.fishingAxios = Axios.create();
    this.uetkAxios = Axios.create();

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
      this.fishingAxios.get(`/${resource}${id ? `/${id}` : ''}/all`, config),
    );
  };

  get = async ({ resource, id, ...rest }: GetAll) => {
    const config = this.getCommonConfigs(rest);
    return this.errorWrapper(() =>
      this.fishingAxios.get(`/${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  getPublic = async ({ resource, id, ...rest }: GetAll) => {
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
      this.fishingAxios.get(`/${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  patch = async ({ resource, id, params }: UpdateOne) => {
    return this.errorWrapper(() =>
      this.fishingAxios.patch(`/${resource}${id ? `/${id}` : ''}`, params),
    );
  };

  delete = async ({ resource, id }: Delete) => {
    return this.errorWrapper(() => this.fishingAxios.delete(`/api/${resource}/${id}`));
  };
  post = async ({ resource, id, params }: Create) => {
    return this.errorWrapper(() =>
      this.fishingAxios.post(`/${resource}${id ? `/${id}` : ''}`, params),
    );
  };

  userInfo = async (): Promise<User> => {
    return this.errorWrapper(() => this.fishingAxios.get('/auth/me'));
  };

  logout = async () => {
    return this.errorWrapper(() => this.fishingAxios.post('/auth/users/logout'));
  };

  authApi = async ({ resource, params }: AuthApiProps) => {
    return this.errorWrapper(() => this.fishingAxios.post(`/${resource}`, params || {}));
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
      resource: 'fishings/start',
      params,
    });
  };
  skipFishing = async (params: { type: LocationType }) => {
    return this.post({
      resource: 'fishings/skip',
      params,
    });
  };
  finishFishing = async (id: number | string) => {
    return this.patch({
      resource: `fishings/${id}/finish`,
    });
  };
  toolTypes = async (params: any) => {
    return this.get({
      resource: 'toolTypes',
      ...params,
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
    location: Location;
  }) => {
    return this.post({
      resource: 'toolsGroups/build',
      params,
    });
  };

  removeTool = async (
    params: {
      coordinates: { x: number; y: number };
      location: Location;
    },
    id: string,
  ) => {
    return this.post({
      resource: 'toolsGroups/remove',
      params,
      id,
    });
  };

  getBuiltTools = async ({ locationId }: { locationId: number }) => {
    return this.get({
      resource: `toolsGroups/location/${locationId}`,
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

  tools = async (params: any): Promise<Tool[]> => {
    return this.getAll({
      resource: Resources.TOOLS,
      ...params,
    });
  };

  getTool = async (id: string): Promise<Tool> =>
    await this.getOne({
      resource: Resources.TOOLS,
      id,
    });

  newTool = async (params: ToolFormProps): Promise<Tool> => {
    return this.post({
      resource: Resources.TOOLS,
      params,
    });
  };

  updateTool = async (params: ToolFormProps, id: string): Promise<Tool> => {
    return this.patch({
      resource: Resources.TOOLS,
      params,
      id,
    });
  };

  deleteTool = async (id: string) =>
    await this.delete({
      resource: Resources.TOOLS,
      id,
    });

  getLocations = async ({ search, page, query }: any): Promise<any> =>
    await this.getPublic({
      resource: this.riversLakesSearchUrl,
      query,
      search,
      page,
    });

  getBars = async (): Promise<any> =>
    await this.getPublic({
      resource: this.barSearchUrl,
    });

  getFishTypes = async (): Promise<{ label: string; photo: any }[]> =>
    await this.getAll({
      resource: Resources.FISH_TYPES,
    });
}

export default new Api();
