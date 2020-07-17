import TeacherActionTypes from './teacher.types';
import axios from 'axios';

export const getTeachers = () => (dispatch) => {
  axios
    .get('/api/teachers')
    .then((res) =>
      dispatch({
        type: TeacherActionTypes.GET_TEACHERS,
        payload: res.data,
      })
    )
    .catch((error) => console.log(error));
};
