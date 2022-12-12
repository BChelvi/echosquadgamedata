var GameSessionId=location.hash.substring(1,10);

var tableau_Mission=[];

var DateGameSession;

var StartGameSession;

var EndGameSession;

var DurationGameSession;

var Succes;

var tableau_trajet=[];

const canvas = document.querySelector('.trajet');

const ctx = canvas.getContext('2d');

// const width = canvas.width;

var template_position = `<div>
                            <div>World Position</div>
                            <div>%coord%</div>
                            <div>%direction%</div>
                        </div>`

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
        ShowInfos();
        SetCoord();
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

function SetCoord(){

    //On fixe les dimensions de la zone de dessin (canvas) sur les dimensions de l'image
    var map = document.querySelector('.map');
    canvas.width = map.width;
    canvas.height = map.height;

    //on remplie le tableau_trajet des coordonnées x et z du world position de la BDD pour chaque events POS_M
    
    for (var i=0;i<tableau_Mission['trajet'].length;i++){
        var coord = tableau_Mission['trajet'][i].WorldPosition.split(",");
        tableau_trajet.push(coord);
    }
    DrawTrajet();
}

function DrawTrajet(){

    //determiner le point de départ du trajet ainsi que le changement de repaire
    var x0=canvas.width/4;
    var y0=canvas.height/6;

    ctx.fillStyle = 'red';
    //point de départ du sous-marrin
    ctx.moveTo(x0,y0);

    //traçage de ligne à chaque points de coordonnées
    for (var i=0;i<tableau_trajet.length-1;i++){
        ctx.lineTo(parseInt(tableau_trajet[i+1][0])+x0, parseInt(tableau_trajet[i+1][2])+y0);
    }

    ctx.strokeStyle = 'red';
    ctx.stroke();

}

