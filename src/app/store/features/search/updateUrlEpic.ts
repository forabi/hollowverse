import { push, replace } from 'react-router-redux';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import 'rxjs/add/operator/map';
import { getRoutingState } from 'store/features/url/selectors';
import { isActionOfType } from 'store/helpers';
import { LocationDescriptor } from 'history';

/**
 * Listens for actions requesting search results and
 * updates the URL address on the search page to
 * reflect the search query.
 * @example `{ type: 'SEARCH_QUERY_CHANGED', query: 'Tom Ha' }` => '/search?query=Tom+Ha'
 */
export const updateUrlEpic: Epic<Action, StoreState> = (action$, store) => {
  return action$.ofType('SEARCH_QUERY_CHANGED', 'GO_TO_SEARCH').map(action => {
    const descriptor: LocationDescriptor = {
      pathname: '/search',
    };

    if (isActionOfType(action, 'SEARCH_QUERY_CHANGED')) {
      const { query } = action.payload;
      const searchParams = new URLSearchParams();
      searchParams.append('query', query);
      descriptor.search = searchParams.toString();
    }

    const state = store.getState();
    const location = getRoutingState(state).location;

    return location && location.pathname === descriptor.pathname
      ? // This is to avoid things like
        // /search?query=t, /search?query=te, /search?query=tes, /search?query=test
        // filling the browser history stack instead of the actual
        // previous page
        replace(descriptor)
      : push(descriptor);
  });
};
