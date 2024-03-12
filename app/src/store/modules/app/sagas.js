import {takeLatest, all, call, put, select} from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {navigate} from '../../../routes/rootNavigation';
import types from './types';
import {updateUser, updateRide} from './actions';
import api from '../../../services/api';

export function* checkUser() {
  try {
    const {user} = yield select((state) => state.app);
    const response = yield call(api.post, '/check-user', {email: user.email});
    const res = response.data;

    if (res.error) {
      alert(res.message);
      return false;
    }

    if (res.user) {
      yield put(updateUser(res.user));
      yield call(AsyncStorage.setItem, '@user', JSON.stringify(res.user));
      navigate('Home');
    } else {
      navigate('Type');
    }
  } catch (err) {
    alert(err.message);
  }
}

export function* createUser() {
  try {
    const {user, paymentMethod, car} = yield select((state) => state.app);
    const response = yield call(api.post, 'signup', {user, paymentMethod, car});
    const res = response.data;

    if (res.error) {
      alert(res.message);
      return false;
    }

    // SET ASYNC STORAGE
    // GO TO HOME
    yield put(updateUser(res.user));
    yield call(AsyncStorage.setItem, '@user', JSON.stringify(res.user));
    navigate('Home');
  } catch (err) {
    alert(err.message);
  }
}

export function* getRideInfos(payload) {
  try {
    const {origin, destination} = payload;
    const response = yield call(api.post, '/pre-ride', {origin, destination});
    const res = response.data;

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateRide({info: res.route}));
    navigate('Home');
  } catch (err) {
    alert(err.message);
  }
}

export function* requestRide() {
  try {
    const {user, ride} = yield select((state) => state.app);
    const response = yield call(api.post, '/call-ride', {
      info: ride.info,
      userId: user._id,
    });
    const res = response.data;

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateRide(res.ride));
  } catch (err) {
    alert(err.message);
  }
}

export function* rideAccept() {
  try {
    const {user, ride} = yield select((state) => state.app);
    const response = yield call(api.post, '/accept-ride', {
      ...ride,
      driverId: user._id,
    });
    const res = response.data;

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateRide(res.ride));
  } catch (err) {
    alert(err.message || err);
  }
}

export default all([
  takeLatest(types.CREATE_USER, createUser),
  takeLatest(types.CHECK_USER, checkUser),
  takeLatest(types.GET_RIDE_INFOS, getRideInfos),
  takeLatest(types.REQUEST_RIDE, requestRide),
  takeLatest(types.ACCEPT_RIDE, rideAccept),
]);
