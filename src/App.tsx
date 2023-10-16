import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import {
    Location,
    Navigate,
    Outlet,
    Route,
    Routes,
    useLocation,
    useNavigate,
    useSearchParams,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';
import LoaderComponent from './components/other/LoaderComponent';
import { CantLogin } from './pages/CantLogin';
import { Login } from './pages/Login';
import api from './utils/api';
import { ServerErrors } from './utils/constants';
import { handleUpdateTokens } from './utils/functions';
import {
    useCheckAuthMutation,
    useEGatesSign,
    useFilteredRoutes,
} from './utils/hooks';
import { slugs } from './utils/routes';
import { ProfileId } from './utils/types';
import {useSelector} from "react-redux";
import {RootState} from "./state/store.ts";
const cookies = new Cookies();
interface RouteProps {
    loggedIn: boolean;
    profileId?: ProfileId;
    location?: Location;
}

function App() {
    const loggedIn = useSelector((state: RootState) => state.user.loggedIn);
    const profiles = useSelector((state: RootState) => state.user.userData.profiles);
    const [searchParams] = useSearchParams();
    const { ticket, eGates } = Object.fromEntries([...Array.from(searchParams)]);
    const profileId: ProfileId = cookies.get('profileId');
    const [initialLoading, setInitialLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const routes = useFilteredRoutes();
    const navigateRef = useRef(navigate);

    const eGateSignsMutation =
        useEGatesSign();
    const checkAuthMutation = useCheckAuthMutation();

    const updateTokensMutation = useMutation(api.refreshToken, {
        onError: ({ response }: any) => {
            if (response.status === ServerErrors.NOT_FOUND) {
                cookies.remove('refreshToken', { path: '/' });
            }
        },
        onSuccess: async (data) => {
            handleUpdateTokens(data);
            await checkAuthMutation.mutateAsync();
        },
    });

    const shouldUpdateTokens = useCallback(async () => {
        if (!cookies.get('token') && cookies.get('refreshToken')) {
            await updateTokensMutation.mutateAsync();
        }
    }, [updateTokensMutation.mutateAsync]);

    const eGatesLoginMutation = useMutation(
        (ticket: string) => {
            return api.eGatesLogin({ ticket });
        },
        {
            onError: () => {
                navigate(slugs.cantLogin);
            },
            onSuccess: async (data) => {
                handleUpdateTokens(data);
                await checkAuthMutation.mutateAsync();
            },
            retry: false,
        },
    );

    useEffect(() => {
        (async () => {
            await shouldUpdateTokens();
            await checkAuthMutation.mutateAsync();
            setInitialLoading(false);
        })();
    }, [location.pathname]);

    useEffect(() => {
        (async () => {
            if (loggedIn) return;

            if (ticket) {
                eGatesLoginMutation.mutateAsync(ticket);
            }
            if (eGates !== undefined) {
                eGateSignsMutation.mutateAsync();
            }
        })();
    }, [
        ticket,
        eGates,
        loggedIn,
    ]);

    useEffect(() => {
        const isInvalidProfile =
            !profiles?.map((profile) => profile?.id?.toString()).includes(profileId) &&
            loggedIn;
        if (!isInvalidProfile) return;

        cookies.remove('profileId', { path: '/' });

        if (!navigateRef?.current) return;

        navigateRef?.current('');
    }, [profileId, loggedIn, profiles]);

    const isLoading =
        initialLoading ||
        [
            eGatesLoginMutation.isLoading,
            eGateSignsMutation.isLoading,
            updateTokensMutation.isLoading,
        ].some((loading) => loading);

    if (isLoading) {
        return <LoaderComponent />;
    }

    return (
        <>
            <Routes>
                <Route element={<PublicRoute profileId={profileId} loggedIn={loggedIn} />}>
                    <Route path={slugs.login} element={<Login />} />
                    <Route path={slugs.cantLogin} element={<CantLogin />} />
                </Route>
                <Route
                    element={
                        <ProtectedRoute
                            location={location}
                            profileId={profileId}
                            loggedIn={loggedIn}
                        />
                    }
                >
                    {(routes || []).map((route: any, index: number) => (
                        <Route
                            key={`route-${index}`}
                            path={route.slug}
                            element={route.component}
                        />
                    ))}
                </Route>
                <Route
                    path="*"
                    element={
                        <Navigate
                            to={
                                loggedIn?
                                    slugs.fishing
                                    : slugs.login
                            }
                        />
                    }
                />
            </Routes>
            <ToastContainer />
        </>
    );
}

const PublicRoute = ({ loggedIn }: RouteProps) => {
    if (loggedIn) {
        return (
            <Navigate to={slugs.fishing} replace />
        );
    }
    return <Outlet />;
};

const ProtectedRoute = ({ loggedIn, location }: RouteProps) => {
    if (!loggedIn) {
        return <Navigate to={slugs.login} replace />;
    }

    if (location?.pathname === slugs.fishing) {
        return <Navigate to={slugs.fishing} replace />;
    }

    return <Outlet />;
};

export default App;
