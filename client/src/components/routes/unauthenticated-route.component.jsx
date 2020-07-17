import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const queryString = (name, url = window.location.href) => {
  name = name.replace(/[[]]/g, '\\$&');

  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i');
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const UnauthenticatedRoute = ({ component: C, ...rest }) => {
  const redirect = queryString('redirect');
  const auth = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={(props) =>
        !auth.isAuthenticated ? (
          <C {...props} />
        ) : (
          <Redirect
            to={redirect === '' || redirect === null ? '/teachers' : redirect}
          />
        )
      }
    />
  );
};

export default UnauthenticatedRoute;
