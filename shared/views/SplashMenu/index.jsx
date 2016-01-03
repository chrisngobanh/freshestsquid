/* global grecaptcha */
import $ from 'jquery';
import React from 'react';

import BaseComponent from '../BaseComponent';
import Helmet from '../Helmet';

import axios from '../../config/axios';
import router from '../../router';
import util from '../util';

function resetRecaptcha() {
  const $recaptcha = $('#recaptcha');
  $recaptcha.empty();

  grecaptcha.render('recaptcha', {
    sitekey: '6LdLShQTAAAAABrmUEYlYqQAcgAA3BMeh_NERG2P',
  });
}

function handleSignup(e) {
  e.preventDefault();

  const formData = util.convertQsToObject($('#signup-form').serialize());

  axios.post('/user', formData)
    .then(({ data }) => {
      switch (data.code) {
        case 200:
          router.setRoute('/loadouts');
          break;
        case 400:
          $('#username').select();
          resetRecaptcha();
          break;
        case 500:
          // TODO: Show an error message
          break;
        default:
      }
    })
    .catch(() => {
      // TODO: Show an error message
    });
}

function handleLogin(e) {
  e.preventDefault();

  const formData = util.convertQsToObject($('#login-form').serialize());

  axios.post('/user/login', formData)
    .then(({ data }) => {
      switch (data.code) {
        case 200:
          router.setRoute('/loadouts');
          break;
        case 400:
          $('#usernameEmail').select();
          break;
        case 500:
          // TODO: Show an error message
          break;
        default:
      }
    })
    .catch(() => {
      // TODO: Show an error message
    });
}

class SplashMenu extends BaseComponent {

  componentDidMount() {
    $('#signup-form').submit(handleSignup);
    $('#login-form').submit(handleLogin);
    resetRecaptcha();
  }

  render() {
    return (
      <div>
        <Helmet
          // Include Recaptcha library for signups
          script={[
            { src: 'https://www.google.com/recaptcha/api.js?render=explicit' },
          ]}
        />
        <h2>Hey, you. Yeah, you! Wanna be the</h2>
        <h1 className="orange">Freshest Squid</h1>
        <h2>on the block?</h2>
        <div className="signup-menu">
          <h3>Signup</h3>
          <form id="signup-form">
            <input type="text" name="username" id="username" placeholder="username" required />
            <input type="email" name="email" placeholder="email" required />
            <input type="password" name="password" placeholder="password" required />
            <div id="recaptcha" />
            <button>Submit</button>
          </form>
        </div>
         <div className="login-menu">
          <h3>Login</h3>
          <form id="login-form">
            <input
              type="text"
              name="usernameEmail"
              id="usernameEmail"
              placeholder="username/email"
              required
            />
            <input type="password" name="password" placeholder="password" required />
            <button>Submit</button>
          </form>
        </div>
        <a href="/about">About Freshest Squid</a>
      </div>
    );
  }
}

export default SplashMenu;
