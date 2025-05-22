// src/redux/rootSaga.ts
import { all } from 'redux-saga/effects';
import { watchUsers } from './usersSaga';

export default function* rootSaga() {
  yield all([watchUsers()]);
}
