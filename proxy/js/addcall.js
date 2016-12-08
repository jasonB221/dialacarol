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
  self.markerCluster.addMarker(marker);

  //This section updates the call counters
  document.getElementById("count").innerHTML = parseInt(document.getElementById("count").innerHTML)+1; //Update raw call count
  if(song.indexOf("(Mariah Carey)") !== -1){
	  document.getElementById("mariah").innerHTML = parseInt(document.getElementById("mariah").innerHTML)+1; //Update Mariah meter
  }
}
