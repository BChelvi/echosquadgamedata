<?php

    require 'autoload.php';

    if(isset($_GET["action"])){
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
            GetAllRooms ::Run($params['SiteId'],$params['Date']);
            
        break;

        case 'getgamesession':
            GetGameSession :: Run($params['GameSessionId']);
        
        break;
        
        case 'getmissions':
            GetMissions :: Run();
        
        break;

        case 'getyearrapport';
            GetYearRapport :: Run($params['SiteId'],$params['Year']);

        break;
    }
