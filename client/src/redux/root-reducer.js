import { combineReducers } from 'redux';
import userReducer from './user/user.reducer';
import studentReducer from './student/student.reducer';
import teacherReducer from './teacher/teacher.reducer';

export default combineReducers({
  //user: userReducer,
  student: studentReducer,
  teacher: teacherReducer,
});
