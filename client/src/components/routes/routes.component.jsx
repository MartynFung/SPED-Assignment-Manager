import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginForm from '../login/login.component';
import NotFound from './not-found.component';
import UnauthenticatedRoute from './unauthenticated-route.component';
import AuthenticatedRoute from './authenticated-route.component';
import TeacherPage from '../teacher/teacherPage.component';
import StudentPage from '../student/studentPage.component';

const Routes = ({ childProps }) => {
  return (
    <Switch>
      <UnauthenticatedRoute
        path='/login'
        exact
        component={LoginForm}
        props={childProps}
      />
      <UnauthenticatedRoute
        path='/teachers'
        exact
        component={TeacherPage}
        props={childProps}
      />
      <UnauthenticatedRoute
        path='/students'
        exact
        component={StudentPage}
        props={childProps}
      />
      {/*<AuthenticatedRoute
        path='/dashboard'
        exact
        component={dashboard}
        props={childProps}
      />*/}
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;