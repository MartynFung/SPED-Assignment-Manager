import StudentActionTypes from './student.types';

const INITIAL_STATE = {
  students: [],
};

const studentReducer = (state = INITIAL_STATE, action) => {
  console.log({ action });
  switch (action.type) {
    case StudentActionTypes.GET_STUDENTS:
      return {
        ...state,
        students: action.payload,
      };
    default:
      return state;
  }
};
//
export default studentReducer;
