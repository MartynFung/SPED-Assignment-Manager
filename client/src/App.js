import React, { useState, useEffect } from 'react';
import Navbar from './components/navbar/navbar.component';
import Routes from './components/routes/routes.component';
import { Container } from '@material-ui/core';
import './App.css';
const axios = require('axios');
axios.defaults.withCredentials = true;

function App() {
  const [userCreds, userHasAuthenticated] = useState({
    loggedIn: false,
    username: null,
  });

  useEffect(() => {
    if (userCreds.loggedIn === false) {
      //getUser();
      userHasAuthenticated({ loggedIn: false, username: null });
    }
  }, [userCreds.loggedIn]);

  async function getUser() {
    try {
      axios.get('/auth').then((response) => {
        console.log('Get user response: ');
        console.log(response);
        if (response.data.user) {
          console.log('Get User: There is a use saved in the server session: ');
          userHasAuthenticated({
            loggedIn: true,
            username: response.data.user.username,
          });
        } else {
          console.log('Get user: no user');
          userHasAuthenticated({ loggedIn: false, username: null });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className='App'>
      <Navbar />
      <Container className='content-grid' maxWidth='lg'>
        <Routes childProps={{ userCreds, userHasAuthenticated }} />
      </Container>
    </div>
  );
}

export default App;
