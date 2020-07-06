import React, { useState, useEffect } from 'react';

import {
  makeStyles,
  Container,
  TextField,
  Typography,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  form: {
    margin: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    width: '20%',
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

const TeacherForm = () => {
  const classes = useStyles();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [responseText, setResponse] = useState({
    apiResponse: 'Please enter a teacher',
  });
  const handleSubmit = () => {};

  return (
    <div className='teacher-form'>
      <div>teacher form</div>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          id='first_name'
          label='First name'
          variant='outlined'
          margin='normal'
          required
          type='text'
          name='first_name'
          autoComplete='off'
          autoFocus
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          id='last_name'
          label='Last Name'
          variant='outlined'
          margin='normal'
          required
          type='text'
          autoComplete='off'
          onChange={(e) => setLastName(e.target.value)}
        />
        <Button
          className={classes.submitButton}
          type='submit'
          variant='contained'
          color='primary'
        >
          Add
        </Button>
      </form>
      <Typography>{responseText.apiResponse}</Typography>
    </div>
  );
};

export default TeacherForm;
