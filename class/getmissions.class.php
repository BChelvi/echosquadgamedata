<?php

class GetMissions {

    public static function run(){

        $db = Db :: singleton();

        $sql =" SELECT * FROM mission WHERE mission.DisplayInCalendar = 1";

        $Missions = $db -> select_sql($sql);

        echo json_encode($Missions);
        
    }
}