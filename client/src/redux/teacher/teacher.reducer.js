import TeacherActionTypes from './teacher.types';

const INITIAL_STATE = {
  teachers: [],
};

const teacherReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TeacherActionTypes.GET_TEACHERS:
      return {
        ...state,
        teachers: action.payload,
      };
    default:
      return state;
  }
};

export default teacherReducer;
