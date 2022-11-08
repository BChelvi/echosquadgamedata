// --------------------------------------DECLARATIONS DE VARIABLES----------------------------------------------------------------

var tableau_Missions=[];

var tableau_RoomSessions=[];

var tableau_GameSessions=[];

var GameSessions_List = [];

var calendarEl = document.getElementById('calendar');

//variable indiquant si la case filtre durée mission est cochée ou non
var isFiltered =false;

//On récupère l'ID de la Room(Sous-Marin) dans l'url
var RoomId=location.hash.substring(1,10);

// --------------------------------------TEMPLATES----------------------------------------------------------------

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

var template_room =`<option value=%RoomId%>%RoomName% - %RoomId%</option>`



// --------------------------------------VARIABLES SURVEILLANT LES SELECTEURS----------------------------------------------------------------


//Changement du selecteur Room(Sous-Marin)
var RoomSelected = document.getElementById('RoomSelected');
RoomSelected.addEventListener('change', function() {   
    getRoom(RoomSelected.value);
})

//addEventListener permettant d'afficher ou non toutes les missions
var Nofilter = document.getElementById('nofilter');
Nofilter.addEventListener('change', function() {
   if(Nofilter.checked==true){
    isFiltered=true;   
    getRoom(RoomSelected.value)}
   else{      
       isFiltered=false;
       getRoom(RoomSelected.value);
    } })

// --------------------------------------FONCTION INITIE AU CHARGEMENT DE LA PAGE----------------------------------------------------------------

function initRoom(){
    liste_rooms();
    getAllRoom(SiteId);   
}

// --------------------------------------FONCTIONS AJAX REMPLISSANT LES VARIABLES----------------------------------------------------------------

function getRoom(RoomId){

    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getroom&RoomId="+RoomId;
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_RoomSessions = JSON.parse(httpRequest.responseText);       
        ShowCalendar();   
    };
    httpRequest.send();
}

function getAllRoom(SiteId){

    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getallroom&SiteId="+SiteId;
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_RoomSessions = JSON.parse(httpRequest.responseText);       
        ShowCalendar();   
    };
    httpRequest.send();
}

function FillTableauGameSessions(){
    tableau_GameSessions=[];
    for (var i=0;i<tableau_RoomSessions['RoomSessions'].length;i++){
        
        for (var j=0;j<tableau_RoomSessions['RoomSessions'][i]['GameSession'].length;j++){

            //variable qui calcule la durée d'une mission
      
            var MissionDuration = CalculMissionTime (tableau_RoomSessions['RoomSessions'][i]['GameSession'][j].StartDate,tableau_RoomSessions['RoomSessions'][i]['GameSession'][j].EndDate);

            //filtre les parties de durée inférieure à 10 min

            if (isFiltered==false){
                if(MissionDuration==false) continue;
                else tableau_GameSessions.push(tableau_RoomSessions['RoomSessions'][i]['GameSession'][j]);         
            }
            else
             tableau_GameSessions.push(tableau_RoomSessions['RoomSessions'][i]['GameSession'][j]);
        }
    }
    
}

// --------------------------------------FONCTIONS GERANTS DIFFERENTS BLOCS D'AFFICHAGE----------------------------------------------------------------

function ShowNbreGameSessions(){
    document.getElementById("NbreGameSessions").innerHTML=tableau_GameSessions.length;

}

function ShowGameSessions(){
    document.getElementById("RoomSessionsButton").classList.replace("btn-light","btn-dark");
    document.getElementById("GameSessionsButton").classList.replace("btn-dark","btn-light");
}

function ShowRoomSessions(){
    document.getElementById("GameSessionsButton").classList.replace("btn-light","btn-dark");
    document.getElementById("RoomSessionsButton").classList.replace("btn-dark","btn-light");
    
    alert("Vue RoomSessions")
}

function liste_rooms(){
    var tableau_rooms=JSON.parse(localStorage.getItem('site'));
  
    for (var i=0;i<tableau_rooms.length;i++){
        var html = template_room.replaceAll("%RoomName%",tableau_rooms[i].Name)
                                .replaceAll("%RoomId%",tableau_rooms[i].Id)
        const elt = document.createElement("option");
        document.getElementById("RoomSelected").appendChild(elt);
       
        elt.outerHTML = html;
        
    }
}

// -------------------------------------------------------------VUE CALENDRIER-------------------------------------------

//On remplie un tableau avec la syntaxe correspondant à 'events' de FullCalendar
function FillTGameSessions_List(){
    
    GameSessions_List=[];

    for (var i=0;i<tableau_GameSessions.length;i++){
        var tableau=[];
        switch (tableau_GameSessions[i].MissionId){
            case  1:
                tableau['title']="En eaux troubles(60min)";
                tableau['backgroundColor']="red";
            break;
            case  4:
                tableau['title']="En eaux troubles(45min)";
                tableau['backgroundColor']="green";
            break;
            case  2:
                tableau['title']="Battle";
                tableau['backgroundColor']="blue";
                tableau['textColor']='blue !important';
            break;
            case  3:
                tableau['title']="Teaser";
                tableau['backgroundColor']="black";
            break;
        } 
        tableau['id']=tableau_GameSessions[i].Id;
        tableau['start']=tableau_GameSessions[i].StartDate;
        tableau['end']=tableau_GameSessions[i].EndDate;
     
        GameSessions_List.push(tableau);       
    }    
}


//la fonction qui render le FullCalendar
function ShowCalendar(){

    document.getElementById("Site").innerHTML=tableau_RoomSessions['SiteName'];
    FillTableauGameSessions();
    ShowNbreGameSessions();
    FillTGameSessions_List();

    var Selected= document.getElementById("RoomDefault");
    Selected.innerHTML=tableau_RoomSessions.Name+" - "+tableau_RoomSessions.RoomId;
    Selected.value=tableau_RoomSessions.RoomId;

    var calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: '',   
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'today,dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        events: GameSessions_List,
        eventClick :  function(info) {
            localStorage.setItem('RoomName', tableau_RoomSessions.Name);
            document.location.href="./mission.html#"+info.event.id;
        }      
    });

    calendar.render();
    calendar.setOption('locale','fr');
    calendar.on('dateClick', function(info) {
        console.log('clicked on ' + info.dateStr);
    });
};


// -------------------------------------------------------------FONCTION DE CALCUL-------------------------------------------

//Fonction qui calcul si une mission à une durée supérieure ou non à 10 minutes
function CalculMissionTime(dateX,dateY){
    var datumX = Date.parse(dateX);
    var datumY = Date.parse(dateY);
    var diff = (datumY-datumX)/1000;

    if(diff>600){
        return true;
    }
    else return false;
}

