function addCall(song, latitude, longitude){
  if(latitude == ""){
	  return;
  }
  var marker = new self.google.maps.Marker({
    position: {lat: parseInt(latitude), lng: parseInt(longitude)},
    map: map,
    title: song
  });

  self.markerCluster.addMarker(marker);

  document.getElementById("count").innerHTML = parseInt(document.getElementById("count").innerHTML)+1;
  if(song.indexOf("(Mariah Carey)") !== -1){
	  document.getElementById("mariah").innerHTML = parseInt(document.getElementById("mariah").innerHTML)+1;
  }
}
