import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthenticatedRoute = ({ component: C, ...rest }) => {
  const auth = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={(props) =>
        auth.isAuthenticated ? (
          <C {...props} />
        ) : (
          <Redirect
            to={`/login?redirect=${props.location.pathname}${props.location.search}`}
          />
        )
      }
    />
  );
};

export default AuthenticatedRoute;
