import { combineReducers } from 'redux';
import userReducer from './user/user.reducer';
import studentReducer from './student/student.reducer';

export default combineReducers({
  //user: userReducer,
  student: studentReducer,
});
