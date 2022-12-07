var GameSessionId=location.hash.substring(1,10);

var tableau_Mission=[];

var DateGameSession;

var StartGameSession;

var EndGameSession;

var DurationGameSession;

var Succes;


function initMission(){
    getGameSession();
}

function ShowInfos(){
    TruncDate();
    Calcul();
    ShowSucces(tableau_Mission['Succes']);

    document.getElementById('Room').innerHTML=tableau_Mission['Room'].Name;
    document.getElementById('Site').innerHTML=tableau_Mission.SiteName;
    document.getElementById('Date').innerHTML=DateGameSession;
    document.getElementById('Start').innerHTML=StartGameSession;
    document.getElementById('End').innerHTML=EndGameSession;
    document.getElementById('Duration').innerHTML=DurationGameSession;
    document.getElementById('Type').innerHTML=tableau_Mission['MissionName'];
    document.getElementById('Succes').innerHTML=Succes;
    if(tableau_Mission['Deaths']!=null)
        document.getElementById('Deaths').innerHTML=tableau_Mission['Deaths'];
    else  document.getElementById('Deaths').innerHTML= "0";
    if (tableau_Mission['Redbuttons'])
    document.getElementById('Redbuttons').innerHTML=tableau_Mission['Redbuttons'];
    else document.getElementById('Redbuttons').innerHTML="0";
}

function getGameSession(){
    var httpRequest = new XMLHttpRequest();
    var hostserver = "api.php?action=getgamesession&GameSessionId="+GameSessionId;
    httpRequest.open("GET", hostserver);
    httpRequest.onload = () => {
        tableau_Mission = JSON.parse(httpRequest.responseText);       
        console.log(tableau_Mission)
        ShowInfos();
    };
    httpRequest.send();
}


function TruncDate(){
    DateGameSession = tableau_Mission['StartDate'].substring(0,10);
    StartGameSession = tableau_Mission['StartDate'].substring(11,13)+"h"+tableau_Mission['StartDate'].substring(14,16);
    EndGameSession = tableau_Mission['EndDate'].substring(11,13)+"h"+tableau_Mission['EndDate'].substring(14,16);
}


function Calcul(){
    DurationGameSession = calculMinute(tableau_Mission['Duration']);    
}


function calculMinute(secondes){
    var minutes = Math.floor(secondes / 60);
    timestring = minutes.toString().padStart(2, '0') + ' min'
    return timestring;
}

function ShowSucces(int){
    switch(parseInt(int)){
        case 0 : Succes = "Mission Abandonnée";
        break;
        case 1 : Succes = "R1";
        break;
        case 2 : Succes = "R2";
        break;
        case 3 : Succes = "R3";
        break;
        case 4 : Succes = "R4";
        break;
    }
}