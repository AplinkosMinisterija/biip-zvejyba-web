import {useDispatch, useSelector} from "react-redux";
import {useMutation} from "react-query";
import api from "./api.ts";
import {RolesTypes, ServerErrors} from "./constants.ts";
import {clearCookies, handleAlert, handleGetCurrentUser, handleSetProfile} from "./functions.ts";
import {actions, initialState, UserReducerProps} from "../state/user/reducer.ts";
import {RootState} from "../state/store.ts";
import Cookies from "universal-cookie";
import {routes} from "./routes.tsx";

const cookies = new Cookies();

export const useCheckAuthMutation = () => {
    const dispatch = useDispatch();
    const { mutateAsync, isLoading } = useMutation(handleGetCurrentUser, {
        onError: ({ response }: any) => {
            if (response.status === ServerErrors.NO_PERMISSION) {
                clearCookies();
                dispatch(actions.setUser(initialState));

                return;
            }
            handleAlert();
        },
        onSuccess: (data: UserReducerProps) => {
            if (data) {
                handleSetProfile(data?.userData?.profiles);
                dispatch(actions.setUser(data));
            }
        },
        retry: false,
    });
    return { isLoading, mutateAsync };
};

export const useEGatesSign = () => {
    const { mutateAsync, isLoading } = useMutation(api.eGatesSign, {
        onError: () => {
            handleAlert();
        },
        onSuccess: ({ url }) => {
            window.location.replace(url);
        },
        retry: false,
    });
    return { isLoading, mutateAsync };
};

export const useGetCurrentProfile = () => {
    const profiles = useSelector((state: RootState) => state.user.userData.profiles);
    const profileId = cookies.get('profileId');
    const currentProfile = profiles?.find((profile) => profile.id == profileId);
    return currentProfile;
};
export const useFilteredRoutes = () => {
    const profile = useGetCurrentProfile();
    return routes.filter((route: any) => {
        if (!route?.slug) return false;

        if (route.tenantOwner) {
            return [RolesTypes.USER_ADMIN, RolesTypes.OWNER].some(
                (r) => r === profile?.role,
            );
        }
        return true;
    });
};