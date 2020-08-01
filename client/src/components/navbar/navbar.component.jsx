import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import { clearErrors } from '../../redux/error/error.actions';

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/auth/auth.actions';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  buttonStyles: {
    color: 'white',
    margin: '0px 10px',
  },
  logoutStyles: {
    margin: '0px 10px',
  },
}));

const AuthLinks = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector((state) => state.auth.user);

  return (
    <Fragment>
      <Button
        component={Link}
        to='/teachers'
        variant='text'
        color='primary'
        className={classes.buttonStyles}
      >
        Teachers
      </Button>
      <Button
        component={Link}
        to='/students'
        variant='text'
        color='primary'
        className={classes.buttonStyles}
      >
        Students
      </Button>
      <Button
        variant='contained'
        color='secondary'
        onClick={() => dispatch(logout())}
        type='button'
        className={classes.logoutStyles}
      >
        Logout
      </Button>
      <Typography>
        {user.first_name ? `${user.first_name} ${user.last_name}` : null}
      </Typography>
    </Fragment>
  );
};

const GuestLinks = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const clearError = () => {
    dispatch(clearErrors());
  };
  return (
    <Fragment>
      <Button
        component={Link}
        to='/login'
        variant='text'
        color='primary'
        onClick={clearError}
        className={classes.buttonStyles}
      >
        Login
      </Button>
      <Button
        component={Link}
        to='/register'
        variant='text'
        color='primary'
        onClick={clearError}
        className={classes.buttonStyles}
      >
        Register
      </Button>
    </Fragment>
  );
};

const Navbar = () => {
  const classes = useStyles();
  const user = useSelector((state) => state.auth.user);

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' className={classes.title}>
          Assignment Tracker
        </Typography>
        <div className={classes.grow} />
        {user ? <AuthLinks /> : <GuestLinks />}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
