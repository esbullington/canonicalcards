var Firebase = require('firebase');
var ref = new Firebase('https://flashcardsapp.firebaseio.com');


module.exports.initPresenceMonitor = function(userId) {
  var presenceRef = ref.child('users').child(userId).child('disconnectmessage');
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
