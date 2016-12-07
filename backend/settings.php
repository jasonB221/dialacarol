<?php

  //Settings for MySQL Databse connection
  $db_host = 'localhost';
  $db_port = 3306;
  $db_user = 'username';
  $db_pass = 'password';
  $db_name = 'latlng_table_name';
  
  //The location of the song json file
  $songfile = "songs.json";
  
  //Stores the key used to validate data is coming from an accepted source
  $key = "shared_key";
  
  //Stores the API key for google maps api
  $api_key = "maps_api_key";
  
  //Stores the API token for sending FCM messages
  $fcm_token = "firebase_messaging_token";
  
  $fcm_header_array = array(
    "Content-Type: application/json",
    "Authorization: key={$fcm_token}"
  );
?>