//All this function does is add a single call to the map
function addCall(song, latitude, longitude){
  if(latitude == ""){
	  return;
  }
  var marker = new self.google.maps.Marker({
    position: {lat: parseInt(latitude), lng: parseInt(longitude)},
    map: map,
    title: song
  });

  //The part that adds the call
  global_cluster.addMarker(marker);

  //This section updates the call counters
  $("#count").html(parseInt($("#count").html()) + 1); //Update raw call count
  //console.log("Added a call.");
  if(song.indexOf("(Mariah Carey)") !== -1){
	  $("#mariah").html(parseInt($("#mariah").html()) + 1); //Update Mariah meter
  }
}

//This function handles code for adding mass numbers of calls
function addMultipleCalls(callArray){
  var timer = setInterval(function (){
      //Add calls to the map, 30 at a time
      var temp = callArray.splice(0,30);
      for(var i = 0; i < temp.length; i++){
          var songname = temp[i]['song'];
          var lat = temp[i]['lat'];
          var lng = temp[i]['lng'];
          addCall(songname, lat, lng);
      }
      if(callArray.length == 0){
          //When no calls are left, stop executing this
          clearInterval(timer);
      }
  }, 50);//Repeat every 50 milliseconds
}
