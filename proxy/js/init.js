//This is the callback function that google maps calls
function initMap(){
    map = new google.maps.Map(document.getElementById("map"), { //This data is outdated, you should manually adjust the map on the screen
        zoom: 3,
        center: {lat:19.4582, lng:12.837838},
        mapTypeId: 'roadmap'
    });

    //Set up notifications for recieving calls on the fly
    setupNotifications();

    markers = {}; //Initialize it with zero markers
    markerCluster = new MarkerClusterer(map, markers,
        {imagePath: '/images/m', gridSize: 18});

    //This block of code requests all the previously recorded songs
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
            //Executes when the code returns
            var list = JSON.parse(xmlHttp.responseText)['songs'];
            var timer = setInterval(function (){
                //Add calls to the map, 30 at a time
                var temp = list.splice(0,30);
                for(var i = 0; i < temp.length; i++){
                    var songname = temp[i]['song'];
                    var lat = temp[i]['lat'];
                    var lng = temp[i]['lng'];
                    addCall(songname, lat, lng);
                }
                if(list.length == 0){
                    //When no calls are left, stop executing this
                    clearInterval(timer);
                }
            }, 50);//Repeat every 50 milliseconds
        }
    }
    xmlHttp.open("GET", "https://dialacarol.bilas.org/songs.json?t=" + (Date.now()/1000), true);
    xmlHttp.send(null);
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
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://dialacarol.bilas.org/registertopic.php?topic=songs-2017&regtoken=" + currToken, true);
    xmlHttp.send(null);
}
