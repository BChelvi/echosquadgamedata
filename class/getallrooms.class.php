<?php

class GetAllRooms {

    public static function run($id){

        $db = Db :: singleton();

        $sql =" SELECT room.Id,room.Name FROM site INNER JOIN room ON (site.Id=room.SiteId) WHERE site.Id = $id";

        $Site = $db -> select_sql($sql);

        for ($i=0;$i<count($Site);$i++){

            $RoomId = $Site[$i]['Id'];

            $sql2 = "SELECT roomsession.Id FROM room INNER JOIN roomsession ON (room.Id=roomsession.RoomId) WHERE room.Id = $RoomId";

            $RoomSessions= $db -> select_sql($sql2);

            $Site[$i]['RoomSessions']=$RoomSessions;

            for ($j=0;$j<count($Site[$i]['RoomSessions']);$j++){

                $RoomSessionId = $Site[$i]['RoomSessions'][$j]['Id'];

                $sql3 ="SELECT * FROM roomsession INNER JOIN gamesession ON (roomsession.Id = gamesession.RoomSessionId) WHERE roomsessionId = $RoomSessionId";

                $GameSessions = $db -> select_sql($sql3);

                $Site[$i]['RoomSessions'][$j]['GameSessions']=$GameSessions;
            }
        }

        echo json_encode($Site);
        
    }
}