// --------------------------------------DECLARATIONS DE VARIABLES----------------------------------------------------------------

var tableau_Missions=[];

var tableau_AllRooms=[];

var tableau_RoomSessions=[];

var tableau_GameSessions=[];

var GameSessions_List = [];

var calendarEl = document.getElementById('calendar');

//variable indiquant si la case filtre durée mission est cochée ou non
var isFiltered =false;

//On récupère l'ID de la Room(Sous-Marin) dans l'url
var SiteId=location.hash.substring(1,10);


//variable qui check si la liste des Rooms a déja injectée afin d'eivter un remplissage a chaque itération
var listeRoomOn=false;

// --------------------------------------TEMPLATES----------------------------------------------------------------

var template_room =`<option value=%RoomId%>%RoomName% - %RoomId%</option>`

// --------------------------------------VARIABLES SURVEILLANT LES SELECTEURS----------------------------------------------------------------


//Changement du selecteur Room(Sous-Marin)
var RoomSelected = document.getElementById('RoomSelected');
RoomSelected.addEventListener('change', function() {  
    
    if(RoomSelected.value!='Toutes')
        getRoom(RoomSelected.value);
    else(
        getAllRoom(SiteId) 
    )
})

//addEventListener permettant d'afficher ou non toutes les missions
var Nofilter = document.getElementById('nofilter');
Nofilter.addEventListener('change', function() {
   if(Nofilter.checked==true){

        if(RoomSelected.value!='Toutes'){
            isFiltered=true;
            getRoom(RoomSelected.value)
        }
        else{
            isFiltered=true;
            getAllRoom(SiteId)
        }
   }   
    else{
        if(RoomSelected.value!='Toutes'){      
            isFiltered=false;
            getRoom(RoomSelected.value);
        }
        else{
            isFiltered=false;
            getAllRoom(SiteId)
        }
    }
})

// --------------------------------------FONCTION INITIE AU CHARGEMENT DE LA PAGE----------------------------------------------------------------

function initSite(){
    getMissions();
    getAllRoom(SiteId);   
}

// --------------------------------------FONCTIONS AJAX REMPLISSANT LES VARIABLES----------------------------------------------------------------


function getMissions(){
    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getmissions";
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_Missions = JSON.parse(httpRequest.responseText);   
    };
    httpRequest.send();
}

function getRoom(RoomId){

    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getroom&RoomId="+RoomId;
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_RoomSessions = JSON.parse(httpRequest.responseText);
        FillTableauGameSessions();
        FillGameSessions_List();   
        ShowCalendar();   
        ShowNbreGameSessions();
    };
    httpRequest.send();
}

function getAllRoom(SiteId){

    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getallrooms&SiteId="+SiteId;
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_AllRooms = JSON.parse(httpRequest.responseText);
        liste_rooms();
        FillTableau_AllGameSessions();
        FillGameSessions_List();   
        ShowCalendar();   
        ShowNbreGameSessions();
    };
    httpRequest.send();

}

function FillTableauGameSessions(){
    tableau_GameSessions=[];
    
    for (var i=0;i<tableau_RoomSessions['RoomSessions'].length;i++){
        
        for (var j=0;j<tableau_RoomSessions['RoomSessions'][i]['GameSession'].length;j++){
            console.log(tableau_RoomSessions['RoomSessions'][i]);
            if (isFiltered==false){
                if(CaclculMinDuration(tableau_RoomSessions['RoomSessions'][i]['GameSession'][j].Duration,600)){
                    tableau_GameSessions.push(tableau_RoomSessions['RoomSessions'][i]['GameSession'][j]);
                }
                else continue;
            }
            else {
                tableau_GameSessions.push(tableau_RoomSessions['RoomSessions'][i]['GameSession'][j]);
            }
        }
    }
    
}

function FillTableau_AllGameSessions(){
    tableau_GameSessions=[];
  
    for (var i=0;i<tableau_AllRooms.length;i++){
        
        for (var j=0;j<tableau_AllRooms[i]['RoomSessions'].length;j++){
      
            for (var k=0 ; k<tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'].length;k++){

            var duration = tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'][k].Duration;

                if (isFiltered==false){
                    if(CaclculMinDuration(duration,600)){
                        tableau_GameSessions.push(tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'][k]);
                    }
                    else continue;
                }
                else {
                    tableau_GameSessions.push(tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'][k]);
                }
            }   
        }
        
    }
}
// --------------------------------------FONCTIONS GERANTS DIFFERENTS BLOCS D'AFFICHAGE----------------------------------------------------------------

function ShowNbreGameSessions(){
    document.getElementById("NbreGameSessions").innerHTML=tableau_GameSessions.length;

}

function liste_rooms(){
    var SiteName = localStorage.getItem('SiteName');
    document.getElementById("Site").innerHTML=SiteName;

    if(listeRoomOn==false){
        for (var i=0;i<tableau_AllRooms.length;i++){
            var html = template_room.replaceAll("%RoomName%",tableau_AllRooms[i].Name)
                                    .replaceAll("%RoomId%",tableau_AllRooms[i].Id)
            const elt = document.createElement("option");
            document.getElementById("RoomSelected").appendChild(elt);       
            elt.outerHTML = html;        
        }
        listeRoomOn=true;
    }
}

function ShowNbreGameSessions(){
    document.getElementById("NbreGameSessions").innerHTML=tableau_GameSessions.length;

}

// -------------------------------------------------------------VUE CALENDRIER-------------------------------------------

//On remplie un tableau avec la syntaxe correspondant à 'events' de FullCalendar
function FillGameSessions_List(){
    
    GameSessions_List=[];

    console.log(tableau_GameSessions)
    for (var i=0;i<tableau_GameSessions.length;i++){
        var tableau=[];
       
        var min = calculMinute(tableau_GameSessions[i].Duration)

        switch (tableau_GameSessions[i].RoomId){

            case 348300 :
                tableau['backgroundColor'] = "blue";
            break;
            
            case 348301 :
                tableau['backgroundColor'] = "red";
            break;

            case 348307 :
                tableau['backgroundColor'] = "green";
            break;

            case 3483012 :
                tableau['backgroundColor'] = "black";
            break;

        }
        switch (tableau_GameSessions[i].MissionId){
            case 1 :
                tableau['title']=tableau_Missions[1].CodeName+" "+min;
            break;
            case 2 :
                tableau['title']=tableau_Missions[2].CodeName+" "+min;
            case 3 :
                tableau['title']=tableau_Missions[3].CodeName+" "+min;
            break;
            case 4 :
                tableau['title']=tableau_Missions[4].CodeName+" "+min;
            break;
        }
 
        tableau['id']=tableau_GameSessions[i].Id;
        tableau['start']=tableau_GameSessions[i].StartDate;
        tableau['end']=tableau_GameSessions[i].EndDate;
        tableau['description']="test";
     
        GameSessions_List.push(tableau);       
    }    
}


//la fonction qui render le FullCalendar
function ShowCalendar(){

    var calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: '',   
        initialView: 'dayGridMonth',
        firstDay:1,
        height:'auto',
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'today,dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        buttonText:{
            today:"Aujourd'hui",
            month:"Mois",
            week:"Semaine",
            day:"Jour",
            list:"liste",
        },
        events: GameSessions_List,
        eventClick :  function(info) {
            localStorage.setItem('RoomName', tableau_RoomSessions.Name);
            document.location.href="./mission.html#"+info.event.id;
        },
        eventRender: function(event, element) {
            element.children().last().append(event.description);}      
    });
  

    calendar.render();
    calendar.setOption('locale','fr');
    calendar.on('dateClick', function(info) {
        console.log('clicked on ' + info.dateStr);
    });
};


function CaclculMinDuration(DateX,DateY){
    var datumX = Date.parse(DateX);
    var datumY = Date.parse(DateY);

    if(datumX>datumY){
        return true;
    }
    else return false;
}

function calculMinute(secondes){
    var minutes = Math.floor(secondes / 60);
    var seconds = secondes - (minutes*60);
    timestring = minutes.toString().padStart(2, '0') + 'min' +
    seconds.toString().padStart(2, '0');

    return timestring;
}