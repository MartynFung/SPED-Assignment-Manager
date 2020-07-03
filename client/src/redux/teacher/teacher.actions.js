import TeacherActionTypes from './teacher.types';

export const getTeachers = () => (dispatch) => {
  return fetch('/api/teachers')
    .then((res) => res.json())
    .then((teachers) =>
      dispatch({
        type: TeacherActionTypes.GET_TEACHERS,
        payload: teachers,
      })
    )
    .catch((error) => console.log(error));
};
