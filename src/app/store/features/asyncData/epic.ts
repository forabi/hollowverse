import { setResolvedData } from './actions';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';

import {
  promiseToAsyncResult,
  pendingResult,
  isSuccessResult,
} from 'helpers/asyncResults';
import { isActionOfType } from 'store/helpers';
import { getResolvedDataForKey } from 'store/features/asyncData/selectors';

export const dataResolverEpic: Epic<Action, StoreState> = (action$, store) => {
  return action$.ofType('REQUEST_DATA').mergeMap(action => {
    const {
      key,
      forPage,
      load,
      requestId,
      allowOptimisticUpdates,
    } = (action as Action<'REQUEST_DATA'>).payload;

    const previousResult = getResolvedDataForKey(store.getState())(key);

    return Observable.of(
      setResolvedData({
        key,
        forPage,
        data:
          allowOptimisticUpdates && isSuccessResult<any>(previousResult)
            ? {
                ...(previousResult as any),
                isInProgress: true,
                requestId,
              }
            : {
                ...pendingResult,
                requestId,
              },
      }),
    )
      .merge(
        Observable.fromPromise(promiseToAsyncResult(load())).map(data =>
          setResolvedData({ key, forPage, data: { ...data, requestId } }),
        ),
      )
      .takeUntil(
        action$.filter(
          newAction =>
            isActionOfType(newAction, 'REQUEST_DATA') &&
            newAction.payload.key === key,
        ),
      );
  });
};
