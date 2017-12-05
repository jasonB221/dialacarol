function notificationCheck(){
    var selection = document.getElementById("notifications");
    if(selection.checked){
        localStorage.setIem("notification", "true");
        setupNotifications();
    } else {
        localStorage.setItem("notification", "false");
        unsubNotifications();
    }
}

//This function handles the code for managing notification permission requesting
function setupNotifications(){
    const messaging = firebase.messaging();
    //Get the current notification token
    messaging.getToken().then(function(currToken){
        if(currToken){
            setupRecieving(currToken, messaging);
        } else {
            //Executes when permission for sending notifications is denied
            console.log("No current token");
            messaging.requestPermission().then(function() {
                messaging.getToken().then(function(currToken){
                    if(currToken) {
                        setupRecieving(currToken, messaging);
                    } else {
                        //There is something really wrong. You should not hit this code under any normal circumstances
                        console.log("Something screwed up");
                        alert("There is an internal error. Try reloading the page. Notifications may not work.");
                    }
                });
            }).catch(function(err) {
                //Code that executes when permission is denied
                alert("This requires notifications to work. You will have to reload the page to get updates.");
                console.log(err);
            });
        }
    });
}

//This function registers the push message handlers
function setupRecieving(currToken, messaging){
    messaging.onMessage(function(payload) { //The code that executes when the page is in the foreground
        addCall(payload['data']['song'], payload['data']['lat'], payload['data']['lng']);
    });
    //This code block registers a channel for communication with the service worker
    const channel = new BroadcastChannel('dialacarol');
    channel.onmessage = function(e) {
        addCall(e['data']['song'], e['data']['lat'], e['data']['lng']);
    }

    //This code block registers any new users to recieve data from the /topics/songs messaging channel.
    if(getCookie('token') != currToken){
      document.cookie = "token=" + currToken + "; expires=Fri, Dec 31 " + (new Date()).getCurrentYear() + " 23:59:59 GMT";
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", "/registerNotifications?token=" + currToken, true);
      xmlHttp.send(null);
    }
}

//This function will remove the current stored token from the current year topic
function unsubNotifications(){
    var token = getCookie('token');
    if(token != ""){
        document.cookie = "token=; expires Thu, Jan 01 1970 00:00:01 GMT";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "/unsubNotifications?token=" + token, true);
        xmlHttp.send(null);
    }
}

// This function retrieves the current token from cookies
function getCookie(id){
    var cookiearray = decodeURIComponent(document.cookie).split(';');
    for(var i = 0; i < cookiearray.length; i++){
        var keyval = cookiearray[i].split('=');
        if(keyval[0] == id) return keyval[1];
    }
    return "";
}
