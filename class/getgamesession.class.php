<?php

require (  __DIR__. './../category.php');

class GetGameSession {

    public static function run($id){

        $mission=[];

        $db = Db :: singleton();

        $sql ="SELECT * FROM gamesession WHERE gamesession.gamesessionId=$id";

        $mission= $db -> select_sql($sql);

        $sql2 ="SELECT room.Name,room.roomId FROM gamesession INNER JOIN roomsession ON (gamesession.RoomSessionId = roomsession.roomsessionId) INNER JOIN room ON (roomsession.RoomId=room.roomId) INNER JOIN mission ON (gamesession.MissionId=mission.missionId) WHERE gamesession.gamesessionId=$id ";

        $Room = $db -> select_sql($sql2)[0];

        $mission[0]["Room"]= $Room;

        $RoomName=$Room['Name'];

        $sql3 ="SELECT site.Name,site.siteId FROM room INNER JOIN site ON (room.SiteId=site.siteId) WHERE room.Name='$RoomName'";

        $SiteName = $db -> select_sql($sql3)[0]['Name'];

        $SiteId = $db -> select_sql($sql3)[0]['siteId'];

        $mission[0]["SiteName"] = $SiteName;
        $mission[0]["SiteId"] = $SiteId;

        $sql4="SELECT * FROM gameevent INNER JOIN gamesession ON (gamesession.gamesessionId=gameevent.GameSessionId) WHERE gamesession.gamesessionId=$id";

        $events = $db -> select_sql($sql4);

        $mission[0]["events"] = $events;

        $sql6="SELECT WorldPosition, Value_1 FROM gameevent INNER JOIN gamesession ON (gamesession.gamesessionId=gameevent.GameSessionId) WHERE gamesession.gamesessionId='$id' AND gameevent.Category=".POS_MIN;

        $trajet = $db -> select_sql($sql6);

        $mission[0]['trajet'] = $trajet;
        
        $MissionName = $mission[0]['MissionId'];

        $sql5="SELECT Name,Dimension FROM mission WHERE mission.missionId=$MissionName";

        $mission[0]['MissionName'] = $db -> select_sql($sql5)[0]['Name'];

        $mission[0]['Dimension'] = $db -> select_sql($sql5)[0]['Dimension'];

        echo json_encode($mission[0]);
        
    }
}