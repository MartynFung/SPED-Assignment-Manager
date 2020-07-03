import React, { useEffect } from 'react';
import { useDispatch, useSelector, connect } from 'react-redux';
import './students.css';
import { getStudents } from '../../redux/student/student.actions';

const StudentPage = () => {
  // const Students = ({ getStudents, students }) => {
  const students = useSelector((state) => state.student.students);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStudents());
    // getStudents();
  }, [dispatch]);

  return (
    <div>
      <h2>Students</h2>
      {students.map(({ id, firstName, lastName }) => (
        <div key={id}>
          <div>
            {id} {firstName} {lastName}
          </div>
        </div>
      ))}
    </div>
  );
};

// const mapStateToProps = (state) => ({
//   myTest: state.student.test,
//   students: state.student.students,
// });

// const mapDispatchToProps = (dispatch) => ({
//   getStudents: () => dispatch(getStudents()),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Students);
export default StudentPage;
