<?php

class GetRoom {

    public static function run($id){

        $db = Db :: singleton();

        $sql = "SELECT * FROM room INNER JOIN roomsession ON (room.Id=roomsession.RoomId) WHERE room.Id=$id ORDER BY roomsession.EndDate DESC";
      
        global $sessions;

        $sessions= $db -> select_sql($sql);
             
        $sql2 = "SELECT * FROM room WHERE Id=$id";
        
        $room= $db -> select_sql($sql2);
        
        $Room['Name']=$room[0]['Name'];
        $Room['RoomId']=$room[0]['Id'];

        $SiteId= $room[0]["SiteId"];

        $sql4 ="SELECT Name FROM site WHERE site.Id=$SiteId";

        $SiteName= $db -> select_sql($sql4);

        $Room['SiteName'] = $SiteName[0]['Name'];

        for ($i=0;$i<count($sessions);$i++){

            $RoomSessionId = $sessions[$i]['Id'];

            $sql3 = "SELECT * FROM gamesession WHERE RoomSessionId=$RoomSessionId ORDER BY EndDate DESC";

            $GameSessions= $db -> select_sql($sql3);

            for  ($j=0;$j<count($GameSessions);$j++){
                $GameSessions[$j]['RoomId']=$Room["RoomId"];
            }

            $sessions[$i]['GameSession']=$GameSessions;
            
        }

        $Room['RoomSessions']=$sessions;
        
        echo json_encode($Room);
        
    }
}