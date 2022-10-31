<?php

class GetRoomSessions {

    public static function run($id){

        $db = Db :: singleton();

        $sql = "SELECT * FROM room INNER JOIN roomsession ON (room.Id=roomsession.RoomId) WHERE room.Id=$id";
      
        $sessions= $db -> select_sql($sql);


        
        $sql2 = "SELECT * FROM room WHERE Id=$id";
        
        $room= $db -> select_sql($sql2);
        
        $RoomSessions['Name']=$room[0]['Name'];
        $RoomSessions['SiteId']=$room[0]['Id'];
        
        $RoomSessions['RoomSessions']=$sessions;
        
        
        foreach ($RoomSessions['RoomSessions'] as $Session){
            
            $SessionId=$Session['Id'];
            
            
            $sql3 ="SELECT * FRom gamesession Where RoomSessionId=$SessionId";
            $GameSessions = $db -> select_sql($sql3);
           
            array_push( $Session,[1,2,3]);
           

        }
        echo json_encode($RoomSessions);
        
    }
}