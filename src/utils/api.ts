import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { isEmpty } from 'lodash';
import Cookies from 'universal-cookie';
import { EventTypes, LocationType } from './constants';
import {
  ToolsGroup,
  FishType,
  Research,
  TenantUser,
  Tool,
  ToolFormRequest,
  User,
  Location,
  Coordinates,
  Tenant,
  FishingHistoryResponse,
  Fishing,
} from './types';

enum Populations {
  USER = 'user',
}

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
  skipFishing = async (params: { type: LocationType; coordinates: { x: number; y: number } }) => {
    return this.post({
      resource: 'fishings/skip',
      params,
    });
  };
  finishFishing = async (params: { coordinates: { x: number; y: number } }) => {
    return this.post({
      resource: `fishings/end`,
      params,
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
      populate: ['toolType'],
    });
  };

  buildTools = async (params: {
    tools: number[];
    coordinates: Coordinates;
    location: Location;
  }) => {
    return this.post({
      resource: 'toolsGroups/build',
      params,
    });
  };

  weighTools = async (
    params: {
      data: { [key: number]: number };
      coordinates: Coordinates;
      location: Location;
    },
    id: string,
  ) => {
    return this.post({
      resource: 'toolsGroups/weigh',
      params,
      id,
    });
  };

  getFishingWeights = async () => {
    return this.get({
      resource: 'fishings/weights',
    });
  };

  createFishingFishWeights = async (params: { params: { [key: string]: number } }) => {
    return this.post({
      resource: 'fishings/weight',
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

  getBuiltTool = async (id: string): Promise<ToolsGroup> => {
    return this.getOne({
      resource: `toolsGroups`,
      populate: ['tools', 'weightEvent'],
      id,
    });
  };

  getBuiltTools = async ({ locationId }: { locationId: number }): Promise<any> => {
    return this.get({
      resource: `toolsGroups/location/${locationId}`,
    });
  };

  updateProfile = async (params: any): Promise<User> =>
    await this.patch({
      resource: 'users/me',
      params,
    });

  getUsers = async ({ page }: any): Promise<GetAllResponse<TenantUser>> =>
    await this.get({
      resource: 'tenantUsers',
      populate: [Populations.USER],
      page,
    });

  getUser = async (id: string): Promise<TenantUser> =>
    await this.getOne({
      resource: 'tenantUsers',
      populate: [Populations.USER],
      id,
    });

  createUser = async (params: any): Promise<User[]> =>
    await this.post({
      resource: 'tenantUsers/invite',
      params,
    });

  updateTenantUser = async (params: any, id?: string): Promise<User> => {
    return await this.patch({
      resource: 'users',
      params,
      id,
    });
  };

  deleteUser = async (id: string) =>
    await this.delete({
      resource: 'tenantUsers',
      id,
    });

  tools = async (params: any): Promise<Tool[]> => {
    return this.getAll({
      resource: 'tools',
      ...params,
    });
  };

  getTool = async (id: string): Promise<Tool> =>
    await this.getOne({
      resource: 'tools',
      id,
    });

  newTool = async (params: ToolFormRequest): Promise<Tool> => {
    return this.post({
      resource: 'tools',
      params,
    });
  };

  updateTool = async (params: ToolFormRequest, id: string): Promise<Tool> => {
    return this.patch({
      resource: 'tools',
      params,
      id,
    });
  };

  deleteTool = async (id: string) =>
    await this.delete({
      resource: 'tools',
      id,
    });

  getLocations = async ({ search, page, query }: any): Promise<Location> =>
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

  getFishTypes = async (): Promise<FishType[]> =>
    await this.getAll({
      resource: 'fishTypes',
    });

  getResearches = async (): Promise<GetAllResponse<Research>> =>
    await this.get({
      resource: `researches`,
      populate: ['user'],
    });

  createResearch = async (params: any): Promise<Research> =>
    await this.post({
      resource: `researches`,
      params,
    });

  updateResearch = async (params: any, id: string): Promise<Research> =>
    await this.patch({
      resource: `researches`,
      params,
      id,
    });

  getResearch = async (id: string): Promise<Research> =>
    await this.getOne({
      resource: `researches`,
      id,
      populate: ['fishes', 'geom'],
    });

  uploadFiles = async (files: File[] = []): Promise<any> => {
    if (isEmpty(files)) return [];

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    const data = await Promise.all(
      files?.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await this.fishingAxios.post(`/researches/upload`, formData, config);
        return data;
      }),
    );

    return data?.map((file) => {
      return {
        name: file.filename,
        size: file.size,
        url: file?.url,
      };
    });
  };

  getFishingJournal = async ({ page }: { page: number }): Promise<GetAllResponse<Fishing>> => {
    return await this.get({
      resource: 'fishings',
      populate: ['startEvent', 'endEvent', 'skipEvent', 'weightEvents'],
      page,
    });
  };

  getFishingHistory = async ({ id }: { id: number | string }): Promise<FishingHistoryResponse> =>
    this.get({
      resource: `fishings/history`,
      id: id.toString(),
    });
}

export default new Api();
