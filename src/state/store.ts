import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FiltersReducer } from './filters/reducer';
import { UserReducer } from './user/reducer';
import { FishingReducer } from './fishing/reducer.ts';

const persistConfig = {
  key: 'animalsConfig',
  storage,
  whitelist: ['filters', 'user', 'fishing'],
};

const reducers = combineReducers({
  user: UserReducer.reducer,
  filters: FiltersReducer.reducer,
  fishing: FishingReducer.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({ serializableCheck: false })],
});

const persistor = persistStore(store);

export default { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
