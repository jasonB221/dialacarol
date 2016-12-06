function respondToSubmission(e) {
  if(!shouldSubmit(e.values)){return;}
  
  var encodedData = returnData(e.values);
  var options = {
    'method': 'post',
    'payload': encodedData
  };
  
  UrlFetchApp.fetch("http://bilas2.web.engr.illinois.edu/addcall.php", options)
}

function shouldSubmit(submitted){
  var city, state, country;
  city = submitted[4];
  state = submitted[5];
  country = submitted[6];
  return ((city != "") || (state != "") || (country != ""));
}

function returnData(submitted){
  var songName;
  if(submitted[2] == ""){
    songName = submitted[3];
  } else {
    songName = submitted[2];
  }
  return {'city':submitted[4], 'state':submitted[5], 'country':submitted[6], 'song':songName, 'key':"shared_key"};
}
