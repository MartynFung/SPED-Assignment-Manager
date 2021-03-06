import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  makeStyles,
  Container,
  TextField,
  Avatar,
  Typography,
  Button,
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/auth/auth.actions';
import AuthActionTypes from '../../redux/auth/auth.types';
import Alert from '@material-ui/lab/Alert';
import { clearErrors } from '../../redux/error/error.actions';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    margin: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

const RegisterForm = (props) => {
  const classes = useStyles();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.error);

  useEffect(() => {
    if (error.id === AuthActionTypes.REGISTER_FAIL) {
      setMessage(error.msg.msg);
    } else {
      setMessage(null);
    }
  }, [error]);

  function handleSubmit(event) {
    event.preventDefault();

    dispatch(clearErrors());

    const newUser = { first_name, last_name, email, password };

    // Attempt to register
    dispatch(register(newUser));
  }

  return (
    <Container className={classes.paper} maxWidth='xs'>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component='h1' variant='h4'>
        Register
      </Typography>

      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          id='first_name'
          label='First Name'
          variant='outlined'
          margin='normal'
          required
          name='first_name'
          autoComplete='given-name'
          autoFocus
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          id='last_name'
          label='Last Name'
          variant='outlined'
          margin='normal'
          required
          name='last_name'
          autoComplete='family-name'
          autoFocus
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          id='email'
          label='Email'
          variant='outlined'
          margin='normal'
          required
          name='email'
          autoComplete='email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id='pass'
          label='Password'
          variant='outlined'
          margin='normal'
          type='password'
          required
          autoComplete='current-password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <Button
          className={classes.submitButton}
          type='submit'
          variant='contained'
          color='primary'
        >
          Register
        </Button>
      </form>

      {message ? <Alert severity='error'>{message}</Alert> : null}
    </Container>
  );
};

export default RegisterForm;
