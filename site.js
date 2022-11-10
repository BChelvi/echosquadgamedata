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

// --------------------------------------TEMPLATES----------------------------------------------------------------

var template_room =`<option value=%RoomId% style="color:%RoomColor%" data-color="%RoomColor%">%RoomName% - %RoomId%</option>`

// --------------------------------------VARIABLES SURVEILLANT LES SELECTEURS----------------------------------------------------------------

//Changement du selecteur Room(Sous-Marin)
var RoomSelected = document.getElementById('RoomSelected');


//addEventListener permettant d'afficher ou non toutes les missions
var Nofilter = document.getElementById('nofilter');

// --------------------------------------FONCTION INITIE AU CHARGEMENT DE LA PAGE----------------------------------------------------------------

function initSite(){
    getMissions();
    getAllRoom(SiteId);   
}

// --------------------------------------FONCTIONS AJAX REMPLISSANT LES VARIABLES----------------------------------------------------------------

//function ajax qui récupère la table Mission
function getMissions(){
    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getmissions";
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_Missions = JSON.parse(httpRequest.responseText);   
    };
    httpRequest.send();
}

//function ajax qui récupère toutes les Rooms d'un Site Unique avec les gamesessions y correspondant
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

//function qui remplie un tableau avec les gamessesions à afficher celon les différents filtres
function FillTableau_AllGameSessions(){
    tableau_GameSessions=[];
    
    for (var i=0;i<tableau_AllRooms.length;i++){
       
        //filtre sur le selecteur de Salle
        if(!RoomFilter(tableau_AllRooms[i].Id)) continue;

        else{
        
            for (var j=0;j<tableau_AllRooms[i]['RoomSessions'].length;j++){
        
                for (var k=0 ; k<tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'].length;k++){

                var duration = tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'][k].Duration;

                    //filtre sur la durée de la mission
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
}
// --------------------------------------FONCTIONS GERANTS DIFFERENTS BLOCS D'AFFICHAGE----------------------------------------------------------------

function ShowNbreGameSessions(){
    document.getElementById("NbreGameSessions").innerHTML=tableau_GameSessions.length;
}

//function qui remplie le selecteur de Salles
function liste_rooms(){
    var SiteName = localStorage.getItem('SiteName');
    document.getElementById("Site").innerHTML=SiteName;

        for (var i=0;i<tableau_AllRooms.length;i++){
            var html = template_room.replaceAll("%RoomName%",tableau_AllRooms[i].Name)
                                    .replaceAll("%RoomId%",tableau_AllRooms[i].Id)
                                    .replaceAll("%RoomColor%",tableau_AllRooms[i].color)
            const elt = document.createElement("option");
            document.getElementById("RoomSelected").appendChild(elt);       
            elt.outerHTML = html;        
        }   
}

function VueCalendar(){
    document.getElementById("RapportButton").classList.replace("btn-light","btn-dark");
    document.getElementById("CalendarButton").classList.replace("btn-dark","btn-light");
}

function VueRapport(){
    document.getElementById("RapportButton").classList.replace("btn-light","btn-dark");
    document.getElementById("CalendarButton").classList.replace("btn-dark","btn-light");
}

// -------------------------------------------------------------VUE CALENDRIER-------------------------------------------

//On remplie un tableau avec la syntaxe correspondant à 'events' de FullCalendar
function FillGameSessions_List(){
    
    GameSessions_List=[];

    console.log(tableau_GameSessions)
    for (var i=0;i<tableau_GameSessions.length;i++){
        var tableau=[];

        tableau['backgroundColor'] = tableau_GameSessions[i].RoomColor; 
        tableau['id']=tableau_GameSessions[i].Id;
        tableau['start']=tableau_GameSessions[i].StartDate;
        tableau['end']=tableau_GameSessions[i].EndDate;
        tableau['description']="test";
       
        //switch case pour les icones de Succes
        var success = tableau_GameSessions[i].Succes;
        var icone;

        switch (success){
            case 1 : icone = "SS";
                
            break;
            case 2 : icone ="S";
                
            case 3 : icone ="F";
                
            break;
            case 4 : icone="A";
                
            break;
        }

        //on appelle une fonction qui transforme le timesptamp de la BDD
        var min = calculMinute(tableau_GameSessions[i].Duration);


        //on boucle sur le tableau des Missionions avec l'Id afin de récupère les codenames
        for (var j=0;j<tableau_Missions.length;j++){
            if(tableau_GameSessions[i].MissionId == tableau_Missions[j].Id){
                tableau['title']=tableau_Missions[j].CodeName+" "+min+" "+icone;
            }
        }

        GameSessions_List.push(tableau);       
    }    
}


//la fonction qui render le FullCalendar
function ShowCalendar(){

    var calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: '',
        locale: 'fr' , 
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

        //fetch des events
        eventSources:getEventSources(),

        // sur click event redirige vers l'url correspondant à l'id de la gamesession
        eventClick :  function(info) {
            document.location.href="./mission.html#"+info.event.id;
        }      
    });
    calendar.render();  

    //fonction qui écoute le tri de la Salle
    RoomSelected.addEventListener('change', function(){        //remove event sources
        
        calendar.getEventSources().forEach(eventSource => {
          eventSource.remove();
        });
        //get currently selected sources
        var sources = getEventSources();
        
        //add each new source to the calendar
        sources.forEach(eventSource => {
          calendar.addEventSource(eventSource);
        });  
    });

    //fonction qui écoute le filtre durée mission
    Nofilter.addEventListener('change', function() {
           if(Nofilter.checked==true) isFiltered=true;
           else isFiltered = false;

           calendar.getEventSources().forEach(eventSource => {
            eventSource.remove();
          });
          //get currently selected sources
          var sources = getEventSources();
          
          //add each new source to the calendar
          sources.forEach(eventSource => {
            calendar.addEventSource(eventSource);
          });          
    })
}

//function qui refetch tous les events
function getEventSources() {
    var sources = []; 
    FillTableau_AllGameSessions();
    FillGameSessions_List();
    ShowNbreGameSessions();
    sources.push({events:GameSessions_List});
    return sources;
}

//function de tri de la Salle
function RoomFilter(RoomId)
{
    if(RoomSelected.value=='Toutes')
    return true;

    else{
        if(RoomSelected.value==RoomId)
        return true;
        else return false;
    }
}

// -------------------------------------------------------------FONCTIONS DE CALCUL-------------------------------------------

//permet au filtre de determiné si la mission de la durée est inférieure au prérequis d'affichage
function CaclculMinDuration(DateX,DateY){
    var datumX = Date.parse(DateX);
    var datumY = Date.parse(DateY);

    if(datumX>datumY){
        return true;
    }
    else return false;
}

//on converti le timestamp de la bdd pour l'affichade de la durée de la mission dans le titre
function calculMinute(secondes){
    var minutes = Math.floor(secondes / 60);
    timestring = minutes.toString().padStart(2, '0') + 'm'
    return timestring;
}




