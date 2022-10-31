<?php

class GetRoomSessions {

    public static function run($id){

        $db = Db :: singleton();

        $sql = "SELECT * FROM room INNER JOIN roomsession ON (room.Id=roomsession.RoomId) WHERE room.Id=$id ORDER BY roomsession.EndDate DESC";
      
        global $sessions;

        $sessions= $db -> select_sql($sql);
             
        $sql2 = "SELECT * FROM room WHERE Id=$id";
        
        $room= $db -> select_sql($sql2);
        
        $RoomSessions['Name']=$room[0]['Name'];
        $RoomSessions['SiteId']=$room[0]['Id'];

        for ($i=0;$i<count($sessions);$i++){

            $RoomSessionId = $sessions[$i]['Id'];

            $sql3 = "SELECT * FROM gamesession WHERE RoomSessionId=$RoomSessionId ORDER BY EndDate DESC";

            $GameSessions= $db -> select_sql($sql3);

            $sessions[$i]['GameSession']=$GameSessions;
            
        }

        $RoomSessions['RoomSessions']=$sessions;
        
        echo json_encode($RoomSessions);
        
    }
}