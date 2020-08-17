import axios from 'axios';
import TeacherActionTypes from './teacher.types';
import { tokenConfig } from '../auth/auth.actions';
import { returnErrors } from '../error/error.actions';

export const getTeachers = () => async (dispatch, getState) => {
  try {
    const data = await axios
      .get('/api/teachers', tokenConfig(getState))
      .then((res) => res.data);
    dispatch({
      type: TeacherActionTypes.GET_TEACHERS,
      payload: data,
    });
  } catch (err) {
    dispatch(returnErrors(err.message, err.response.data, err.response.status));
  }
};

export const createTeacher = (teacher) => async (dispatch, getState) => {
  try {
    const data = await axios
      .post('/api/teachers', teacher, tokenConfig(getState))
      .then((res) => res.data);
    alert('Teacher created: ' + JSON.stringify(data));
    dispatch(getTeachers());
  } catch (err) {
    alert('failed to create teacher' + err.message);
    dispatch(returnErrors(err.message, err.response.data, err.response.status));
  }
};

export const updateTeacher = (teacher) => async (dispatch, getState) => {
  try {
    const data = await axios
      .put('/api/teachers', teacher, tokenConfig(getState))
      .then((res) => res.data);
    alert('teacher updated: ' + JSON.stringify(data));
    dispatch(getTeachers());
  } catch (err) {
    alert('failed to update teacher' + err.message);
    dispatch(returnErrors(err.message, err.response.data, err.response.status));
  }
};

export const deleteTeacher = (teacher_id) => async (dispatch, getState) => {
  try {
    const data = await axios
      .delete(`/api/teachers/${teacher_id}`, tokenConfig(getState))
      .then((res) => res.data);
    alert(data);
    dispatch(getTeachers());
  } catch (err) {
    alert('failed to delete teacher' + err.message);
    dispatch(returnErrors(err.message, err.response.data, err.response.status));
  }
};
