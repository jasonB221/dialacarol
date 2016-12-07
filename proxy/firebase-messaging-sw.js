importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '551905331000'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload){
  var data = payload['data'];
  const channel = new BroadcastChannel('dialacarol');
  channel.postMessage(data);
  
  const title = "Map Updated";
  const options = {
    body: "The Dial-a-Carol map has been updated.",
    icon: "/images/snowflake.jpg"
  };
  
  self.addEventListener('notificationclick', function(event) {
    event.waitUntil(clients.matchAll({includeUncontrolled: true, type:'window'}).then(function(clientsFound) {
      for(var i = 0; i < clientsFound.length; i++){
        if(clientsFound[i].url.indexOf("dialacarol.bilas.org") !== -1){
          clientsFound[i].focus();
          return null;
        }
      }
      clients.openWindow("https://dialacarol.bilas.org");
    }));
    event.notification.close();
  });
  
  self.addEventListener('alertclosed', function(event){
    self.showingNotification = false;
  });

  return self.registration.getNotifications().then(function(notifications){
    if(notifications && notifications.length > 0)
        return;
    return self.registration.showNotification(title, options);
  });
});

