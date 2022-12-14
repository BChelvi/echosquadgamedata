<?php

    //permet d'auto invoqué les différents fichiers ...class.php
    require 'autoload.php';

    //switch case sur l'action envoyé en AJAX par les différents scripts JS 
    switch($_GET["action"])
    {
        //requete pour récupérer tous les sites d'exploitants
        case "getallsites" :
            GetAllSites :: Run();
            
        break;
        
        //requete pour récupérer toutes les rooms (salles) d'un site
        case "getsiterooms":
            GetSiteRooms :: Run($_GET['id']);
            
        break;

            //requête pour récupérer les datas des gamessessions et roomsessions des rooms d'un site sur une période de temps
        case "getallrooms":
            GetAllRooms ::Run($_GET['SiteId'],$_GET['Date']);
            
        break;

        //requête pour récupérer les datas d'une gamesession et ses gameevents pour mission.html
        case 'getgamesession':
            GetGameSession :: Run($_GET['GameSessionId']);
        
        break;
        
        //requête pour récupère les datas de la table mission (id, nom, durée minimale, ect...)
        case 'getmissions':
            GetMissions :: Run();
        
        break;

        //requête pour récupère les datas (durée, succés, id de mission,ect...) des missions sur l'année pour la vue Rapport Annuelle
        case 'getyearrapport';
            GetYearRapport :: Run($_GET['SiteId'],$_GET['Year']);

        break;
    }
