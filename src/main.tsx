import * as Sentry from '@sentry/react';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import {
  BrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import App from './App';
import redux from './state/store';
import { GlobalStyle, theme } from './utils/theme';
import ErrorBoundary from './components/other/ErrorBoundary';
import { LocationContext } from './components/providers/LocationContext';
import { PopupProvider } from './components/providers/PopupProvider';

const queryClient = new QueryClient();

const { store, persistor } = redux;

const env = import.meta.env;

if (env.VITE_SENTRY_DSN) {
  Sentry.init({
    environment: env.VITE_ENVIRONMENT,
    dsn: env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
        ),
      }),
    ],
    tracesSampleRate: 1,
    release: env.VITE_VERSION,
    tracePropagationTargets: [env.VITE_MAPS_HOST!],
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <BrowserRouter>
              <ErrorBoundary>
                <PopupProvider>
                  <LocationContext>
                    <App />
                  </LocationContext>
                </PopupProvider>
              </ErrorBoundary>
            </BrowserRouter>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);
