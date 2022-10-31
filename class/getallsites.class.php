<?php

class GetAllSites {

    public static function run(){
        $db = Db :: singleton();
      
        $allgamesession = $db -> SelectAll('site');

        

        echo json_encode($allgamesession);

    }
}