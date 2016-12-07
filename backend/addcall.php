<?php
  require_once(__DIR__."/settings.php");
  
  //If keys don't match, return 403
  if($key !== $_POST["key"]){
    http_response_code(403);
//    print_r($_POST);
//    printf("Given key: %s. Actual key: %s.\n", $_POST["key"], $key);
    exit(1);
  }
  
  //Check if at least one lookup paramater is set. If not, send a 400 error
  if(!(isset($_POST["city"])) && !(isset($_POST["state"])) && !(isset($_POST["country"]))){
    http_response_code(400);
    exit(1);
  }
  
  //Set the values of city, state, and country to their posted values or empty string
  $city = (isset($_POST["city"])? strtolower($_POST["city"]): "");
  $state = (isset($_POST["state"])? strtolower($_POST["state"]): "");
  $country = (isset($_POST["country"])? strtolower($_POST["country"]): "");
  
  //Open up a DB connection to store the geocode info
  $db_connection = new mysqli($db_host, $db_user, $db_pass, $db_name, $db_port);
  if($db_connection->connect_errno){
    http_response_code(500);
//    echo "Failed to connect to MySQL: (" . $db_connection->connect_errno . ") " . $db_connection->connect_error;
    exit(1);
  }
  
  //Prepare a statement to run, so as to sanitize inputs
  if (!($stmt = $db_connection->prepare("SELECT latitude,longitude FROM geolookup WHERE city=? AND state=? AND country=?;"))) {
    http_response_code(500);
//    echo "Prepare failed: (" . $db_connection->errno . ") " . $db_connection->error;
    exit(1);
  }
  if (!$stmt->bind_param("sss", $city, $state, $country)) {
    http_response_code(500);
//    echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
    exit(1);
  }
  
  //Run the statement and store in result
  if (!$stmt->execute()) {
    http_response_code(500);
//    echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
    exit(1);
  }
  $stmt->store_result();
  
  //If there is at least one result, just take the first one and store it
  //Otherwise, look it up
  if($stmt->num_rows > 0){
    $stmt->bind_result($latitude, $longitude);
    $stmt->fetch();
  } else {
    //Begin the lookup process for the location
    $location_string = urlencode($city) . "+" . urlencode($state) . "+" . urlencode($country);
    $url = "https://maps.googleapis.com/maps/api/geocode/json?address=" . $location_string . "&key=" . $api_key;
    $request = curl_init();
    curl_setopt($request, CURLOPT_URL, $url);
    curl_setopt($request, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($request);
    curl_close($request);
    $response = json_decode($response, true);
    
    //Now that we have the response, do some processing
    //First check to make sure it is a valid response
    if($response["status"] !== "OK"){
      http_response_code(500);
//      echo "Connection issue between server and google.";
      exit(1);
    }
    
    //Actually extract the working latitude and longitude from the response
    $latitude = $response["results"][0]["geometry"]["location"]["lat"];
    $longitude = $response["results"][0]["geometry"]["location"]["lng"];
    
    //Now that we have the results, update the db so we don't need to query google again.
    if (!($stmt = $db_connection->prepare( "INSERT INTO geolookup(city, state, country, latitude, longitude) VALUES (?, ?, ?, ?, ?);" ))) {
      http_response_code(500);
//      echo "Prepare failed: (" . $db_connection->errno . ") " . $db_connection->error;
      exit(1);
    }
    if (!$stmt->bind_param("sssdd", $city, $state, $country, $latitude, $longitude)) {
      http_response_code(500);
//      echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
      exit(1);
    }
    if (!$stmt->execute()) {
      http_response_code(500);
//      echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
      exit(1);
    }
  }
  $db_connection->close();
  
  //By this point, we have latitude and longitude. Send to client and close the connection so as to not delay the sending server with messy details.
  //Code copied from Stackoverflow (http://stackoverflow.com/a/4856241)
  //TODO understand what this code actually does
  ob_end_clean();
  header("Connection: close");
  ob_start();
  printf("Latitude =  %f\n", $latitude);
  printf("Longitude = %f\n", $longitude);
  $size = ob_get_length();
  header("Content-Length: $size");
  ob_end_flush(); 
  flush(); // Strange behaviour, will not work without both being called
  
  //Now that the client connection is closed, move onto the heavy processing stuff
  //First create the array we will save in the json file
  $song = array(
    "song" => (isset($_POST["song"])? $_POST["song"]: ""),
    "lat" => $latitude,
    "lng" => $longitude
  );
  $song_json = json_encode($song);
  $song_json = "," . $song_json . "]}";
  
  //Add the newly encoded json to the ongoing file as quickly as possible
  $handle = @fopen($songfile, "r+");
  if($handle){
    fseek($handle, -2, SEEK_END);
    fwrite($handle, $song_json);
  }
  fclose($handle);
  
  //Now format the request to send to the FCM servers
  $fcm_array = array(
    "to" => "/topics/songs",
    "data" => $song
  );
  $fcm_json = json_encode($fcm_array);
  
  //Send the json message to the FCM servers
  $request = curl_init();
  curl_setopt($request, CURLOPT_HTTPHEADER, $fcm_header_array);
  curl_setopt($request, CURLOPT_CUSTOMREQUEST, "POST");
  curl_setopt($request, CURLOPT_POSTFIELDS, $fcm_json);
  curl_setopt($request, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($request, CURLOPT_URL, "https://fcm.googleapis.com/fcm/send");
  $response = curl_exec($request); //We have the response if we want to do anything with it. For now, we discard it.
  curl_close($request);
  
  //We are done executing the script. The rest of the statements are for debugging only.
  //file_put_contents("fcm_log.txt", $response);
  
?>