//
// REDUX SAGAS
//
// This file just contains Redux Sagas generators. For more information on Redux Sagas, see:
// https://github.com/redux-saga/redux-saga
//
import { put, takeEvery, call } from 'redux-saga/effects';
import { algoliaSearchIndex } from 'vendor/algolia';
import * as facebook from 'vendor/facebook';
import * as firebase from 'vendor/firebase';
import { actions, IAction, IForm } from './actions';

// These are the Redux actions that trigger the saga generators
function* sagas() {
  yield takeEvery('requestSearchResults', requestSearchResults);
  yield takeEvery('requestLogin', requestLogin);
  yield takeEvery('requestLogout', requestLogout);
  yield takeEvery('requestUpdateLoginStatus', requestUpdateLoginStatus);
  yield takeEvery('requestNotablePerson', requestNotablePerson);
  yield takeEvery('requestUserData', requestUserData);
  yield takeEvery('requestSubmitFormValues', requestSubmitFormValues);
}

function* requestSearchResults(action: IAction<string>) {
  try {
    yield put(actions.setIsSearchPending(true));

    const searchResults = yield algoliaSearchIndex.search(action.payload);

    yield put(actions.setSearchResults(searchResults));
  } catch (error) {
    yield put(actions.setSearchError(error));
  } finally {
    yield put(actions.setIsSearchPending(false));
  }
}

function* requestSubmitFormValues(action: IForm<object>) {
  try {
    yield put(actions.setIsSubmitPending(true));
    const response = yield fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(action.payload),
    });
    if (response.ok) {
      yield put(actions.setSubmitSuccess(true));
    } else {
      yield put(actions.setSubmitFail(true));
    }
  } catch (error) {
    throw error;
  } finally {
    yield put(actions.setIsSubmitPending(false));
  }
}

function* requestLogin() {
  try {
    yield put(actions.setIsLoginPending(true));

    const facebookAuthResponse = yield facebook.login();

    yield firebase.loginOrRegister(facebookAuthResponse);

    yield put(actions.setLoginStatus('connected'));
  } catch (error) {
    yield put(actions.setError(error));
  } finally {
    yield put(actions.setIsLoginPending(false));
  }
}

function* requestLogout() {
  try {
    yield put(actions.setIsLogoutPending(true));

    yield [facebook.logout(), firebase.logout()];

    yield put(actions.setLoginStatus('unknown'));
  } catch (error) {
    yield put(actions.setError(error));
  } finally {
    yield put(actions.setIsLogoutPending(false));
  }
}

function* requestUpdateLoginStatus() {
  try {
    yield call(facebook.initSdk);

    const facebookAuthResponse = yield facebook.getLoginStatus();

    if (facebookAuthResponse.status === 'connected') {
      yield put(actions.setIsLoginPending(true));
      yield firebase.loginOrRegister(facebookAuthResponse);
      yield put(actions.setLoginStatus('connected'));
    }
  } catch (error) {
    yield put(actions.setError(error));
  } finally {
    yield put(actions.setIsLoginPending(false));
  }
}

function* requestNotablePerson(action: IAction<string>) {
  try {
    const firebaseResponse = yield firebase.getData(action.payload);
    yield put(actions.setNotablePerson(firebaseResponse));
  } catch (error) {
    throw error;
  }
}

function* requestUserData(action: IAction<string>) {
  try {
    const firebaseResponse = yield firebase.getData(`/users/${action.payload}`);
    yield put(actions.setUserData(firebaseResponse));
  } catch (error) {
    throw error;
  }
}

export { sagas };
