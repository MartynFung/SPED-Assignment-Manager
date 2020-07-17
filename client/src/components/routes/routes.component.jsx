import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginForm from '../login/login.component';
import NotFound from './notFound.component';
import UnauthenticatedRoute from './unauthenticated-route.component';
import AuthenticatedRoute from './authenticatedRoute.component';
import TeacherPage from '../teacher/teacherPage.component';
import StudentPage from '../student/studentPage.component';
import RegisterForm from '../register/register.component';

const Routes = ({ childProps }) => {
  return (
    <Switch>
      <UnauthenticatedRoute
        path='/register'
        exact
        component={RegisterForm}
        props={childProps}
      />
      <UnauthenticatedRoute
        path='/login'
        exact
        component={LoginForm}
        props={childProps}
      />
      {/*<UnauthenticatedRoute
        path='/teachers'
        exact
        component={TeacherPage}
        props={childProps}
      />*/}
      <UnauthenticatedRoute
        path='/students'
        exact
        component={StudentPage}
        props={childProps}
      />
      <AuthenticatedRoute
        path='/teachers'
        exact
        component={TeacherPage}
        props={childProps}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
