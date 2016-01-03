import React from 'react';

import axios from '../config/axios';
import router from '../router';

import BaseComponent from './BaseComponent';

const store = {};

class LogoutButton extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = store;

    this.bind('handleLogout');
  }

  handleLogout() {
    axios
      .post('/user/logout')
      .then(({ data }) => {
        switch (data.code) {
          case 200:
            router.setRoute('/');
            break;
          case 400:
          case 500:
          default:
            // TODO: Handle Error
        }
      })
      .catch(() => {
        // TODO: Handle Error
      });
  }

  render() {
    return (
      <button onClick={this.handleLogout}>Logout</button>
    );
  }
}

export default LogoutButton;
