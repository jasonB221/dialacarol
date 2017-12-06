// This is the function called when the live notification switch is clicked
function notificationCheck(){
    if($('#notifications').prop('checked')){
        if(localStorage.getItem("modal") != "true"){
            $("#notifModal").modal('open');
        }
        else{
            localStorage.setItem("notification", "true");
            setupNotifications();
        }
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
            //Executes when there isn't a token
            console.log("No current token");
            messaging.requestPermission().then(function() {
                messaging.getToken().then(function(currToken){
                    setupRecieving(currToken, messaging);
                });
            }).catch(function(err) {
                //Code that executes when permission is denied
                if(err.code == "messaging/permission-blocked")
                    $("#notifDenied").modal('open');
                $("#notifications").prop("checked", false);
                localStorage.setItem("notification", "false")
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
      document.cookie = "token=" + currToken + "; expires=Fri, Dec 31 " + (new Date()).getFullYear() + " 23:59:59 GMT";
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
