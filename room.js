var tableau_Missions=[];

var tableau_RoomSessions=[];

var tableau_GameSessions=[];


var template_Missions=`                                         
                      <div class="text-center col-3">%MissionName%</div>
                    `;

var template_RoomSessions=`
                        <div class="d-flex justify-content-between my-2 GameSession">                                    
                            <div class="text-center col-2">%SessionId%</div>
                            <div class="text-center col-2">%StartDate%</div>
                            <div class="text-center col-2">%EndDate%</div>
                            <div class="text-center col-2">%IsActive%</div>
                            <button class="text-center col-2" onclick="ShowGames(%SessionId%)">Voir les parties</button>
                        </div>
                            <div class="d-none" id="%SessionId%">
                  `;

var template_GameSessions=`
                  <div class="d-flex justify-content-between my-2 GameSession">                                    
                      <div class="text-center col-2">%SessionId%</div>
                      <div class="text-center col-2">%StartDate%</div>
                      <div class="text-center col-2">%EndDate%</div>
                      <div class="text-center col-2">%IsActive%</div>
                      <div class="text-center col-2">%MissionId%</div>
                  </div>
            `;

var RoomId=location.hash.substring(1,10);



// var MissionSelect = document.getElementById('MissionSelect')
// MissionSelect.addEventListener('change', function() {
    
   
// })


function initRoom(){
    getRoomSession(RoomId);
    
}

function getRoomSession(RoomId){
    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getroomsessions&RoomId="+RoomId;
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_RoomSessions = JSON.parse(httpRequest.responseText);
        console.log(tableau_RoomSessions);
        Showtableau_RoomSessions();
        Showtableau_GameSessions();   
    };
    httpRequest.send();
}

function Showtableau_RoomSessions(){

    document.getElementById("RoomId").innerHTML=tableau_RoomSessions['SiteId'];

    document.getElementById("RoomName").innerHTML=tableau_RoomSessions['Name'];

    document.getElementById("RoomSessions").innerHTML="";

    ShowNbreGameSessions();

    document.getElementById("NbreGameSessionsMonth").innerHTML="";

    document.getElementById("NbreGameSessionsDay").innerHTML="";
    
    for (let i = 0; i < tableau_RoomSessions['RoomSessions'].length; i++) {

        var html = template_RoomSessions
            .replaceAll("%SessionId%", tableau_RoomSessions['RoomSessions'][i].Id)
            .replaceAll("%StartDate%", tableau_RoomSessions['RoomSessions'][i].StartDate)
            .replaceAll("%EndDate%", tableau_RoomSessions['RoomSessions'][i].EndDate)
            .replaceAll("%IsActive%", tableau_RoomSessions['RoomSessions'][i].IsActive)
        
            var elt = document.createElement("div");
            document.getElementById("RoomSessions").appendChild(elt);
            elt.outerHTML = html;  
    
    } 
}

function FillTableauGameSessions(){
    for (var i=0;i<tableau_RoomSessions['RoomSessions'].length;i++){
        
        for (var j=0;j<tableau_RoomSessions['RoomSessions'][i]['GameSession'].length;j++){
            tableau_GameSessions.push(tableau_RoomSessions['RoomSessions'][i]['GameSession'][j]);
        }
    }
    console.log(tableau_GameSessions);
}

function Showtableau_GameSessions(){

    document.getElementById("RoomId").innerHTML=tableau_RoomSessions['SiteId'];

    document.getElementById("RoomName").innerHTML=tableau_RoomSessions['Name'];

    document.getElementById("GameSessions").innerHTML="";

    document.getElementById("NbreGameSessionsMonth").innerHTML="";
    
    document.getElementById("NbreGameSessionsDay").innerHTML="";
    
    FillTableauGameSessions();
    
    ShowNbreGameSessions();

    for (let i = 0; i < tableau_GameSessions.length; i++) {

        var html = template_GameSessions
            .replaceAll("%SessionId%", tableau_GameSessions[i].Id)
            .replaceAll("%StartDate%", tableau_GameSessions[i].StartDate)
            .replaceAll("%EndDate%", tableau_GameSessions[i].EndDate)
            .replaceAll("%IsActive%", tableau_GameSessions[i].IsActive)
            .replaceAll("%MissionId%", tableau_GameSessions[i].MissionId)
        
            var elt = document.createElement("div");
            document.getElementById("GameSessions").appendChild(elt);
            elt.outerHTML = html;  
    } 
}  


function getMissions(){
    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getmissions";
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_Missions = JSON.parse(httpRequest.responseText);
        console.log(tableau_Missions);   
    };
    httpRequest.send();
}


function ToGame(id){
    document.location.href="./game.html#"+id; 
}

function ShowNbreGameSessions(){
    document.getElementById("NbreGameSessions").innerHTML=tableau_GameSessions.length;

}

function ShowGames(id){

    document.getElementById(id).classList.replace("d-none","d-flex");
    document.getElementById(id).innerHTML=id;
    console.log(id);
}

function ShowGameSessions(){
    document.getElementById("GameSessionsButton").classList.add("border");
}

function ShowRoomSessions(){
    document.getElementById("RoomSessionsButton").classList.add("border");
}