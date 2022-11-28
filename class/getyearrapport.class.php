<?php

class GetYearRapport {

    public static function run($SiteId,$Year){

      //on crée les variable pour l'intervale de temps du filtre
      $MyDate = "".$Year."-01-01";
      $DateFin = date('Y-m-d',strtotime('+1 year',strtotime($MyDate)));
      
      //on instencie notre objet de connexion
      $db = Db :: singleton();
     
      //on récupère tous les Id de missions
      $sql =" SELECT Id,MinDuration FROM mission WHERE mission.DisplayInCalendar=1";

      $Missions = $db -> select_sql($sql);
    
      for ($i=0;$i<count($Missions);$i++){
            $MissionId=$Missions[$i]['Id'];
            $sql2 = "SELECT RoomId,Duration,Succes from gamesession INNER JOIN roomsession ON (gamesession.roomsessionId = roomsession.Id) INNER JOIN room on (roomsession.RoomId=room.Id) INNER JOIN site on (room.SiteId=site.Id) WHERE site.Id = $SiteId AND roomsession.StartDate >='$MyDate' AND roomsession.StartDate < '$DateFin' AND gamesession.MissionId=$MissionId";

            $Missions[$i]['RoomId']= $db -> select_sql($sql2);
      
        }

        //     $Missions[$i]['score']=[];

        //     $MissionId=$Missions[$i]['Id'];

        //     $MinDuration=$Missions[$i]['MinDuration'];

        //     $sql2 = "SELECT Succes FROM gamesession INNER JOIN roomsession ON (gamesession.roomsessionId = roomsession.Id) INNER JOIN room on (roomsession.RoomId=room.Id) INNER JOIN site on (room.SiteId=site.Id) WHERE site.Id = $SiteId AND roomsession.StartDate >='$MyDate' AND roomsession.StartDate < '$DateFin' AND gamesession.MissionId=$MissionId AND gamesession.Duration>=$MinDuration";
            
        //     $Succes = $db -> select_sql($sql2);

        //     for ($j=0;$j<count($Succes);$j++){
        //         array_push($Missions[$i]['score'],$Succes[$j]['Succes']);
        //     }
        // }

        // for ($i=0;$i<count($Missions);$i++){

        //     $Missions[$i]['duration']=[];

        //     $MissionId=$Missions[$i]['Id'];

        //     $sql3 = "SELECT Duration FROM gamesession INNER JOIN roomsession ON (gamesession.roomsessionId = roomsession.Id) INNER JOIN room on (roomsession.RoomId=room.Id) INNER JOIN site on (room.SiteId=site.Id) WHERE site.Id = $SiteId AND roomsession.StartDate >='$MyDate' AND roomsession.StartDate < '$DateFin' AND gamesession.MissionId=$MissionId AND gamesession.Duration>=$MinDuration";
            
        //     $Duration = $db -> select_sql($sql3);

        //     for ($j=0;$j<count($Duration);$j++){
        //         array_push($Missions[$i]['duration'],$Duration[$j]['Duration']);
        //     }
        // }
        
    echo json_encode($Missions);

    }
}