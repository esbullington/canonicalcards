var Firebase = require('firebase');
var presenceRef = new Firebase('https://flashcardsapp.firebaseio.com/disconnectmessage');


module.exports.initPresenceMonitor = function(userId) {
  presenceRef.set('true', function(error) {
    if (error) {
      console.log('error connecting to database');
    }
  });
  presenceRef.on('value', function(snapshot) {
    var connectionStatus = snapshot.val();
    console.log('Status: ', connectionStatus);
  });
  presenceRef.onDisconnect().set('false');
};
