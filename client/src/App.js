import React, { useEffect } from 'react';
import Navbar from './components/navbar/navbar.component';
import Routes from './components/routes/routes.component';
import { Container } from '@material-ui/core';
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import { loadUser } from './redux/auth/auth.actions';

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  });

  return (
    <Provider store={store}>
      <Router>
        <div className='App'>
          <Navbar />
          <Container className='content-grid' maxWidth='lg'>
            <Routes />
          </Container>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
