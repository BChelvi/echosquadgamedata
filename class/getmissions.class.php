<?php

class GetMissions {

    public static function run(){

        $db = Db :: singleton();

        $sql =" SELECT * FROM mission";

        $Missions = $db -> select_sql($sql);

        echo json_encode($Missions);
        
    }
}