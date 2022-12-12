<?php

require './category.php';
require './credentials.php';

	// Create connection
	$servername = HOSTNAME;
	$username = USERNAME;
	$password = PASSWORD;
	
	try
	{
		$db = new PDO("mysql:host=$servername;dbname=gearprodqfdata", $username, $password);
	}
	catch(Exception $e)
	{
		die('Error : ' . $e->getMessage());
	}
	
	switch($_POST["MessageType"])
	{
		case "RoomLogin":
			$query = "INSERT INTO roomsession (RoomId,StartDate,EndDate,IsActive) VALUES (" . $_POST["RoomId"] . ", '" . $_POST["StartDate"] . "', NULL, 1)";
			$preparedQuery = $db->prepare($query);
			$preparedQuery->execute();
			
			$query = "SELECT * FROM roomsession WHERE RoomId = " . $_POST["RoomId"] . " AND StartDate = '" . $_POST["StartDate"] . "'";
			$preparedQuery = $db->prepare($query);
			$preparedQuery->execute();
			$data = $preparedQuery->fetchAll(PDO::FETCH_ASSOC);
			echo $data[0]['roomsessionId'];
			break;
			
		case "RoomLogout":
			$query = "UPDATE roomsession SET EndDate = '" . $_POST["EndDate"] . "', IsActive = 0 WHERE roomsessionId = " . $_POST["Id"];
			$preparedQuery = $db->prepare($query);
			$preparedQuery->execute();
			break;
		
		case "GameLogin":
			$query = "INSERT INTO gamesession (RoomSessionId,StartDate,EndDate,MissionId,Language,IsActive) VALUES (" . $_POST["RoomSessionId"] . ", '" . $_POST["StartDate"] . "', NULL, " . $_POST["MissionId"] . ", '" . $_POST["Language"] . "', 1)";
			$preparedQuery = $db->prepare($query);
			$preparedQuery->execute();
			
			$query = "SELECT gamesessionId FROM gamesession WHERE RoomSessionId = " . $_POST["RoomSessionId"] . " AND StartDate = '" . $_POST["StartDate"] . "'";
			$preparedQuery = $db->prepare($query);
			$preparedQuery->execute();
			$data = $preparedQuery->fetchAll(PDO::FETCH_ASSOC);
			echo $data[0]['gamesessionId'];
			break;
			
		case "GameLogout":

				//on verifie si la gamesession possède déja ou non une EndDate
				$queryEndDate ="SELECT EndDate FROM gamesession WHERE gamesession.gamesessionId = " . $_POST["Id"];
				$preparedQueryEndDate = $db->prepare($queryEndDate);
				$preparedQueryEndDate->execute();
				$EndDate = $preparedQueryEndDate->fetchAll(PDO::FETCH_ASSOC)[0]['EndDate'];
	
				if($EndDate==null){
	
				//on récupère le DateTime de la gamesession
				$queryStartDate ="SELECT StartDate FROM gamesession WHERE gamesession.gamesessionId = " . $_POST["Id"];
				$preparedStartDate = $db->prepare($queryStartDate);
				$preparedStartDate->execute();
				$StartDate = $preparedStartDate->fetchAll(PDO::FETCH_ASSOC)[0]['StartDate'];
	
				//on calcule la durée de la mission
				$Duration = strtotime($_POST["EndDate"])-strtotime($StartDate);
	
				//on récupère les données aglomérées des 'events' DEATH correspond à l'Id de la gamesession
				$DEATH = getCountData(DEATH,$_POST["Id"]);
				
				//on récupère les données aglomérées des 'events' RED_BUTTON correspond à l'Id de la gamesession
				$RED_BUTTON = getCountData(RED_BUTTON,$_POST["Id"]);
				
				//on met à jour la gamesession dans la BDD
				$query = "UPDATE gamesession SET EndDate = '" . $_POST["EndDate"] . "', IsActive = 0,  Duration = $Duration, Succes=". $_POST["Succes"] .", Deaths=$DEATH,RedButtons=$RED_BUTTON WHERE gamesessionId = " . $_POST["Id"];
				$preparedQuery = $db->prepare($query);
				$preparedQuery->execute();
				}
				break;
			
		case "GameEvent":
			$values = explode(",", $_POST["Values"]);
			$query = "INSERT INTO gameevent (GamesessionId,DateTime,WorldPosition,Category,Value_1,Value_2,Value_3) VALUES (" . $_POST["GameSessionId"] . ", '" . $_POST["DateTime"] . "', '" . $_POST["WorldPosition"] . "', '" . $_POST["Category"] . "', '" . $values[0] . "', '" . $values[1] . "', '" . $values[2] . "')";
			$preparedQuery = $db->prepare($query);
			$preparedQuery->execute();
			echo $_POST["Values"];
			break;
	}

	//fonction qui compte le nombre d'Events d'une category -$data- correspondant à l'id -$id- de la gamesession
	function getCountData($data,$id){
	global $db;
	$query ="SELECT COUNT(*)FROM gameevent WHERE GameSessionId = $id AND Category = ".$data;
	$prepared = $db->prepare($query);
	$prepared->execute();
	$count = $prepared->fetchAll(PDO::FETCH_ASSOC)[0]["COUNT(*)"];
	return $count;

};

	
	//http_response_code(205);
?>
