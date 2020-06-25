import StudentActionTypes from './student.types';

export const getStudents = () => (dispatch) => {
  return fetch('/students')
    .then((res) => res.json())
    .then((students) =>
      dispatch({
        type: StudentActionTypes.GET_STUDENTS,
        payload: students,
      })
    )
    .catch((error) => console.log(error));
};
