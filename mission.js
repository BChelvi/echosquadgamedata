//on récupère l'id de mission depuis l'url
var GameSessionId=location.hash.substring(1,10);

//variable remplie par les Datas de la mission
var tableau_Mission=[];

//variable remplie par les coordonnées de la mission
var tableau_trajet=[];


//variables d'affichage 
var DateGameSession;

var StartGameSession;

var EndGameSession;

var DurationGameSession;

var Succes;


//variables permettant de manipuler la balise <canvas>
const canvas = document.querySelector('.trajet');

const ctx = canvas.getContext('2d');


// fonction appelée au chargement de la page mission.html
function initMission(){
    getGameSession();
}

// fonction AJAX qui récupère les datas de la mission
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

//fonction qui affiche les datas de la mission
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

//fonction qui formate la date
function TruncDate(){
    DateGameSession = tableau_Mission['StartDate'].substring(0,10);
    StartGameSession = tableau_Mission['StartDate'].substring(11,13)+"h"+tableau_Mission['StartDate'].substring(14,16);
    EndGameSession = tableau_Mission['EndDate'].substring(11,13)+"h"+tableau_Mission['EndDate'].substring(14,16);
}

//fonction qui remplie la variable de durée de la mission
function Calcul(){
    DurationGameSession = calculMinute(tableau_Mission['Duration']);    
}


//function qui transforme en minutes la Duration en secondes récupérée de la BDD
function calculMinute(secondes){
    var minutes = Math.floor(secondes / 60);
    timestring = minutes.toString().padStart(2, '0') + ' min'
    return timestring;
}

//function qui affiche différents taux de succes celon le Succes (integer) récupéré de la BDD
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


//function qui rempli tableau_trajet des coordonnées de la BDD
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

//function qui trace le trajet dans la balise <canvas>
function DrawTrajet(){

    //determiner le point de départ du trajet ainsi que le changement de repaire
    var x0=canvas.width/4;
    var y0=canvas.height/6;

    //couleur des points
    ctx.fillStyle = 'red';

    //point de départ du sous-marrin
    ctx.moveTo(x0,y0);

    //traçage de ligne à chaque points de coordonnées
    for (var i=0;i<tableau_trajet.length-1;i++){
        ctx.lineTo(parseInt(tableau_trajet[i+1][0])+x0, parseInt(tableau_trajet[i+1][2])+y0);
    }

    //remplissage du trait
    ctx.strokeStyle = 'red';
    ctx.stroke();

}

