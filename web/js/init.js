//This variable holds the current year loaded by the maps
var global_yearLoaded;
var global_currentYear = (new Date()).getFullYear();
var global_cluster = null;

//This is the callback function that google maps calls
function initMap(){
    map = new google.maps.Map(document.getElementById("map"), { //This data is outdated, you should manually adjust the map on the screen
        zoom: 3,
        center: {lat:19.4582, lng:12.837838},
        mapTypeId: 'roadmap'
    });

    //Look for cookie and update notification status appropriatly
    if(getCookie("notification")){
        document.getElementById("notifications").checked = true;
        setupRecieving();
    }

    markers = {}; //Initialize it with zero markers
    global_cluster = new MarkerClusterer(map, markers,
        {imagePath: '/images/m', gridSize: 18});

    //This block of code requests all the previously recorded songs
/*    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
            //Executes when the code returns
            addMultipleCalls(JSON.parse(xmlHttp.responseText)['songs']);
        }
    }
    xmlHttp.open("GET", "https://dialacarol.bilas.org/songs.json?t=" + (Date.now()/1000), true);
    xmlHttp.send(null);*/
    loadYear(global_currentYear);
}

function loadYear(year){
    if(year == global_yearLoaded) return; //The map is already displaying the selected year
    if(year == global_currentYear){
        //loadCurrentYear();
        alert("Year set to current year: " + year);
        return;
    }
    else if(year > global_currentYear){
        console.error("Year to set cannot be in the future");
        return;
    }

    // Load a year in the past
    global_yearLoaded = year;

    if(localStorage.getItem(year) == null){
        // Year is not in local cache, fetch it from the remote server
        var storageRef = firebase.storage().ref();
        var ref = storageRef.child("songs/songs-" + year + ".json");
        ref.getDownloadURL().then(function(url){
            var xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.onload = function(event){
                localStorage.setItem(year, JSON.stringify(xhr.response));
                clearMap();
                addMultipleCalls(xhr.response["songs"]);
            };
            xhr.open("GET", url);
            xhr.send();
        }).catch(function(error){
            console.error(error);
        });
    } //The response is already cached, instead of requesting again just use the cache
    else{
        clearMap();
        addMultipleCalls(JSON.parse(localStorage.getItem(year))["songs"]);
    }
}

//This function resets the map to it's default state
function clearMap(){
    global_cluster.clearMarkers();
    document.getElementById("count").innerHTML = 0;
    document.getElementById("mariah").innerHTML = 0;
}
