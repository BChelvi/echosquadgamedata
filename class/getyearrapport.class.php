<?php

class GetYearRapport {

    public static function run($SiteId,$Year){

      //on crée les variable pour l'intervale de temps du filtre
      $MyDate = "".$Year."-01-01";
      $DateFin = date('Y-m-d',strtotime('+1 year',strtotime($MyDate)));
      
      //on instencie notre objet de connexion
      $db = Db :: singleton();
     
      //on récupère tous les Id de missions
      $sql =" SELECT missionId,MinDuration FROM mission WHERE mission.DisplayInCalendar=1";

      $Missions = $db -> select_sql($sql);
    
      for ($i=0;$i<count($Missions);$i++){
            $MissionId=$Missions[$i]['missionId'];
            $sql2 = "SELECT room.roomId,gamesession.Duration,gamesession.Succes from gamesession INNER JOIN roomsession ON (gamesession.roomsessionId = roomsession.roomsessionId) INNER JOIN room on (roomsession.RoomId=room.roomId) INNER JOIN site on (room.SiteId=site.siteId) WHERE site.siteId = $SiteId AND roomsession.StartDate >='$MyDate' AND roomsession.StartDate < '$DateFin' AND gamesession.MissionId=$MissionId";

            $Missions[$i]['RoomId']= $db -> select_sql($sql2);
      
        }
        
    echo json_encode($Missions);

    }
}