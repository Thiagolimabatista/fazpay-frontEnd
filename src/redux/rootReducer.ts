/* eslint-disable import/no-extraneous-dependencies */

import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';

// slices
import productReducer from './slices/product';

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
  product: productReducer,
});

export default rootReducer;
