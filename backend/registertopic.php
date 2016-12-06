<?php

  require_once(__DIR__ . "/settings.php");

  if(strpos($_SERVER["HTTP_REFERER"], "dialacarol.bilas.org") === FALSE ){
//    http_response_code(403);
//    exit(1);
  }
  
  $request = curl_init();
  curl_setopt($request, CURLOPT_HTTPHEADER, $fcm_header_array);
  curl_setopt($request, CURLOPT_CUSTOMREQUEST, "POST");
  $json = '{"to":"/topics/' . $_GET['topic'] . '", "registration_tokens": ["' . $_GET["regtoken"] . '"]}';
  curl_setopt($request, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($request, CURLOPT_URL, "https://iid.googleapis.com/iid/v1/:batchAdd");
  curl_setopt($request, CURLOPT_POSTFIELDS, $json);
  $response = curl_exec($request); //We have the response if we want to do anything with it. For now, we discard it.
  curl_close($request);
  printf("%s\n", $json);
  echo $response;
?>