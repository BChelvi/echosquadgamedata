<?php
	// Create connection
	$servername = "gearprodqfdata.mysql.db";
	$username = "gearprodqfdata";
	$password = "Leviathan20";
	
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
			$query = "INSERT INTO roomsession VALUES (0, " . $_POST["RoomId"] . ", '" . $_POST["StartDate"] . "', NULL, 1)";
			$preparedQuery = $db->prepare($query);
			$preparedQuery->execute();
			
			$query = "SELECT Id FROM roomsession WHERE RoomId = " . $_POST["RoomId"] . " AND StartDate = '" . $_POST["StartDate"] . "'";
			$preparedQuery = $db->prepare($query);
			$preparedQuery->execute();
			$data = $preparedQuery->fetchAll();
			echo $data[0][0];
			break;
			
		case "RoomLogout":
			$query = "UPDATE roomSession SET EndDate = '" . $_POST["EndDate"] . "', IsActive = 0 WHERE Id = " . $_POST["Id"];
			$preparedQuery = $db->prepare($query);
			$preparedQuery->execute();
			break;
		
		case "GameLogin":
			$query = "INSERT INTO gamesession VALUES (0, " . $_POST["RoomSessionId"] . ", '" . $_POST["StartDate"] . "', NULL, " . $_POST["MissionId"] . ", '" . $_POST["Language"] . "', 1)";
			$preparedQuery = $db->prepare($query);
			$preparedQuery->execute();
			
			$query = "SELECT Id FROM gamesession WHERE RoomSessionId = " . $_POST["RoomSessionId"] . " AND StartDate = '" . $_POST["StartDate"] . "'";
			$preparedQuery = $db->prepare($query);
			$preparedQuery->execute();
			$data = $preparedQuery->fetchAll();
			echo $data[0][0];
			break;
			
		case "GameLogout":

			//on verifie si la gamesession possède déja ou non une EndDate
			$query2 ="SELECT EndDate FROM gamesession WHERE gamessession.Id = " . $_POST["Id"];
			$preparedQuery2 = $db->prepare($query2);
			$preparedQuery2->execute();
			$EndDate = $preparedQuery2->fetchAll()[0][0];

			if($EndDate==null){
			$query = "UPDATE gamesession SET EndDate = '" . $_POST["EndDate"] . "', IsActive = 0 WHERE Id = " . $_POST["Id"];
			$preparedQuery = $db->prepare($query);
			$preparedQuery->execute();
			}
			break;
			
		case "GameEvent":
			$values = explode(",", $_POST["Values"]);
			$query = "INSERT INTO gameevent VALUES (0, " . $_POST["GameSessionId"] . ", '" . $_POST["DateTime"] . "', '" . $_POST["WorldPosition"] . "', '" . $_POST["Category"] . "', '" . $values[0] . "', '" . $values[1] . "', '" . $values[2] . "')";
			$preparedQuery = $db->prepare($query);
			$preparedQuery->execute();
			echo $_POST["Values"];
			break;
	}
	
	//http_response_code(205);
?>
