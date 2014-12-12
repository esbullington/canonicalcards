'use strict';

var Firebase = require('firebase');
var PubSub = require('pubsub-js');
var EventTypes = require('../constants/EventTypes');
var MAKE_FLASH = EventTypes.MAKE_FLASH;
var ref = new Firebase("https://flashcardsapp.firebaseio.com/");
var authRef = ref.child('.info').child('authenticated');

var REGISTRATION_CODES = {
    'AUTHENTICATION_DISABLED':'The specified authentication type is not enabled for this Firebase.',
    'EMAIL_TAKEN':'Email/password auth: The specified email address is already in use.',
    'INVALID_EMAIL':'Email/password auth: The specified email address is incorrect.',
    'INVALID_FIREBASE':'Invalid Firebase specified.',
    'INVALID_ORIGIN':'Unauthorized request origin. This most likely means we need to add the domain to our whitelist.',
    'INVALID_PASSWORD':'Email/password auth: The specified password is incorrect.',
    'INVALID_USER':'Email/password auth: The specified user does not exist.',
    'UNKNOWN_ERROR':'An unknown error occurred. Please contact support@firebase.com.',
    'USER_DENIED':'User denied authentication request. This error can be triggered by the user closing the OAuth popup or canceling the authentication request.'
}

ref.onAuth(function(authData) {
  if (authData) {
    PubSub.publish('AUTHENTICATED', true);
  } else {
    PubSub.publish('AUTHENTICATED', false);
  }
});

module.exports = {

  passwordReset: function(email, cb) {
    var userCredential = {
      email: email
    };
    ref.resetPassword(userCredential, function(error) {
      if (error === null) {
        var msg = "Password reset email sent successfully";
        var flash = {
          type: 'success',
          header: 'Success',
          message: msg,
          timeout: 5000
        };
        PubSub.publish('FLASH', flash);
        cb(null);
      } else {
        var msg = "Error sending password reset email: " + error;
        var flash = {
          type: 'danger',
          header: 'Error',
          message: msg,
          timeout: 50000
        };
        PubSub.publish('FLASH', flash);
        console.log(msg);
        cb(error);
      }
    });
  },

  login: function(user, cb) {
    // Alas, Firebase's simplelogin call
    // doesn't have a callback on success
    // so we must make our own
    ref.authWithPassword(user, function(err, authData) {
      if (authData) {
        // var auth = JSON.stringify(authData);
        // localStorage.setItem('auth', auth);
        PubSub.publish('USER', authData);
        cb && cb(null, authData)
      } else if (err) {
        var flash = {
          type: 'danger',
          header: 'Error',
          message: err
        };
        PubSub.publish('FLASH', flash);
        console.log("Error authenticating:", err);
        cb && cb(err);
      }
    }.bind(this));
  },

  createUser: function(user, cb) {

    ref.createUser(user, function(err) {
      if (!err) {
        ref.authWithPassword({
          email: user.email,
          password: user.password
        }, function(err, authData) {
          cb && cb(null, authData);
        }, function(error) {
          console.log('error logging in after create user', error);
          cb && cb(error);
        });
      } else {
        var errorMessage = REGISTRATION_CODES[err.code];
        var flash = {
          type: 'warning',
          header: 'Registration error',
          message: errorMessage,
          timeout: 10000
        };
        PubSub.publish(MAKE_FLASH, flash);
        console.log('Error: ' + errorMessage);
        var error = new Error(errorMessage);
        cb && cb(error);
      }
    });
  },

  logout: function(cb) {
    localStorage.clear();
    ref.unauth();
    cb && cb();
  },

  loggedIn: function() {
    return ref.getAuth();
  },

  getAuth: function() {
    return ref.getAuth();
  }

};
