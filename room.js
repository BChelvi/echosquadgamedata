var tableau_Missions=[];

var tableau_RoomSessions=[];


var template_Missions=`                                         
                      <div class="text-center col-3">%MissionName%</div>
                    `;

var template_Sessions=`
                        <div class="d-flex justify-content-between my-2 GameSession" onclick="ToGame(%SessionId%)">                                    
                            <div class="text-center col-3">%SessionId%</div>
                            <div class="text-center col-3">%StartDate%</div>
                            <div class="text-center col-3">%EndDate%</div>
                            <div class="text-center col-3">%IsActive%</div>
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
    };
    httpRequest.send();
}

function Showtableau_RoomSessions(){

    document.getElementById("RoomId").innerHTML=tableau_RoomSessions['SiteId'];

    document.getElementById("RoomName").innerHTML=tableau_RoomSessions['Name'];

    document.getElementById("Sessions").innerHTML="";

    ShowNbreGameSessions();

    document.getElementById("NbreGameSessionsMonth").innerHTML="";

    document.getElementById("NbreGameSessionsDay").innerHTML="";
    
    for (let i = 0; i < tableau_RoomSessions['RoomSessions'].length; i++) {

        var html = template_Sessions
            .replaceAll("%SessionId%", tableau_RoomSessions['RoomSessions'][i].Id)
            .replaceAll("%StartDate%", tableau_RoomSessions['RoomSessions'][i].StartDate)
            .replaceAll("%EndDate%", tableau_RoomSessions['RoomSessions'][i].EndDate)
            .replaceAll("%IsActive%", tableau_RoomSessions['RoomSessions'][i].IsActive)
        
            var elt = document.createElement("div");
            document.getElementById("Sessions").appendChild(elt);
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
    document.getElementById("NbreGameSessions").innerHTML="";
}

