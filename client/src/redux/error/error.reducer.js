import ErrorActionTypes from './error.types';

const INITIAL_STATE = {
  msg: {},
  status: null,
  id: null,
};

const errorReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ErrorActionTypes.GET_ERRORS:
      return {
        msg: action.payload.msg,
        status: action.payload.status,
        id: action.payload.id,
      };
    case ErrorActionTypes.CLEAR_ERRORS:
      return {
        msg: {},
        status: null,
        id: null,
      };
    default:
      return state;
  }
};

export default errorReducer;
