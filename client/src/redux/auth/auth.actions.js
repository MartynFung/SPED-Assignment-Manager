import axios from 'axios';
import authActionTypes from './auth.types';
import { returnErrors } from '../error/error.actions';

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
  // User started loading
  dispatch({ type: authActionTypes.USER_LOADING });

  axios
    .get('/api/auth/user', tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: authActionTypes.USER_LOADED,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({ type: authActionTypes.AUTH_ERROR });
    });
};

export const register = ({ first_name, last_name, email, password }) => (
  dispatch
) => {
  //Headers
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  // Request body
  const body = { first_name, last_name, email, password };
  axios
    .post('/api/auth/register', body, config)
    .then((res) =>
      dispatch({
        type: authActionTypes.REGISTER_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          authActionTypes.REGISTER_FAIL
        )
      );
      dispatch({ type: authActionTypes.REGISTER_FAIL });
    });
};

// Login user
export const login = ({ email, password }) => (dispatch) => {
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  const body = { email, password };
  axios
    .post('/api/auth/login', body, config)
    .then((res) => {
      dispatch({ type: authActionTypes.LOGIN_SUCCESS, payload: res.data });
    })
    .catch((err) => {
      dispatch(
        returnErrors(
          err.response.data,
          err.response.status,
          authActionTypes.LOGIN_FAIL
        )
      );
      dispatch({ type: authActionTypes.LOGIN_FAIL });
    });
};

// Logout user
export const logout = (dispatch) => {
  return { type: authActionTypes.LOGOUT_SUCCESS };
};

// Setup config/headers and token used for every authenticated request
export const tokenConfig = (getState) => {
  // Get token from localstorage
  const accessToken = getState().auth.accessToken;

  // Headers
  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  // If token, add it to headers
  if (accessToken) {
    config.headers['authorization'] = `Bearer ${accessToken}`;
  }

  return config;
};
