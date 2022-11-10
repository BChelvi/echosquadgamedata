<?php
    header("Access-Control-Allow-Origin:*");

   require 'autoload.php';

   $request_body = file_get_contents('php://input');

   


    if($request_body){
        $params = json_decode($request_body, true);
        file_put_contents('request.txt',$request_body);
        
 
    }
    else if(isset($_GET["action"])){
    $params = $_GET;
        }
        else {
            $params = $_POST;
        }

switch($params["action"])
{

    case "getallsites" :
        GetAllSites :: Run();
        
    break;

    case "getsiterooms":
        GetSiteRooms :: Run($params['id']);
        
    break;

    case "getallrooms":
        GetAllRooms ::Run($params['SiteId']);
          
    break;

    case 'getgamesession':
        GetGameSession :: Run($params['GameSessionId']);
    
    break;
    
    case 'getmissions':
        GetMissions :: Run();
    
    break;


}