// --------------------------------------DECLARATIONS DE VARIABLES----------------------------------------------------------------

var tableau_Missions=[];

var tableau_AllRooms=[];

var tableau_RoomSessions=[];

var tableau_GameSessions=[];

var GameSessions_List = [];

var tableau_rapport =[];

var tableau_YearRapport=[];

var calendarEl = document.getElementById('calendar');

var IsRapport=false;

var calendar;

var CurrentDate = new Date();


var datemois;


var Year;

var date = (TransformDateFirstoftheMonth(CurrentDate)).getTime();

//variable checkant si la listeRoom à déja était injectée
var IsListRoom = false;

//variable indiquant si la case filtre durée mission est cochée ou non
var isFiltered =false;

//On récupère l'ID de la Room(Sous-Marin) dans l'url
var SiteId=location.hash.substring(1,10);

// --------------------------------------TEMPLATES----------------------------------------------------------------

var template_room =`<button onclick="RoomSelect(%RoomId%)" id="%RoomId%"  type="button" data-color="%RoomColor%"  style="background-color:%RoomColor%; opacity:0.5;" class="btn border mx-2 col-3 h-100 togglesalle">%RoomName%</button>`;

var template_rapport=`<div class="mb-2 col-3 vignette p-3 rounded">
                            <div class="h4 text-center">%MissionName%</div>
                            <div class="mt-5" >Nombre effectuées : %NbrMission%</div>
                            <div class="mt-2">Nombre abandonnées : %NbrMissionAbandon%</div>
                            <div class="mt-2">Durée Moyenne : %MoyDuration%</div>
                            <div class="d-flex flex-column justify-content-between align-items-center mt-2">
                                <div>Succès</div>
                                <div id="chart%MissionId%" class="d-flex" style='width:80%;height:20px'>
                                    <div class="d-flex chartbarre green" style='width:%R4%;height:20px'></div>
                                    <div class="d-flex chartbarre yellow" style='width:%R3%;height:20px'></div>
                                    <div class="d-flex chartbarre orange" style='width:%R2%;height:20px'></div>
                                    <div class="d-flex chartbarre red" style='width:%R1%;height:20px'></div>
                                </div>
                            </div>
                        </div>`

// --------------------------------------VARIABLES SURVEILLANT LES SELECTEURS----------------------------------------------------------------

//Changement du selecteur Room(Sous-Marin)
var RoomSelected;


//addEventListener permettant d'afficher ou non toutes les missions
var Nofilter = document.getElementById('nofilter');


// --------------------------------------FONCTION INITIE AU CHARGEMENT DE LA PAGE----------------------------------------------------------------

function init(){
    ShowCalendar();
    getMissions();  
    SetYear();
    checkDate();
}

// --------------------------------------FONCTIONS AJAX REMPLISSANT LES VARIABLES----------------------------------------------------------------

//function ajax qui récupère la table Mission
function getMissions(){
    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getmissions";
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_Missions = JSON.parse(httpRequest.responseText);  
        ShowCalendar(); 
    };
    httpRequest.send();
}

//function ajax qui récupère toutes les Rooms d'un Site Unique avec les gamesessions y correspondant
function getAllRoom(SiteId,Date){
    tableau_GameSessions=[];
    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getallrooms&SiteId="+SiteId+"&Date="+Date;
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_AllRooms= JSON.parse(httpRequest.responseText);
        liste_rooms();
        FillTableau_AllGameSessions();
        FillGameSessions_List();      
        Fill_Rapport();
        calendar.getEventSources().forEach(eventSource => {
            eventSource.remove();
          });
          //get currently selected sources
          var sources = getEventSources();
          
          //add each new source to the calendar
          sources.forEach(eventSource => {
            calendar.addEventSource(eventSource);
        getEventSources();})
        getYearRapport();
    };
    httpRequest.send();

}

//function qui remplie un tableau avec les gamessesions à afficher celon les différents filtres
function FillTableau_AllGameSessions(){
    tableau_GameSessions=[];
    if(!RoomSelected){
        for (var i=0;i<tableau_AllRooms.length;i++){

                for (var j=0;j<tableau_AllRooms[i]['RoomSessions'].length;j++){
            
                    for (var k=0 ; k<tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'].length;k++){
    
                    var duration = tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'][k].Duration;
    
                        //filtre sur la durée de la mission
                        if (isFiltered==false){
                            if(CaclculMinDuration(duration,tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'][k].MissionId)){
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

    else{
        for (var i=0;i<tableau_AllRooms.length;i++){
            // filtre sur le selecteur de Salle
            if(RoomSelected != tableau_AllRooms[i].Id) continue;
            else{

                for (var j=0;j<tableau_AllRooms[i]['RoomSessions'].length;j++){
            
                    for (var k=0 ; k<tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'].length;k++){

                    var duration = tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'][k].Duration;

                        //filtre sur la durée de la mission et/ou le succes
                        if (isFiltered==false){
                            if(CaclculMinDuration(duration,tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'][k].MissionId || tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'][k].Succes==0)){
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
}

// --------------------------------------FONCTIONS GERANTS DIFFERENTS BLOCS D'AFFICHAGE----------------------------------------------------------------

function ShowNbreGameSessions(){
    document.getElementById("NbreGameSessions").innerHTML=tableau_GameSessions.length;
}

//function qui remplie le selecteur de Salles
function liste_rooms(){
    if(!IsListRoom){
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
            
        IsListRoom =true;
    }
}

function MonthRapport(){
    IsRapportYear=false;
    IsYearChecked=false;
    document.getElementById("YearRapport").classList.replace("btn-dark","btn-light");
    document.getElementById("MonthRapport").classList.replace("btn-light","btn-dark");
    document.getElementById("rapport").classList.replace("d-none","d-flex");
    document.getElementById("rapportYear").classList.replace("d-flex","d-none");
    checkDate();
}

var IsRapportYear=false;
var IsYearChecked=false;
function YearRapport(){
    document.getElementById("MonthRapport").classList.replace("btn-dark","btn-light");
    document.getElementById("YearRapport").classList.replace("btn-light","btn-dark");
    document.getElementById("rapport").classList.replace("d-flex","d-none");
    document.getElementById("rapportYear").classList.replace("d-none","d-flex");
    IsRapportYear=true;
    IsYearChecked=true;
    checkDate(1);
   
}

// -------------------------------------------------------------VUE CALENDRIER-------------------------------------------

//On remplie un tableau avec la syntaxe correspondant à 'events' de FullCalendar
function FillGameSessions_List(){
    GameSessions_List=[];

   
    for (var i=0;i<tableau_GameSessions.length;i++){
        var tableau=[];

        tableau['backgroundColor'] = tableau_GameSessions[i].RoomColor; 
        tableau['id']=tableau_GameSessions[i].gamesessionId;
        tableau['start']=tableau_GameSessions[i].StartDate;
        tableau['end']=tableau_GameSessions[i].EndDate;        
        tableau['display']="block";//permet d'encadrer les events dans la vue Month
        tableau['borderColor']=tableau_GameSessions[i].RoomColor; 
       
        //switch case pour les icones de Succes
        var success = tableau_GameSessions[i].Succes;
        var icone;

        switch (success){
            case 0 : icone = `<img src="./css/img/nostarblackempty.png" class="star">`;
            break;
            case 1 : icone =`<img src="./css/img/zerostaremptyblack.png" class="star">`;
            break;
            case 2 : icone =`<img src="./css/img/onestaremptyblack.png" class="star">`;
            break;
            case 3 : icone=`<img src="./css/img/twostaremptyblack.png" class="star">`;
            break;
            case 4 : icone=`<img src="./css/img/THREEstar.png" class="star">`;
             break;
        }

        //on appelle une fonction qui transforme le timesptamp de la BDD
        var min = calculMinute(tableau_GameSessions[i].Duration);


        //on boucle sur le tableau des Missionions avec l'Id afin de récupère les codenames
        for (var j=0;j<tableau_Missions.length;j++){
            if(tableau_GameSessions[i].MissionId == tableau_Missions[j].Id){
                tableau['title']="<div class='d-flex justify-content-start flex-wrap text-dark mission'>"+"<div class=''>"+tableau_GameSessions[i].StartDate.substring(11,16)+"</div>"+" &nbsp;"+"<div>"+min+"</div>"+"&nbsp;"+"<figure>"+icone+"</figure>"+" &nbsp;"+"<div>"+tableau_Missions[j].CodeName+"</div></div>";
            }
        }

        GameSessions_List.push(tableau);       
    }    
}


//la fonction qui render le FullCalendar
function ShowCalendar(){
    getAllRoom(SiteId,date);
     calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: '',
        locale: 'fr' , 
        initialView: 'dayGridMonth',
        firstDay:1,
        height:'auto',
        dayHeaderFormat:{
        weekday:"long",
        },
        slotMinTime:"07:00:00",
        showNonCurrentDates:false,//obligatoire pour éviter un bug d'affichage lors du défilement
        fixedWeekCount:false,
        datesSet: function (info) {
            datemois= (info.view.activeStart);
                    
        },
        headerToolbar:false,

        //fetch des events
        eventSources:getEventSources(),
        eventContent: function( info ) {
            return {html: info.event.title};
        },

        // sur click event redirige vers l'url correspondant à l'id de la gamesession
        eventClick :  function(info) {
            document.location.href="./mission.html#"+info.event.id;
        } ,
        
        dateClick: function(info) {
            calendar.changeView('timeGridDay',info.date);
            document.getElementById("dayvue").classList.replace("btn-light","btn-dark");
            document.getElementById("monthvue").classList.replace("btn-dark","btn-light");
            document.getElementById("weekvue").classList.replace("btn-dark","btn-light");
            checkDate();
          },
    });

    calendar.render();  

    //fonction qui écoute le filtre durée mission
    Nofilter.addEventListener('change', function() {
         
        if(Nofilter.checked==true) isFiltered=true;
           else isFiltered = false;
           FillTableau_AllGameSessions();
           FillGameSessions_List();
            Fill_Rapport();
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
}

// function qui refetch tous les events
function getEventSources() {
    var sources = [];
    sources.push({events:GameSessions_List});
    return sources;
}


// -------------------------------------------------------------VUE RAPPORT------------------------------------------------------

function Fill_Rapport(){

    document.getElementById("rapport").innerHTML="";
    tableau_rapport =[];

    if(!RoomSelected){
        for (var i=0;i<tableau_AllRooms.length;i++){

                for (var j=0;j<tableau_AllRooms[i]['RoomSessions'].length;j++){
            
                    for (var k=0 ; k<tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'].length;k++){

                        tableau_rapport.push(tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'][k]);
                        
                    }  
                }
            }
        }

    else{
        for (var i=0;i<tableau_AllRooms.length;i++){
            // filtre sur le selecteur de Salle
            if(RoomSelected != tableau_AllRooms[i].Id) continue;
            else{

                for (var j=0;j<tableau_AllRooms[i]['RoomSessions'].length;j++){
            
                    for (var k=0 ; k<tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'].length;k++){

                        tableau_rapport.push(tableau_AllRooms[i]['RoomSessions'][j]['GameSessions'][k]);
                        }
                    }  
                }
            }
        }
    

    for (var i=0;i<tableau_Missions.length;i++){

        //On n'afffiche ni PlayerBase ni Teaser
        var tableau_pourcentage = NmbrePourcentageGame(tableau_Missions[i].Id,tableau_Missions[i].MinDuration);
        var html = template_rapport.replaceAll("%MissionName%",tableau_Missions[i].Name)

        .replaceAll("%NbrMission%",tableau_pourcentage.Nbremission)
        .replaceAll("%NbrMissionAbandon%",tableau_pourcentage.NbremissionAbandon)
        .replaceAll("%R4%",tableau_pourcentage.PourcentageR4)
        .replaceAll("%R3%",tableau_pourcentage.PourcentageR3)
        .replaceAll("%R2%",tableau_pourcentage.PourcentageR2)
        .replaceAll("%R1%",tableau_pourcentage.PourcentageR1)
        .replaceAll("%MoyDuration%",tableau_pourcentage.MoyDuration)
        .replaceAll("%MissionId%",tableau_Missions[i].Id)
        
        console.log(tableau_pourcentage.Nbremission);


                const elt = document.createElement("div");
                document.getElementById("rapport").appendChild(elt);       
                elt.outerHTML = html;

                if(tableau_pourcentage.Nbremission=="-"){
                    var id="chart"+tableau_Missions[i].Id;                  
                    document.getElementById(id).innerHTML="-";
                }
        
    }
}

//requete ajax pour récupérer l'ensemble des scores de missions d'une année sans rentrer en conflict avec le reste du code
function  getYearRapport(){
    tableau_GameSessions=[];
    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getyearrapport&SiteId="+SiteId+"&Year="+Year;
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_YearRapport = JSON.parse(httpRequest.responseText);
        fill_YearRapport();
    };
    httpRequest.send();
}

function fill_YearRapport(){
    document.getElementById("rapportYear").innerHTML="";

    for (var i=0;i<tableau_Missions.length;i++){

        //On n'afffiche ni PlayerBase ni Teaser
        
            var tableau_pourcentageYear=NmbrePourcentageGameYear(tableau_Missions[i].Id,tableau_Missions[i].MinDuration);
            var html = template_rapport.replaceAll("%MissionName%",tableau_Missions[i].Name)
                                    .replaceAll("%NbrMission%",tableau_pourcentageYear.Nbremission)
                                    .replaceAll("%NbrMissionAbandon%",tableau_pourcentageYear.NbremissionAbandon)
                                        .replaceAll("%R4%",tableau_pourcentageYear.PourcentageR4)
                                        .replaceAll("%R3%",tableau_pourcentageYear.PourcentageR3)
                                        .replaceAll("%R2%",tableau_pourcentageYear.PourcentageR2)
                                        .replaceAll("%R1%",tableau_pourcentageYear.PourcentageR1)
                                        .replaceAll("%MoyDuration%",tableau_pourcentageYear.MoyDuration)
                                        .replaceAll("%MissionId%",tableau_Missions[i].Id)
                                        
                const elt = document.createElement("div");
                document.getElementById("rapportYear").appendChild(elt);       
                elt.outerHTML = html;
        
    } 
}


// -------------------------------------------------------------FONCTIONS DE CALCUL-------------------------------------------

//permet au filtre de determiné si la mission de la durée est inférieure au prérequis d'affichage
function CaclculMinDuration(DateX,MissionId){
    // var datumX = Date.parse(DateX);
    // var datumY = Date.parse(DateY);
    var DateY;

    for (var i=0;i<tableau_Missions.length;i++){
        if(tableau_Missions[i].Id != MissionId) continue;
        else DateY=tableau_Missions[i].MinDuration;
    }
    console.log(DateY);
    if(DateX>DateY){
        return true;
    }
    else return false;
}

//on converti le timestamp de la bdd pour l'affichade de la durée de la mission dans le titre
function calculMinute(secondes){
    var minutes = Math.floor(secondes / 60);
    timestring = minutes.toString().padStart(2, '0');
    return timestring;
}

function NmbrePourcentageGame (MissionId,MinDuration){
    
    var tableau_pourcentage={Nbremission:0,NbremissionAbandon:0,PourcentageR1:0,PourcentageR2:0,PourcentageR3:0,PourcentageR4:0,MoyDuration:0};

    var NbreMissionR4=0;
    var NbreMissionR3=0;
    var NbreMissionR2=0;
    var NbreMissionR1=0;
    var DurationTotale=0;

    for (var i=0;i<tableau_rapport.length;i++){
        if(tableau_rapport[i].MissionId==MissionId && tableau_rapport[i].Duration>=MinDuration){
            
            tableau_pourcentage['Nbremission']+=1;
            DurationTotale+=parseInt(tableau_rapport[i].Duration);
            switch (parseInt(tableau_rapport[i].Succes)) {
                case 1 :NbreMissionR1+=1;
                break;
                case 2 : NbreMissionR2+=1;
                break;
                case 3 :NbreMissionR3+=1;
                break;
                case 4 :NbreMissionR4+=1;
                break;
            }
        }
        else if (tableau_rapport[i].MissionId==MissionId && tableau_rapport[i].Duration<MinDuration){
            tableau_pourcentage['NbremissionAbandon']+=1;
        }    
    }

    if(tableau_pourcentage['Nbremission']!=0){
        tableau_pourcentage['PourcentageR4']=Math.trunc((NbreMissionR4/tableau_pourcentage['Nbremission'])*100)+"%";
        tableau_pourcentage['PourcentageR3']=Math.trunc((NbreMissionR3/tableau_pourcentage['Nbremission'])*100)+"%";
        tableau_pourcentage['PourcentageR2']=Math.trunc((NbreMissionR2/tableau_pourcentage['Nbremission'])*100)+"%";
        tableau_pourcentage['PourcentageR1']=Math.trunc((NbreMissionR1/tableau_pourcentage['Nbremission'])*100)+"%";
        tableau_pourcentage['MoyDuration']=Math.trunc(DurationTotale/tableau_pourcentage['Nbremission']/60)+"min";
    }
    else{
        tableau_pourcentage['Nbremission']="-";
        tableau_pourcentage['NbremissionAbandon']="-";
        tableau_pourcentage['PourcentageR4']="-";
        tableau_pourcentage['PourcentageR3']="-";
        tableau_pourcentage['PourcentageR2']="-";
        tableau_pourcentage['PourcentageR1']="-";
        tableau_pourcentage['MoyDuration']="-";
    }

    return tableau_pourcentage;  
}

function NmbrePourcentageGameYear (MissionId,MinDuration){

    var tableau_pourcentageYear={Nbremission:0,NbremissionAbandon:0,PourcentageR1:0,PourcentageR2:0,PourcentageR3:0,PourcentageR4:0,MoyDuration:0};

    var NbreMissionR4=0;
    var NbreMissionR3=0;
    var NbreMissionR2=0;
    var NbreMissionR1=0;
    var DurationTotale=0;

    for (var i=0;i<tableau_YearRapport.length;i++){
        
        if(tableau_YearRapport[i].Id==MissionId){

            for (var j=0;j<tableau_YearRapport[i].RoomId.length;j++){

                if(RoomSelected){
                    if(tableau_YearRapport[i].RoomId[j].RoomId!=RoomSelected)continue;
                    if(tableau_YearRapport[i].RoomId[j].Duration>=MinDuration){
                        tableau_pourcentageYear['Nbremission']+=1;
                        switch(parseInt(tableau_YearRapport[i].RoomId[j].Succes)){
                            case 1 :NbreMissionR1+=1;
                            break;
                            case 2 : NbreMissionR2+=1;
                            break;
                            case 3 :NbreMissionR3+=1;
                            break;
                            case 4 :NbreMissionR4+=1;
                            break;
                        }
                        DurationTotale+=tableau_YearRapport[i].RoomId[j].Duration;
                    }
                    else tableau_pourcentageYear['NbremissionAbandon']+=1;
                }
                else {
                    if(tableau_YearRapport[i].RoomId[j].Duration>=MinDuration){
                        tableau_pourcentageYear['Nbremission']+=1;
                        switch(parseInt(tableau_YearRapport[i].RoomId[j].Succes)){
                            case 1 :NbreMissionR1+=1;
                            break;
                            case 2 : NbreMissionR2+=1;
                            break;
                            case 3 :NbreMissionR3+=1;
                            break;
                            case 4 :NbreMissionR4+=1;
                            break;
                        }
                        DurationTotale+=tableau_YearRapport[i].RoomId[j].Duration;
                    }
                    else tableau_pourcentageYear['NbremissionAbandon']+=1;
                }
            }
        }        
    }
    if(tableau_pourcentageYear['Nbremission']!=0){
        tableau_pourcentageYear['PourcentageR4']=Math.trunc((NbreMissionR4/tableau_pourcentageYear['Nbremission'])*100)+"%";
        tableau_pourcentageYear['PourcentageR3']=Math.trunc((NbreMissionR3/tableau_pourcentageYear['Nbremission'])*100)+"%";
        tableau_pourcentageYear['PourcentageR2']=Math.trunc((NbreMissionR2/tableau_pourcentageYear['Nbremission'])*100)+"%";
        tableau_pourcentageYear['PourcentageR1']=Math.trunc((NbreMissionR1/tableau_pourcentageYear['Nbremission'])*100)+"%";
        tableau_pourcentageYear['MoyDuration']=Math.trunc(DurationTotale/tableau_pourcentageYear['Nbremission']/60)+"min";
    }
    else{
        tableau_pourcentageYear['Nbremission']="-";
        tableau_pourcentageYear['NbremissionAbandon']="-";
        tableau_pourcentageYear['PourcentageR4']="-";
        tableau_pourcentageYear['PourcentageR3']="-";
        tableau_pourcentageYear['PourcentageR2']="-";
        tableau_pourcentageYear['PourcentageR1']="-";
        tableau_pourcentageYear['MoyDuration']="-";
    }
    
    return tableau_pourcentageYear;  
}

//function pour trouver le premier jour du mois en cours affiché YYYY-MM-DD
function TransformDateFirstoftheMonth(date){
    var firstDayCurrentMonth = getFirstDayOfMonth(
        date.getFullYear(),
        date.getMonth(),
    );
  return firstDayCurrentMonth;
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1);
}

//function pour trouver le premier jour du mois suivant
function getNextFirstDayOftheMOnth(date){
    var year = date.getFullYear();
    var month = date.getMonth();

   return  new Date (year,month+1,1);
 
    
}

//function pour trouver le premier jour du mois précédent
function getPreviousFirstDayOftheMOnth(date){

    var year = date.getFullYear();
    var month = date.getMonth();

    return  new Date (year,month-1,1);

}

//function pour determiner l'année affichée en cours
function SetYear(){
    Year = (CurrentDate.getFullYear());

}

function getNextYear(date){
    var year= date.getFullYear();
    var month= date.getMonth();

    return new Date(year+1,month,1);
}


function getPrevYear(date){
    var year= date.getFullYear();
    var month= date.getMonth();

    return new Date(year-1,month,1);
}

// ----------------------------------------------------------------------BUTTONS--------------------------------------------------------------


function ToggleCalendar(){
    IsYearChecked=false;
    document.getElementById("calendarDiv").classList.remove("invis");
    document.getElementById("rapportDiv").classList.add("invis");
    document.getElementById("ToggleCalendar").classList.replace("btn-light","btn-dark");
    document.getElementById("ToggleRapport").classList.replace("btn-dark","btn-light");
    document.getElementById("buttonCalendar").classList.replace("d-none","d-flex");
    document.getElementById("buttonRapport").classList.replace("d-flex","d-none");
    document.getElementById("todayvueRapport").classList.replace("d-flex","d-none");
    document.getElementById("todayvue").classList.replace("d-none","d-flex");
    monthvue();

}


function ToggleRapport(){
    calendar.changeView('dayGridMonth');
    checkDate(1);
    document.getElementById("rapportDiv").classList.remove("invis");
    document.getElementById("calendarDiv").classList.add("invis");
    document.getElementById("ToggleRapport").classList.replace("btn-light","btn-dark");
    document.getElementById("ToggleCalendar").classList.replace("btn-dark","btn-light");
    document.getElementById("buttonCalendar").classList.replace("d-flex","d-none");
    document.getElementById("buttonRapport").classList.replace("d-none","d-flex");
    document.getElementById("todayvueRapport").classList.replace("d-none","d-flex");
    document.getElementById("todayvue").classList.replace("d-flex","d-none");

}


function next(){
    if (IsRapportYear && IsYearChecked){
        var DateCalendar = (getNextYear(TransformDateFirstoftheMonth(datemois))).getTime();
        getAllRoom(SiteId,DateCalendar);
        calendar.nextYear();
        Year=Year+1;
        getYearRapport();
        checkDate(1);
         
    }

    else{
        var DateCalendar = (getNextFirstDayOftheMOnth(TransformDateFirstoftheMonth(datemois))).getTime();
                        getAllRoom(SiteId,DateCalendar);
                        var Month=datemois;
                        //get Month index les mois de l'année de 0-11
                        if(Month.getMonth()==11){
                            Year=Year+1;
                            getYearRapport();}
                        calendar.next();
                        checkDate();
    }
                    
}

function prev(){
    if (IsRapportYear && IsYearChecked){
        var DateCalendar = (getPrevYear(TransformDateFirstoftheMonth(datemois))).getTime();
        getAllRoom(SiteId,DateCalendar);
        calendar.prevYear();
        Year=Year-1;
        getYearRapport();
        checkDate(1);
    }
    else{
        var DateCalendar = (getPreviousFirstDayOftheMOnth(TransformDateFirstoftheMonth(datemois))).getTime();
        getAllRoom(SiteId,DateCalendar);
        var Month=datemois;
        //get Month index les mois de l'année de 0-11
        if(Month.getMonth()==0){
            Year=Year-1;
            getYearRapport();
        }
        calendar.prev();
        checkDate();
    }
}

function todayvue(){
   
    var DateCalendar = (TransformDateFirstoftheMonth(CurrentDate)).getTime();
    getAllRoom(SiteId,DateCalendar);
    calendar.today();
    checkDate();
}

function todayvueRapport(){

     if (IsRapportYear){
        var DateCalendar =  (TransformDateFirstoftheMonth(CurrentDate)).getTime();
        getAllRoom(SiteId,DateCalendar);
        calendar.today();
        SetYear();
        getYearRapport();
        checkDate(1);
       
    }
    else{
    var DateCalendar =  (TransformDateFirstoftheMonth(CurrentDate)).getTime();
        getAllRoom(SiteId,DateCalendar);
        calendar.today();
        SetYear();
        getYearRapport();
        checkDate();
    }
}



function monthvue(){
    document.getElementById("monthvue").classList.replace("btn-light","btn-dark");
    document.getElementById("weekvue").classList.replace("btn-dark","btn-light");
    document.getElementById("dayvue").classList.replace("btn-dark","btn-light");
    calendar.changeView('dayGridMonth');
    checkDate();
}

function dayvue(){
    document.getElementById("dayvue").classList.replace("btn-light","btn-dark");
    document.getElementById("monthvue").classList.replace("btn-dark","btn-light");
    document.getElementById("weekvue").classList.replace("btn-dark","btn-light");
    calendar.changeView('timeGridDay');
    checkDate();
}

function weekvue(){
    document.getElementById("weekvue").classList.replace("btn-light","btn-dark");
    document.getElementById("monthvue").classList.replace("btn-dark","btn-light");
    document.getElementById("dayvue").classList.replace("btn-dark","btn-light");
    calendar.changeView('timeGridWeek');
    checkDate();
}

function checkDate(format){
    var datecalendrier = calendar.view.title;
    if (!format || !IsRapportYear)
        document.getElementById('date').innerHTML=datecalendrier;
    else   {
        document.getElementById('date').innerHTML = datecalendrier.split(" ")[1];
    }
}

function RoomSelect(id){

    if(id){

    document.getElementById(id).classList.add("scaling");

    var buttons = document.querySelectorAll(".togglesalle");

    for (var i=0;i<buttons.length;i++){
        if (buttons[i]!=document.getElementById(id))
        buttons[i].classList.remove("scaling");
    }

    RoomSelected=id;
    FillTableau_AllGameSessions();
        FillGameSessions_List();
        Fill_Rapport();
        fill_YearRapport();
        calendar.getEventSources().forEach(eventSource => {
          eventSource.remove();
        });
        //get currently selected sources
        var sources = getEventSources();
        
        //add each new source to the calendar
        sources.forEach(eventSource => {
          calendar.addEventSource(eventSource);
        });
    }

    else {
        document.getElementById("toutes").classList.add("scaling");

        var buttons = document.querySelectorAll(".togglesalle");

        for (var i=0;i<buttons.length;i++){
            if (buttons[i]!=document.getElementById("toutes"))
            buttons[i].classList.remove("scaling");
        }

        RoomSelected=id;
        FillTableau_AllGameSessions();
            FillGameSessions_List();
            Fill_Rapport();
            fill_YearRapport();
            calendar.getEventSources().forEach(eventSource => {
              eventSource.remove();
            });
            //get currently selected sources
            var sources = getEventSources();
            
            //add each new source to the calendar
            sources.forEach(eventSource => {
              calendar.addEventSource(eventSource);
            });
    }      
}