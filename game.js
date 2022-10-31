var RoomSessionId=location.hash.substring(1,10);

function initGame(){
    getGameSession(RoomSessionId);
    
}

function getGameSession(id){
    console.log(id);
    document.getElementById("GameSessionId").innerHTML=RoomSessionId;
}