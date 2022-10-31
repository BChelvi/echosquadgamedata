<?php

class GetSiteRooms {

    public static function run($id){

        $siteRooms=[];

        $db = Db :: singleton();

        $sql = "SELECT * FROM site INNER JOIN room ON (site.id=room.siteId) WHERE room.siteId=$id";
      
        $rooms= $db -> select_sql($sql);

        $sql2 = "SELECT * FROM site WHERE Id=$id";
      
        $site= $db -> select_sql($sql2);

        $siteRooms['Name']=$site[0]['Name'];
        $siteRooms['SiteId']=$site[0]['Id'];

        $siteRooms['rooms']=$rooms;

        echo json_encode($siteRooms);
        

    }
}