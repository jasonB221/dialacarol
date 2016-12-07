function initMap(){
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 2,
        center: {lat:0.60297, lng:-2.630912},
        mapTypeId: 'roadmap'
    });
    setupNotifications();
    markers = {};
    markerCluster = new MarkerClusterer(map, markers, 
        {imagePath: '/images/m', gridSize: 18});
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var list = JSON.parse(xmlHttp.responseText)['songs'];
            var timer = setInterval(function (){
                var temp = list.splice(0,30);
                for(var i = 0; i < temp.length; i++){
                    var songname = temp[i]['song'];
                    var lat = temp[i]['lat'];
                    var lng = temp[i]['lng'];
                    addCall(songname, lat, lng);
                }
                if(list.length == 0){
                    clearInterval(timer);
                }
            }, 50);  
        }
    }
    xmlHttp.open("GET", "https://dialacarol.bilas.org/songs.json?t=" + (Date.now()/1000), true);
    xmlHttp.send(null);
}

function setupNotifications(){
    const messaging = firebase.messaging();
    messaging.getToken().then(function(currToken){
        if(currToken){
            setupRecieving(currToken, messaging);
        } else {
            console.log("No current token");
            messaging.requestPermission().then(function() {
                messaging.getToken().then(function(currToken){
                    if(currToken) {
                        setupRecieving(currToken, messaging);
                    } else {
                        console.log("Something screwed up");
                        alert("There is an internal error. Try reloading the page. Notifications may not work.");
                    }
                });
            }).catch(function(err) {
                alert("This requires notifications to work. You will have to reload the page to get updates.");
                console.log(err);
            });
        }
    });
}
function setupRecieving(currToken, messaging){
    messaging.onMessage(function(payload) {
        addCall(payload['data']['song'], payload['data']['lat'], payload['data']['lng']);
    });
    const channel = new BroadcastChannel('dialacarol');
    channel.onmessage = function(e) {
        addCall(e['data']['song'], e['data']['lat'], e['data']['lng']);
    }
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://dialacarol.bilas.org/registertopic.php?topic=songs&regtoken=" + currToken, true);
    xmlHttp.send(null);
}