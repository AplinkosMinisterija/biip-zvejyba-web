import { RolesTypes } from './constants.ts';

export type ProfileId = 'personal' | string;
export interface Profile {
    id: ProfileId;
    name: string;
    code?: string;
    email?: string;
    role: RolesTypes;
    phone: string;
}
export interface User {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: RolesTypes;
    active?: boolean;
    phone?: string;
    mobilePhone?: string;
    password?: string;
    personalCode?: string;
    duties?: string;
    accessDate?: Date;
    getData?: boolean;
    error?: string;
    profiles?: Profile[];
}

export interface UpdateTokenProps {
    token?: string;
    error?: string;
    message?: string;
    refreshToken?: string;
}

export interface ResponseProps {
    endpoint: () => Promise<any>;
    onSuccess: (data: any) => void;
    onError?: (data: any) => void;
    onOffline?: () => void;
}

export type FileProps = {
    url: string;
    name: string;
    size: number;
    main?: boolean;
};
