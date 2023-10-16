import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {ThemeProvider} from "styled-components";
import {QueryClient, QueryClientProvider} from "react-query";
import {GlobalStyle, theme} from "./utils/theme.ts";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import redux from './state/store';

const queryClient = new QueryClient();

const { store, persistor } = redux;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
          <Provider store={store}>
              <PersistGate persistor={persistor}>
                  <ThemeProvider theme={theme}>
                      <GlobalStyle />
                      <BrowserRouter>
                          <App />
                      </BrowserRouter>
                  </ThemeProvider>
              </PersistGate>
          </Provider>
      </QueryClientProvider>
  </React.StrictMode>,
)
