function respondToSubmission(e) {
  
  var encodedData = returnData(e.values);
  var options = {
    'method': 'post',
    'payload': encodedData
  };
  
  UrlFetchApp.fetch("http://bilas2.web.engr.illinois.edu/addcall.php", options)
}

function returnData(submitted){
  var songName;
  if(submitted[2] == ""){
    songName = submitted[3];
  } else {
    songName = submitted[2];
  }
  var country = submitted[6];
  if(submitted[4] == "" && submitted[5] == "" && submitted[6] == ""){
    country = "us";
  }
  return {'city':submitted[4], 'state':submitted[5], 'country':country, 'song':songName, 'key':"shared_key"};
}
