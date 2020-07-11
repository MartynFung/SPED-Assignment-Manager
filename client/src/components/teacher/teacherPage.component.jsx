import React, { useEffect, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTeachers } from '../../redux/teacher/teacher.actions';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import MaterialTable from 'material-table';

const axios = require('axios');

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const TeacherPage = () => {
  const teachers = useSelector((state) => state.teacher.teachers);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTeachers());
  }, [dispatch]);

  const createItem = async (teacher) => {
    try {
      axios.post('/api/teachers', teacher).then((response) => {
        alert('teacher created' + response);
        dispatch(getTeachers());
      });
    } catch (err) {
      alert('failed to create teacher' + err.message);
      console.error(err.message);
    }
  };

  const updateItem = async (teacher) => {
    try {
      axios.put('/api/teachers', teacher).then((response) => {
        alert('teacher updated' + JSON.stringify(response));
        dispatch(getTeachers());
      });
    } catch (err) {
      alert('failed to update teacher' + err.message);
      console.error(err.message);
    }
  };

  const deleteItem = async (teacher) => {
    try {
      axios.delete(`/api/teachers/${teacher.teacher_id}`).then((response) => {
        alert(response.data);
        dispatch(getTeachers());
      });
    } catch (err) {
      alert('failed to delete teacher' + err.message);
      console.error(err.message);
    }
  };

  return (
    <div className='teachers-page'>
      <h1>Teachers</h1>
      <MaterialTable
        icons={tableIcons}
        columns={[
          { title: 'First name', field: 'first_name' },
          { title: 'Last Name', field: 'last_name' },
          { title: 'Email', field: 'email' },
        ]}
        data={teachers}
        title='Teachers Table'
        editable={{
          onRowAdd: (newData) => createItem(newData),
          onRowUpdate: (newData, oldData) => updateItem(newData),
          onRowDelete: (oldData) => deleteItem(oldData),
        }}
      />
    </div>
  );
};

export default TeacherPage;
