import errorActionTypes from './error.types';

// Return errors
export const returnErrors = (msg, status, id = null) => {
  return {
    type: errorActionTypes.GET_ERRORS,
    payload: { msg, status, id },
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: errorActionTypes.CLEAR_ERRORS,
  };
};
