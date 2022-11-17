<?php

class GetAllRooms {

    public static function run($id,$date){
     
        //on crée les variable pour l'intervale de temps du filtre,l'équivalent de 3 mois

        $datePlusTrois= date('Y-m-d',strtotime('+3 month',strtotime($date)));
        $dateMoinsDeux= date('Y-m-d',strtotime('-2 month',strtotime($date)));

        $db = Db :: singleton();

        $sql =" SELECT room.Id,room.Name,room.color FROM site INNER JOIN room ON (site.Id=room.SiteId) WHERE site.Id = $id";

        $Site = $db -> select_sql($sql);

        for ($i=0;$i<count($Site);$i++){

            $RoomId = $Site[$i]['Id'];

            $sql2 = "SELECT roomsession.Id,roomsession.StartDate FROM room INNER JOIN roomsession ON (room.Id=roomsession.RoomId) WHERE room.Id = $RoomId AND roomsession.StartDate >='$dateMoinsDeux' AND roomsession.StartDate < '$datePlusTrois'";
            
            //Toutes les roomsessions correspondant à toutes les Salles d'un seul Site
            $AllRoomSessions= $db -> select_sql($sql2);

            //On filtre les roomsession par date

            // $RoomSessions=[];

            // for ($l=0;$l<count($AllRoomSessions);$l++){
               
            //     if(substr($AllRoomSessions[$l]['StartDate'],0,7)==$date) 
            //     { array_push($RoomSessions,$AllRoomSessions[$l]);}

            // }
          
            $Site[$i]['RoomSessions']=$AllRoomSessions;

            $Site[$i]['date']=$date;



            //On associe les gamesessions aux roomsessions

            for ($j=0;$j<count($Site[$i]['RoomSessions']);$j++){

                $RoomSessionId = $Site[$i]['RoomSessions'][$j]['Id'];

                $sql3 ="SELECT * FROM roomsession INNER JOIN gamesession ON (roomsession.Id = gamesession.RoomSessionId) WHERE roomsessionId = $RoomSessionId";

                $GameSessions = $db -> select_sql($sql3);

                for  ($k=0;$k<count($GameSessions);$k++){
                    $GameSessions[$k]['RoomColor']=$Site[$i]['color'];
                }

                $Site[$i]['RoomSessions'][$j]['GameSessions']=$GameSessions;
            }
        }

        echo json_encode($Site);
        
    }
}