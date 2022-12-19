import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import organizationReducer from './features/auth/organizationSlice';
// import counterReducer from './counterSlice';
import userReducer from './features/auth/userSlice';
import bookReducer from './features/authoringTool/Book/BookSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  book: bookReducer,
  organization: organizationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const getMiddlewareArray = (middlewares) => {
  let middleWareArray = middlewares({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  });
  process.env.NODE_ENV === 'development' && middleWareArray.push(logger);
  return middleWareArray;
};

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getMiddlewareArray(getDefaultMiddleware),
});

export const persistor = persistStore(store);
export default store;
