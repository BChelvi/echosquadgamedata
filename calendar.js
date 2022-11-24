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

var template_room =`<option value=%RoomId% style="color:%RoomColor%" data-color="%RoomColor%">%RoomName% - %RoomId%</option>`;

var template_rapport=`<div class="mb-2">
                            <div class="h4">%MissionName%</div>
                            <div>Nombre effectuées : %NbrMission%</div>
                            <div>Durée Moyenne : %MoyDuration%</div>
                            <div>Réussite totale : %PourcentageSS%</div>
                            <div>Réussite partielle : %PourcentageS%</div>
                            <div>Echec : %PourcentageFail%</div>
                            <div id="abandon-%MissionId%" class="d-none">Abandon : %PourcentageQuit%%</div>
                        </div>`

// --------------------------------------VARIABLES SURVEILLANT LES SELECTEURS----------------------------------------------------------------

//Changement du selecteur Room(Sous-Marin)
var RoomSelected = document.getElementById('RoomSelected');


//addEventListener permettant d'afficher ou non toutes les missions
var Nofilter = document.getElementById('nofilter');


// --------------------------------------FONCTION INITIE AU CHARGEMENT DE LA PAGE----------------------------------------------------------------

function init(){
    ShowCalendar();
    getMissions();  
    SetYear();
    checkDate();
    getYearRapport();
   
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
        tableau_AllRooms = JSON.parse(httpRequest.responseText);
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
        showNonCurrentDates:false,//obligatoire pour éviter un bug d'affichage lors du défilement
        fixedWeekCount:false,
        datesSet: function (info) {
            datemois= (info.view.activeStart);
                    
        },
        headerToolbar:false,
        // {
        //     left: 'PREV,TODAY,NEXT',
        //     center: 'title',
        //     right: 'dayGridMonth,timeGridWeek,timeGridDay'
        // },     
        buttonText:{
            today:"Aujourd'hui",
            month:"Mois",
            week:"Semaine",
            day:"Jour",
            list:"liste",
        },
        customButtons: {
            PREV: {
              text: '<',
              click: function() {
                    var DateCalendar = (getPreviousFirstDayOftheMOnth(TransformDateFirstoftheMonth(datemois))).getTime();
                    getAllRoom(SiteId,DateCalendar);
                    var Month=datemois;
                    //get Month index les mois de l'année de 0-11
                    if(Month.getMonth()==0){
                        Year=Year-1;
                        getYearRapport();
                    }
                    calendar.prev();
                }
            },
            NEXT: {
                text: '>',
                click: function() {
                    var DateCalendar = (getNextFirstDayOftheMOnth(TransformDateFirstoftheMonth(datemois))).getTime();
                    getAllRoom(SiteId,DateCalendar);
                    var Month=datemois;
                    //get Month index les mois de l'année de 0-11
                    if(Month.getMonth()==11){
                        Year=Year+1;
                        getYearRapport();}
                    calendar.next();
                }
            },
            TODAY: {
                text: "Aujourd'hui",
                click: function() {
                    var DateCalendar = (TransformDateFirstoftheMonth(CurrentDate)).getTime();
                    getAllRoom(SiteId,DateCalendar);
                    calendar.today();
                }
            },
        },

        //fetch des events
        eventSources:getEventSources(),

        // sur click event redirige vers l'url correspondant à l'id de la gamesession
        eventClick :  function(info) {
            document.location.href="./mission.html#"+info.event.id;
        } ,
        
        dateClick: function(info) {
            calendar.changeView('timeGridDay',info.date);
          },
    });

    calendar.render();  

    //fonction qui écoute le tri de la Salle
    RoomSelected.addEventListener('change', function(){        //remove event sources
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
// -------------------------------------------------------------VUE RAPPORT------------------------------------------------------

function Fill_Rapport(){

    document.getElementById("rapport").innerHTML="";

    for (var i=0;i<tableau_Missions.length;i++){

        //On n'afffiche ni PlayerBase ni Teaser
        if(i!=0&&i!=3){
            var tableau_pourcentage = NmbrePourcentageGame(tableau_Missions[i].Id);
            var html = template_rapport.replaceAll("%MissionName%",tableau_Missions[i].Name)
                                       .replaceAll("%NbrMission%",tableau_pourcentage.Nbremission)
                                        .replaceAll("%PourcentageSS%",tableau_pourcentage.PourcentageSuperSucces)
                                        .replaceAll("%PourcentageS%",tableau_pourcentage.PourcentageSucces)
                                        .replaceAll("%PourcentageFail%",tableau_pourcentage.PourcentageFail)
                                        .replaceAll("%PourcentageQuit%",tableau_pourcentage.PourcentageQuit)
                                        .replaceAll("%MoyDuration%",tableau_pourcentage.MoyDuration)
                                        .replaceAll("%MissionId%",tableau_Missions[i].Id)
                                        


                const elt = document.createElement("div");
                document.getElementById("rapport").appendChild(elt);       
                elt.outerHTML = html;
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
        if(i!=0&&i!=3){
            var tableau_pourcentageYear=NmbrePourcentageGameYear(tableau_Missions[i].Id);
            var html = template_rapport.replaceAll("%MissionName%",tableau_Missions[i].Name)
                                       .replaceAll("%NbrMission%",tableau_pourcentageYear.Nbremission)
                                        .replaceAll("%PourcentageSS%",tableau_pourcentageYear.PourcentageSuperSucces)
                                        .replaceAll("%PourcentageS%",tableau_pourcentageYear.PourcentageSucces)
                                        .replaceAll("%PourcentageFail%",tableau_pourcentageYear.PourcentageFail)
                                        .replaceAll("%PourcentageQuit%",tableau_pourcentageYear.PourcentageQuit)
                                        .replaceAll("%MoyDuration%",tableau_pourcentageYear.MoyDuration)
                                        .replaceAll("%MissionId%",tableau_Missions[i].Id)
                                        
                const elt = document.createElement("div");
                document.getElementById("rapportYear").appendChild(elt);       
                elt.outerHTML = html;
        }
    }
}

// -------------------------------------------------------------FONCTIONS DE CALCUL-------------------------------------------

//permet au filtre de determiné si la mission de la durée est inférieure au prérequis d'affichage
function CaclculMinDuration(DateX,DateY){
    // var datumX = Date.parse(DateX);
    // var datumY = Date.parse(DateY);
 
    if(DateX>DateY){
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

function NmbrePourcentageGame (MissionId){

    var tableau_pourcentage={Nbremission:0,PourcentageSuperSucces:0,PourcentageSucces:0,PourcentageFail:0,PourcentageQuit:0,MoyDuration:0};

    var NbreMissionSuperSucces=0;
    var NbreMissionSucces=0;
    var NbreMissionFail=0;
    var NbreMissionQuit=0;
    var DurationTotale=0;

    for (var i=0;i<tableau_GameSessions.length;i++){

        if(tableau_GameSessions[i].MissionId==MissionId){
            tableau_pourcentage['Nbremission']+=1;
            DurationTotale+=tableau_GameSessions[i].Duration;
            switch (tableau_GameSessions[i].Succes) {
                case 1 :
                    NbreMissionSuperSucces+=1;
                break;
                case 2 :
                    NbreMissionSucces+=1;
                break;
                case 3 :
                    NbreMissionFail+=1;
                break;
                case 4 :
                    NbreMissionQuit+=1;
                break;
            }
        }        
    }
    if(tableau_pourcentage['Nbremission']!=0){
        tableau_pourcentage['PourcentageSuperSucces']=Math.trunc((NbreMissionSuperSucces/tableau_pourcentage['Nbremission'])*100)+"%";
        tableau_pourcentage['PourcentageSucces']=Math.trunc((NbreMissionSucces/tableau_pourcentage['Nbremission'])*100)+"%";
        tableau_pourcentage['PourcentageFail']=Math.trunc((NbreMissionFail/tableau_pourcentage['Nbremission'])*100)+"%";
        tableau_pourcentage['PourcentageQuit']=Math.trunc((NbreMissionQuit/tableau_pourcentage['Nbremission'])*100)+"%";
        tableau_pourcentage['MoyDuration']=Math.trunc(DurationTotale/tableau_pourcentage['Nbremission']/60)+"min";
    }
    else{
        tableau_pourcentage['PourcentageSuperSucces']="-";
        tableau_pourcentage['PourcentageSucces']="-";
        tableau_pourcentage['PourcentageFail']="-";
        tableau_pourcentage['PourcentageQuit']="-";
        tableau_pourcentage['MoyDuration']="-";
    }

    return tableau_pourcentage;  
}

function NmbrePourcentageGameYear (MissionId){

    var tableau_pourcentageYear={Nbremission:0,PourcentageSuperSucces:0,PourcentageSucces:0,PourcentageFail:0,PourcentageQuit:0,MoyDuration:0};

    var NbreMissionSuperSucces=0;
    var NbreMissionSucces=0;
    var NbreMissionFail=0;
    var NbreMissionQuit=0;
    var DurationTotale=0;

    for (var i=0;i<tableau_YearRapport.length;i++){

        if(tableau_YearRapport[i].Id==MissionId){
            tableau_pourcentageYear['Nbremission']=tableau_YearRapport[i].score.length;

            for (var j=0;j<tableau_YearRapport[i].score.length;j++){
                switch(tableau_YearRapport[i].score[j]){
                    case 1 :NbreMissionSuperSucces+=1;
                    break;
                    case 2 : NbreMissionSucces+=1;
                    break;
                    case 3 :NbreMissionFail+=1;
                    break;
                    case 4 :NbreMissionQuit+=1;
                    break;
                }
            }
            for (var k=0;k<tableau_YearRapport[i].duration.length;k++){
                DurationTotale+=tableau_YearRapport[i].duration[k];
            }
        
        }        
    }
    if(tableau_pourcentageYear['Nbremission']!=0){
        tableau_pourcentageYear['PourcentageSuperSucces']=Math.trunc((NbreMissionSuperSucces/tableau_pourcentageYear['Nbremission'])*100)+"%";
        tableau_pourcentageYear['PourcentageSucces']=Math.trunc((NbreMissionSucces/tableau_pourcentageYear['Nbremission'])*100)+"%";
        tableau_pourcentageYear['PourcentageFail']=Math.trunc((NbreMissionFail/tableau_pourcentageYear['Nbremission'])*100)+"%";
        tableau_pourcentageYear['PourcentageQuit']=Math.trunc((NbreMissionQuit/tableau_pourcentageYear['Nbremission'])*100)+"%";
        tableau_pourcentageYear['MoyDuration']=Math.trunc(DurationTotale/tableau_pourcentageYear['Nbremission']/60)+"min";
    }
    else{
        tableau_pourcentageYear['PourcentageSuperSucces']="-";
        tableau_pourcentageYear['PourcentageSucces']="-";
        tableau_pourcentageYear['PourcentageFail']="-";
        tableau_pourcentageYear['PourcentageQuit']="-";
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

// ------------------------function TEST--------------------------------------


function ToggleCalendar(){
    IsRapportYear=false;
    document.getElementById("calendarDiv").classList.remove("invis");
    document.getElementById("rapportDiv").classList.add("invis");
    document.getElementById("ToggleCalendar").classList.replace("btn-light","btn-dark");
    document.getElementById("ToggleRapport").classList.replace("btn-dark","btn-light");
    document.getElementById("buttonCalendar").classList.replace("d-none","d-flex");
    document.getElementById("buttonRapport").classList.replace("d-flex","d-none");
    checkDate();
    

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
}


function next(){
    if (IsRapportYear){
        var DateCalendar = (getNextYear(TransformDateFirstoftheMonth(datemois))).getTime();
        getAllRoom(SiteId,DateCalendar);
        calendar.nextYear();
        Year=Year+1;
        getYearRapport();
        checkDate();
         
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
    if (IsRapportYear){
        var DateCalendar = (getPrevYear(TransformDateFirstoftheMonth(datemois))).getTime();
        getAllRoom(SiteId,DateCalendar);
        calendar.prevYear();
        Year=Year-1;
        getYearRapport();
        checkDate();
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
    if (!format || !IsYearChecked)
        document.getElementById('date').innerHTML=datecalendrier;
    else   {
        document.getElementById('date').innerHTML = datecalendrier.split(" ")[1];
    }
}