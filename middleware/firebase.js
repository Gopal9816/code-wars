var admin = require('firebase-admin')
var serviceAccount = require('../config/code-wars-c18cd-firebase-adminsdk-ge7ae-d8e596bd67.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://code-wars-c18cd.firebaseio.com'
});

module.exports = admin