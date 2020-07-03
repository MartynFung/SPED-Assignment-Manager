import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';

import { Link } from 'react-router-dom';

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

const Navbar = ({ handleLogout, userCreds }) => {
  const classes = useStyles();

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' className={classes.title}>
          Assignment Tracker
        </Typography>
        <div className={classes.grow} />
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
          onClick={handleLogout}
          type='button'
          className={classes.logoutStyles}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
