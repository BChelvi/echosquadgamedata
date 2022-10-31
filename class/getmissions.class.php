<?php

class GetMissions {

    public static function run(){

        $missions=[];

        $db = Db :: singleton();

        $sql = "SELECT * FROM mission";
      
        $missions= $db -> select_sql($sql);


        echo json_encode($missions);
        
    }
}