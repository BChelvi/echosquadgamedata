var tableau_AllGameSession =[];

var tableau_AllSites=[];

var tableau_SiteRooms=[];

var template_GameSession = `
                            <div onclick="ShowGameSession(%GameSession_id%)" class="d-flex justify-content-between my-2 GameSession">
                                <div class="col-1 text-center" id=%GameSession_id%> %GameSession_id%</div>
                                <div class="col-1 text-center">%RoomSessionId%</div>
                                <div class="col-2 text-center">%StartDate%</div>
                                <div class="col-2 text-center">%EndDate%</div>
                                <div class="col-2 text-center">%MissionId%</div>
                                <div class="col-2 text-center">%Langage%</div>
                                <div class="col-2 text-center">%IsActive%</div>
                            <div>
                            `;

var template_GameSessionId = `
                            <div class="d-flex flex-column justify-content-between my-2 GameSession">
                                <div id=%GameSession_id% >GameSession_Id : %GameSession_id%</div>
                                <div>RoomSession_Id : %RoomSessionId%</div>
                                <div>Date début : %StartDate%</div>
                                <div>Date fin : %EndDate%</div>
                                <div>Mission_Id : %MissionId%</div>
                                <div>Langage : %Langage%</div>
                                <div>En activité : %IsActive%</div>
                                <div>Exemple de data interprétée :<div>
                                <div>Durée : %duree%<div> 
                            <div>
                            `;

var template_AllSites = `
                            <div onclick="ToSite(%SiteId%)" class="d-flex my-2 GameSession">
                                <div class="col-4 text-center" id=%SiteId%>%SiteId%</div>
                                <div class="col-4 text-center">%name%</div>
                            </div>
                            `;

var template_SiteRooms = `
                        <div class="d-flex justify-content-between GameSession my-2" onclick="ToRoom(%RoomId%)">
                            <div class="col-3 text-center">%RoomId%</div>
                            <div class="col-3 text-center">%RoomName%</div>
                            <div class="col-3 text-center">%RoomVerbosity%</div>
                        </div>
                        `;


                       
                    

// var langageRecherche = document.getElementById('langages')
// langageRecherche.addEventListener('change', function() {
    
//     ShowAllGameSession();
// })


// var RoomSession_IdRecherche = document.getElementById('recherche')
// RoomSession_IdRecherche.addEventListener('input', function() {
    
//     ShowAllGameSession();
// })

function init(){

    getAllSites();
    // getAllGameSession();
    
}

function iniSite(){
    var id=location.hash.substring(1,10);
   
    getSiteRooms(id);
}

function getAllGameSession(){
    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getAllGameSession";
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_AllGameSession = JSON.parse(httpRequest.responseText);
        console.log(tableau_AllGameSession);
        ShowAllGameSession();
    };
    httpRequest.send();
}

function ShowAllGameSession(){
    document.getElementById("AllGameSession").innerHTML="";

    for (let i = 0; i < tableau_AllGameSession.length; i++) {


        if(!isLangage(langageRecherche.value,tableau_AllGameSession[i])){continue;}

        if(!isRoomSessionId(RoomSession_IdRecherche.value,tableau_AllGameSession[i])){continue;}

        var html = template_GameSession
            .replaceAll("%GameSession_id%", tableau_AllGameSession[i].Id)
            .replaceAll("%RoomSessionId%", tableau_AllGameSession[i].RoomSessionId)
            .replaceAll("%StartDate%", tableau_AllGameSession[i].StartDate)
            .replaceAll("%EndDate%", tableau_AllGameSession[i].EndDate)
            .replaceAll("%MissionId%", tableau_AllGameSession[i].MissionId)
            .replaceAll("%avancement_projet%", tableau_AllGameSession[i].progression)
            .replaceAll("%Langage%", tableau_AllGameSession[i].Language)
            .replaceAll("%IsActive%", tableau_AllGameSession[i].IsActive)
        
        var elt = document.createElement("div");
        document.getElementById("AllGameSession").appendChild(elt);
        elt.outerHTML = html;  
    }   
}

function ShowGameSession(id){
    document.getElementById("detailGameSession").classList.replace("d-none","d-flex");
    document.getElementById("GameSessionId").innerHTML="";
    
    for (let i = 0; i < tableau_AllGameSession.length; i++) {

        if(tableau_AllGameSession[i].Id==id){

            ;

            var html = template_GameSessionId
                .replaceAll("%GameSession_id%", tableau_AllGameSession[i].Id)
                .replaceAll("%RoomSessionId%", tableau_AllGameSession[i].RoomSessionId)
                .replaceAll("%StartDate%", tableau_AllGameSession[i].StartDate)
                .replaceAll("%EndDate%", tableau_AllGameSession[i].EndDate)
                .replaceAll("%MissionId%", tableau_AllGameSession[i].MissionId)
                .replaceAll("%avancement_projet%", tableau_AllGameSession[i].progression)
                .replaceAll("%Langage%", tableau_AllGameSession[i].Language)
                .replaceAll("%IsActive%", tableau_AllGameSession[i].IsActive)
                .replaceAll("%duree%", CalculDuree(tableau_AllGameSession[i].StartDate,tableau_AllGameSession[i].EndDate))
            
                var elt = document.createElement("div");
                document.getElementById("GameSessionId").appendChild(elt);
                elt.outerHTML = html;  
            
        }
    }  
}

function closeGameSessionId(){
    document.getElementById("detailGameSession").classList.replace("d-flex","d-none");
}

function CalculDuree(dateX,dateY){

    var timeString;

    if(!dateX || !dateY){
        timeString = "Session toujours en cours"
    }

    else {

    var datumX = Date.parse(dateX);
    var datumY = Date.parse(dateY);
    var diff = (datumY-datumX)/1000;
   
    var hours = Math.floor(diff / 3600);
    var minutes = Math.floor((diff - (hours * 3600)) / 60);
    var seconds = diff - (hours * 3600) - (minutes * 60);
  
    timeString = hours.toString().padStart(2, '0') + ':' +
                        minutes.toString().padStart(2, '0') + ':' +
                        seconds.toString().padStart(2, '0');

    }

    return timeString;
    
}

//function pour filtrer les films affichés par langage

function isLangage(langage,GameSession_Id)
{
    if(langage==0||langage=='Tous'){
        return true //renvoie vrai quand tous les genres correspondent
    }
    
  //si le genre-value n'est pas inclus dans le genre du film alors j'appelle l'instruction continue;

    if(GameSession_Id.Language.indexOf(langage)!=-1){ //genre trouve dans les genre du film
        return true
        }
    
    return false

}

//fonction pour trier les films affichés par lettres

function isRoomSessionId(id,GameSession)

{
    console.log(GameSession.RoomSessionId);
    if(id==""){
        return true
    }

    if(GameSession.RoomSessionId==id){
        return true
    }

    return false
}

function getAllSites(){
    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getallsites";
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_AllSites = JSON.parse(httpRequest.responseText);
        console.log(tableau_AllSites);
        ShowAllSite();
    };
    httpRequest.send();
}

function ShowAllSite(){
    
    document.getElementById("AllSite").innerHTML="";
    
    for (let i = 0; i < tableau_AllSites.length; i++) {
            var html = template_AllSites
                .replaceAll("%SiteId%", tableau_AllSites[i].Id)
                .replaceAll("%name%", tableau_AllSites[i].Name)
                
            
                var elt = document.createElement("div");
                document.getElementById("AllSite").appendChild(elt);
                elt.outerHTML = html;         
    }  
}

function ToSite(id){

    document.location.href="./site.html#"+id; 
}

function getSiteRooms(id){
   
    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getsiterooms&id="+id;
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_SiteRooms = JSON.parse(httpRequest.responseText);
        console.log(tableau_SiteRooms);
        ShowSiteRooms();   
    };
    httpRequest.send();
}

function ShowSiteRooms(){
    document.getElementById("Rooms").innerHTML="";

    document.getElementById("siteId").innerHTML=tableau_SiteRooms['SiteId'];

    document.getElementById("siteName").innerHTML=tableau_SiteRooms['Name'];
    
    for (let i = 0; i < tableau_SiteRooms['rooms'].length; i++) {

        var html = template_SiteRooms
            .replaceAll("%RoomId%", tableau_SiteRooms['rooms'][i].Id)
            .replaceAll("%RoomName%", tableau_SiteRooms['rooms'][i].Name)
            .replaceAll("%RoomVerbosity%", tableau_SiteRooms['rooms'][i].Verbosity)
        
            var elt = document.createElement("div");
            document.getElementById("Rooms").appendChild(elt);
            elt.outerHTML = html;         
    }     
}

function ToRoom(id){
    document.location.href="./room.html#"+id; 
}