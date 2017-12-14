## Dial-A-Carol
![Build Status](https://build.code.bilas.org/buildStatus/icon?job=Dial-A-Carol)

This project is designed to allow for [Dial-a-Carol][dialacarol] participants to see how many calls have come in, and where they are coming in from.
#### How it works
* When a caller reaches a caroler, the caroler asks a few questions and fills out a google form. When that form is submitted, a [Google Script](google/Form%20Submission.gs) is run.
* That script makes a call to a [php file](backend/addcall.php), which does the following:
  1. Checks a database to see if the specified location has already been queried
  2. If not, ask Google for location data and add it to the database for future reference
  3. Write the location and song name to a JSON file for clients to pull when initially connecting
  4. Send a Firebase notification to all the connected clients
* The [client](proxy/index.html) registers a [service worker](proxy/firebase-messaging-sw.js) which receives the notification, and processes it.
* The map is updated with another marker.

#### License
All rights not explicitly granted to you are reserved by the copyright holder, Jason Bilas

#### APIs
The following APIs and services were used to make this map work:
* [Google Scripts](https://developers.google.com/apps-script/)
* [Google Maps Geolocation](https://developers.google.com/maps/documentation/geolocation/intro)
* [Google Maps JavaScript Marker Clusters](https://developers.google.com/maps/documentation/javascript/marker-clustering)
* [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/)


[dialacarol]:http://www.housing.illinois.edu/living-options/residence-halls/undergraduate-halls/snyder/dial-a-carol
