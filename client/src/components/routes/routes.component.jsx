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
      <UnauthenticatedRoute path='/' exact component={LoginForm} />
      <UnauthenticatedRoute path='/login' exact component={LoginForm} />
      <UnauthenticatedRoute path='/register' exact component={RegisterForm} />
      <AuthenticatedRoute path='/students' exact component={StudentPage} />
      <AuthenticatedRoute path='/teachers' exact component={TeacherPage} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
