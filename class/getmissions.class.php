<?php

class GetMissions {

    public static function run(){

        $db = Db :: singleton();

        //on récupère toutes les datas des missions de la table MISSION qui ont DisplayInCalendar set à 1
        $sql =" SELECT * FROM mission WHERE mission.DisplayInCalendar = 1";

        $Missions = $db -> select_sql($sql);

        echo json_encode($Missions);
        
    }
}