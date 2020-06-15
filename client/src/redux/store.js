import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';

import thunk from 'redux-thunk';

import rootReducer from './root-reducer';

// logger must be the last middleware in chain, otherwise it will log thunk and promise, not actual actions
const middlewares = [thunk, logger];

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;
