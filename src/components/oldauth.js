'use strict';

var Firebase = require('firebase');
var request = require('superagent');
var FIREBASE_REF = require('config/client').FIREBASE_REF;
var PubSub = require('pubsub-js');
var Router = require('react-router');
var EventTypes = require('client/constants/pubsub').EventTypes;
var MAKE_FLASH = EventTypes.MAKE_FLASH;
var config = require('config/client');
var ref = new Firebase(FIREBASE_REF);
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

exports.auth = {

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
    ref.authWithPassword({
      email: user.email,
      password: user.password
    }, function(err, authData) {
      if (authData) {
        var auth = JSON.stringify(authData);
        localStorage.setItem('auth', auth);
        PubSub.publish('USER', authData);
        cb && cb(true)
      } else if (err) {
        var flash = {
          type: 'danger',
          header: 'Error',
          message: err
        };
        PubSub.publish('FLASH', flash);
        console.log("Error authenticating:", err);
        cb && cb(false);
      }
    }.bind(this));
  },

  createUser: function(user, masterkey, cb) {

    ref.createUser(user, function(err) {
      if (!err) {
        ref.authWithPassword({
          email: user.email,
          password: user.password
        }, function(err, authData) {
          user.uid = authData.uid;
          localStorage.setItem('auth', authData);
          request
            .post(config.BTCM_RPC + '/createUser')
            .send({user: user, masterkey: masterkey})
            .end( function(err, res) {
              var response = JSON.parse(res.text);
              if (response.result !== 'error') {
                var flash = {
                  type: 'success',
                  header: 'Registration Successful',
                  message: 'You have successfully registered. You are now logged in and can start using the POS system',
                  timeout: 10000
                };
                cb && cb(null, user);
              } else {
                console.log(response.message);
                var flash = {
                  type: 'warning',
                  header: 'Registration error',
                  message: response.message,
                  timeout: 10000
                };
                var error = new Error(response.message);
                console.log('Error: ' + response.message);
                ref.removeUser(user, function(error) {
                  if (!error) {
                    cb && cb(error, null);
                  }
                });
              }
              PubSub.publish(MAKE_FLASH, flash);
            });
        }, function(error) {
          console.log('error logging in after create user', error);
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
        cb && cb(error, null);
      }
    });
  },

  logout: function(cb) {
    localStorage.clear();
    ref.unauth();
    cb && cb();
  },

  loggedIn: function() {
    if (ref.getAuth()) {
      return true;
    };
    return false;
  },

};
