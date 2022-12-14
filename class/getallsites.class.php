<?php

class GetAllSites {

    public static function run(){
        $db = Db :: singleton();
      
        //on récupère toutes les DATAS de la table Site
        $allsites = $db -> SelectAll('site');

        echo json_encode($allsites);

    }
}