import { routerReducer, RouterState } from 'react-router-redux';
import { combineReducers, Reducer as GenericReducer } from 'redux';
import { StoreState, ReducerMap } from './types';
import {
  statusCodeReducer,
  redirectionUrlReducer,
} from 'store/features/status/reducer';
import { isSearchFocusedReducer } from 'store/features/search/reducer';
import { resolvedDataReducer } from 'store/features/asyncData/reducer';

const appReducers: ReducerMap = {
  statusCode: statusCodeReducer,
  shouldFocusSearch: isSearchFocusedReducer,
  resolvedData: resolvedDataReducer,
  redirectionUrl: redirectionUrlReducer,
};

/**
 * This is the root reducer of the app.
 * It includes Hollowverse `appReducer` as well as other reducers
 * that may be required by external modules.
 */
export const reducer = combineReducers<StoreState>({
  ...appReducers,
  routing: routerReducer as GenericReducer<RouterState>,
});
