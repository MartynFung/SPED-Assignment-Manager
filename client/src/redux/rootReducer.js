import { combineReducers } from 'redux';
// import userReducer from './user/user.reducer';
import studentReducer from './student/student.reducer';
import teacherReducer from './teacher/teacher.reducer';
import errorReducer from './error/error.reducer';
import authReducer from './auth/auth.reducer';

export default combineReducers({
  student: studentReducer,
  teacher: teacherReducer,
  error: errorReducer,
  auth: authReducer,
});
