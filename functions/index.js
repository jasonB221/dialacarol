const functions = require('firebase-functions');
const admin = require('firebase-admin');
//const request = require('request');
//const Datastore = require('@google-cloud/datastore');

//const projectId =

admin.initializeApp(functions.config().firebase);

/* This function registers a user to the current year's topic.
 * It is passed a query named token, and replies with a 200 status code.
 */
exports.registerNotifications = functions.https.onRequest((req, res) => {
    admin.messaging().app.subscribeToTopic(req.query.token, "songs-" + ((new Date()).getFullYear()));
    res.status(200).end();
});

/* This function is called when a client requests to unsubscribe from live updates
 * It is passed a token in the query, and replies with a 200 status code
 */
exports.unsubNotifications = functions.https.onRequest((req, res) => {
    admin.messaging().app.unsubscribeFromTopic(req.query.token, "songs-" + ((new Date()).getFullYear()));
    res.status(200).end();
});
